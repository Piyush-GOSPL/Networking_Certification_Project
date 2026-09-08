const express = require('express');
const { Certification, Topic, Question } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const { level } = req.query;
    const where = { isActive: true };
    if (level) where.level = level;
    const certifications = await Certification.findAll({
      where,
      include: [{ model: Topic, as: 'topics', attributes: ['id', 'name'] }],
      order: [['order', 'ASC']],
    });
    // Add question count to each certification
    const result = await Promise.all(
      certifications.map(async (cert) => {
        const questionCount = await Question.count({ where: { certificationId: cert.id, isActive: true } });
        return { ...cert.toJSON(), questionCount };
      })
    );
    res.json(result);
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// Get certification by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const certification = await Certification.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{ model: Topic, as: 'topics', attributes: ['id', 'name', 'description'], order: [['order', 'ASC']] }],
    });
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    const questionCount = await Question.count({ where: { certificationId: certification.id, isActive: true } });
    const difficultyCount = {
      easy: await Question.count({ where: { certificationId: certification.id, difficulty: 'easy', isActive: true } }),
      medium: await Question.count({ where: { certificationId: certification.id, difficulty: 'medium', isActive: true } }),
      hard: await Question.count({ where: { certificationId: certification.id, difficulty: 'hard', isActive: true } }),
    };
    res.json({ ...certification.toJSON(), questionCount, difficultyCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
});

// Get certification by ID
router.get('/:id', async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id, {
      include: [{ model: Topic, as: 'topics' }],
    });
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    const questionCount = await Question.count({ where: { certificationId: certification.id, isActive: true } });
    res.json({ ...certification.toJSON(), questionCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
});

module.exports = router;
