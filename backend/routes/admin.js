const express = require('express');
const { Op } = require('sequelize');
const { User, Certification, Topic, Question, TestAttempt, Answer, Achievement, UserAchievement } = require('../models');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const { put } = require('@vercel/blob');

const router = express.Router();

// File upload config (in-memory for serverless compatibility)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const activeUsers = await User.count({
      where: { role: 'user', isActive: true, lastActivity: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });
    const totalQuestions = await Question.count({ where: { isActive: true } });
    const totalCertifications = await Certification.count({ where: { isActive: true } });
    const totalTests = await TestAttempt.count({ where: { status: 'completed' } });
    const avgScore = await TestAttempt.findOne({
      attributes: [[require('../config/database').fn('AVG', require('../config/database').col('score')), 'avg']],
      where: { status: 'completed' },
      raw: true,
    });

    const recentUsers = await User.findAll({
      where: { role: 'user' },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'fullName', 'mobile', 'email', 'createdAt', 'lastActivity'],
    });

    const recentTests = await TestAttempt.findAll({
      where: { status: 'completed' },
      include: [
        { model: User, as: 'user', attributes: ['fullName'] },
        { model: Certification, as: 'certification', attributes: ['name', 'code'] },
      ],
      order: [['completedAt', 'DESC']],
      limit: 10,
    });

    res.json({
      totalUsers,
      activeUsers,
      totalQuestions,
      totalCertifications,
      totalTests,
      avgScore: Math.round(avgScore?.avg || 0),
      recentUsers,
      recentTests,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// ─── QUESTION MANAGEMENT ────────────────────────────────────

// Get all questions with filters
router.get('/questions', adminAuth, async (req, res) => {
  try {
    const { certificationId, topicId, difficulty, type, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (certificationId) where.certificationId = certificationId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;
    if (search) {
      where.questionText = { [Op.like]: `%${search}%` };
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Question.findAndCountAll({
      where,
      include: [
        { model: Certification, as: 'certification', attributes: ['name', 'code'] },
        { model: Topic, as: 'topic', attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ questions: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Create question
router.post('/questions', adminAuth, async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Update question
router.put('/questions/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    await question.update(req.body);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question
router.delete('/questions/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    await question.destroy();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Duplicate question
router.post('/questions/:id/duplicate', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    const data = question.toJSON();
    delete data.id;
    data.questionCode = data.questionCode ? data.questionCode + '-COPY' : null;
    const newQuestion = await Question.create(data);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate question' });
  }
});

// Bulk import questions
router.post('/questions/bulk', adminAuth, async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'No questions provided' });
    }
    const created = await Question.bulkCreate(questions);
    res.status(201).json({ count: created.length, message: `${created.length} questions imported` });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import questions' });
  }
});

// Upload image to Vercel Blob
router.post('/upload', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.status(500).json({
        error: 'Vercel Blob is not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.',
      });
    }

    const safeFilename = `questions/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(safeFilename, req.file.buffer, {
      access: 'public',
      token,
      contentType: req.file.mimetype,
    });

    res.json({
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    res.status(500).json({ error: 'Failed to upload image to Vercel Blob: ' + error.message });
  }
});

// ─── USER MANAGEMENT ────────────────────────────────────────

router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = { role: 'user' };
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const usersWithStats = await Promise.all(
      rows.map(async (user) => {
        const testsCompleted = await TestAttempt.count({ where: { userId: user.id, status: 'completed' } });
        const avgScore = await TestAttempt.findOne({
          attributes: [[require('../config/database').fn('AVG', require('../config/database').col('score')), 'avg']],
          where: { userId: user.id, status: 'completed' },
          raw: true,
        });
        return { ...user.toJSON(), testsCompleted, avgScore: Math.round(avgScore?.avg || 0) };
      })
    );

    res.json({ users: usersWithStats, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/toggle', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'enabled' : 'disabled'}`, user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await Answer.destroy({ where: { attemptId: { [Op.in]: (await TestAttempt.findAll({ where: { userId: user.id }, attributes: ['id'] })).map(t => t.id) } } });
    await TestAttempt.destroy({ where: { userId: user.id } });
    await UserAchievement.destroy({ where: { userId: user.id } });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user test history (admin)
router.get('/users/:id/history', adminAuth, async (req, res) => {
  try {
    const tests = await TestAttempt.findAll({
      where: { userId: req.params.id, status: 'completed' },
      include: [{ model: Certification, as: 'certification', attributes: ['name', 'code'] }],
      order: [['completedAt', 'DESC']],
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

// ─── CERTIFICATION MANAGEMENT ─────────────────────────────────

router.post('/certifications', adminAuth, async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create certification' });
  }
});

router.put('/certifications/:id', adminAuth, async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    await cert.update(req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update certification' });
  }
});

router.delete('/certifications/:id', adminAuth, async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    await cert.destroy();
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

// ─── TOPIC MANAGEMENT ──────────────────────────────────────────

router.get('/topics', adminAuth, async (req, res) => {
  try {
    const { certificationId } = req.query;
    const where = {};
    if (certificationId) where.certificationId = certificationId;
    const topics = await Topic.findAll({
      where,
      include: [{ model: Certification, as: 'certification', attributes: ['name', 'code'] }],
      order: [['order', 'ASC']],
    });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

router.post('/topics', adminAuth, async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

router.put('/topics/:id', adminAuth, async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    await topic.update(req.body);
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

router.delete('/topics/:id', adminAuth, async (req, res) => {
  try {
    await Topic.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// ─── RESULTS MANAGEMENT ──────────────────────────────────────

router.get('/results', adminAuth, async (req, res) => {
  try {
    const { certificationId, page = 1, limit = 20 } = req.query;
    const where = { status: 'completed' };
    if (certificationId) where.certificationId = certificationId;
    const offset = (page - 1) * limit;
    const { count, rows } = await TestAttempt.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['fullName', 'mobile'] },
        { model: Certification, as: 'certification', attributes: ['name', 'code'] },
      ],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({ results: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
