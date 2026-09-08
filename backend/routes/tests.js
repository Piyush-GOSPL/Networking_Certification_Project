const express = require('express');
const { Op } = require('sequelize');
const { Question, Certification, Topic, TestAttempt, Answer } = require('../models');
const { auth } = require('../middleware/auth');
const sequelize = require('../config/database');

const router = express.Router();

// Generate test questions
router.post('/generate', auth, async (req, res) => {
  try {
    const { certificationId, difficulty, questionCount, mode, selectedTopics } = req.body;
    if (!certificationId || !questionCount) {
      return res.status(400).json({ error: 'Certification and question count required' });
    }
    const certification = await Certification.findByPk(certificationId);
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    const where = { certificationId, isActive: true };
    if (difficulty && difficulty !== 'mixed') {
      where.difficulty = difficulty;
    }
    if (selectedTopics && selectedTopics.length > 0) {
      where.topicId = { [Op.in]: selectedTopics };
    }

    let questions = await Question.findAll({ where });

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);

    // If mixed difficulty, try to balance
    if (difficulty === 'mixed' && questions.length >= questionCount) {
      const easy = questions.filter(q => q.difficulty === 'easy');
      const medium = questions.filter(q => q.difficulty === 'medium');
      const hard = questions.filter(q => q.difficulty === 'hard');
      
      const easyCount = Math.round(questionCount * 0.3);
      const hardCount = Math.round(questionCount * 0.2);
      const mediumCount = questionCount - easyCount - hardCount;

      const selected = [
        ...easy.slice(0, easyCount),
        ...medium.slice(0, mediumCount),
        ...hard.slice(0, hardCount),
      ];

      // Fill remaining if not enough in a category
      if (selected.length < questionCount) {
        const selectedIds = new Set(selected.map(q => q.id));
        const remaining = questions.filter(q => !selectedIds.has(q.id));
        selected.push(...remaining.slice(0, questionCount - selected.length));
      }
      questions = selected.sort(() => Math.random() - 0.5);
    } else {
      questions = questions.slice(0, questionCount);
    }

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for the selected criteria' });
    }

    const timeLimit = mode === 'exam' ? Math.ceil(questions.length * 1.5) : 0;

    // Create test attempt
    const attempt = await TestAttempt.create({
      userId: req.user.id,
      certificationId,
      mode: mode || 'practice',
      difficulty: difficulty || 'mixed',
      totalQuestions: questions.length,
      timeLimit: timeLimit * 60,
      selectedTopics: selectedTopics || [],
      questionIds: questions.map(q => q.id),
    });

    // Create answer records
    await Promise.all(
      questions.map(q =>
        Answer.create({ attemptId: attempt.id, questionId: q.id })
      )
    );

    // Prepare questions for response (hide correct answers in exam mode)
    const preparedQuestions = questions.map(q => {
      const qData = q.toJSON();
      // Randomize option order
      if (qData.options && qData.options.length > 0) {
        const optionPairs = qData.options.map((opt, i) => ({ opt, originalIndex: String.fromCharCode(65 + i) }));
        const shuffled = optionPairs.sort(() => Math.random() - 0.5);
        qData.options = shuffled.map(p => p.opt);
        qData._optionMap = shuffled.reduce((acc, p, newIndex) => {
          acc[String.fromCharCode(65 + newIndex)] = p.originalIndex;
          return acc;
        }, {});
      }
      if (mode === 'exam') {
        delete qData.correctAnswer;
        delete qData.explanation;
      }
      return qData;
    });

    res.json({
      attempt: attempt.toJSON(),
      questions: preparedQuestions,
      certification: certification.toJSON(),
      timeLimit: timeLimit * 60,
    });
  } catch (error) {
    console.error('Generate test error:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

// Submit answer for a question
router.put('/attempt/:attemptId/answer', auth, async (req, res) => {
  try {
    const { questionId, userAnswer, isMarked, timeTaken } = req.body;
    const attempt = await TestAttempt.findByPk(req.params.attemptId);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }
    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ error: 'Test already completed' });
    }

    const answer = await Answer.findOne({
      where: { attemptId: attempt.id, questionId },
    });
    if (!answer) {
      return res.status(404).json({ error: 'Question not found in this test' });
    }

    const question = await Question.findByPk(questionId);
    let isCorrect = false;

    if (userAnswer !== null && userAnswer !== undefined) {
      if (Array.isArray(question.correctAnswer)) {
        isCorrect = Array.isArray(userAnswer) && 
          userAnswer.length === question.correctAnswer.length &&
          userAnswer.every(a => question.correctAnswer.includes(a));
      } else {
        isCorrect = userAnswer === question.correctAnswer;
      }
    }

    answer.userAnswer = userAnswer;
    answer.isCorrect = isCorrect;
    answer.isMarked = isMarked || false;
    answer.timeTaken = timeTaken || 0;
    await answer.save();

    // Update question analytics
    question.timesAnswered += 1;
    if (isCorrect) question.timesCorrect += 1;
    await question.save();

    // For practice mode, return feedback
    if (attempt.mode === 'practice') {
      return res.json({
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    res.json({ saved: true });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Submit test
router.post('/attempt/:attemptId/submit', auth, async (req, res) => {
  try {
    const { suspiciousEvents } = req.body;
    const attempt = await TestAttempt.findByPk(req.params.attemptId, {
      include: [{ model: Answer, as: 'answers', include: [{ model: Question, as: 'question', include: [{ model: Topic, as: 'topic' }] }] }],
    });
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }
    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ error: 'Test already submitted' });
    }

    const answers = attempt.answers;
    let correct = 0, incorrect = 0, skipped = 0;
    const topicPerformance = {};

    answers.forEach(a => {
      const topicName = a.question?.topic?.name || 'General';
      if (!topicPerformance[topicName]) {
        topicPerformance[topicName] = { correct: 0, total: 0 };
      }
      topicPerformance[topicName].total += 1;

      if (a.userAnswer === null || a.userAnswer === undefined) {
        skipped += 1;
      } else if (a.isCorrect) {
        correct += 1;
        topicPerformance[topicName].correct += 1;
      } else {
        incorrect += 1;
      }
    });

    const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
    const timeTaken = Math.floor((new Date() - new Date(attempt.startedAt)) / 1000);

    attempt.correctAnswers = correct;
    attempt.incorrectAnswers = incorrect;
    attempt.skippedAnswers = skipped;
    attempt.score = score;
    attempt.timeTaken = timeTaken;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    if (suspiciousEvents) {
      attempt.suspiciousEvents = suspiciousEvents;
    }
    await attempt.save();

    const certification = await Certification.findByPk(attempt.certificationId);
    const passed = score >= (certification?.passingScore <= 100 ? certification.passingScore : 70);

    res.json({
      score,
      correct,
      incorrect,
      skipped,
      total: answers.length,
      timeTaken,
      passed,
      topicPerformance,
      certificationName: certification?.name,
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// Log suspicious event
router.post('/attempt/:attemptId/suspicious', auth, async (req, res) => {
  try {
    const { event } = req.body;
    const attempt = await TestAttempt.findByPk(req.params.attemptId);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }
    const events = attempt.suspiciousEvents || [];
    events.push({ ...event, timestamp: new Date() });
    attempt.suspiciousEvents = events;
    await attempt.save();
    res.json({ logged: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log event' });
  }
});

// Get attempt results
router.get('/attempt/:attemptId/results', auth, async (req, res) => {
  try {
    const attempt = await TestAttempt.findByPk(req.params.attemptId, {
      include: [
        { model: Answer, as: 'answers', include: [{ model: Question, as: 'question', include: [{ model: Topic, as: 'topic' }] }] },
        { model: Certification, as: 'certification' },
      ],
    });
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Results not found' });
    }

    const topicPerformance = {};
    attempt.answers.forEach(a => {
      const topicName = a.question?.topic?.name || 'General';
      if (!topicPerformance[topicName]) {
        topicPerformance[topicName] = { correct: 0, total: 0 };
      }
      topicPerformance[topicName].total += 1;
      if (a.isCorrect) topicPerformance[topicName].correct += 1;
    });

    res.json({
      attempt: attempt.toJSON(),
      topicPerformance,
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get user's test history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await TestAttempt.findAndCountAll({
      where: { userId: req.user.id, status: 'completed' },
      include: [{ model: Certification, as: 'certification', attributes: ['name', 'code', 'color', 'icon'] }],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({ tests: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
});

module.exports = router;
