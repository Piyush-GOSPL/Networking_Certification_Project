const express = require('express');
const { Op } = require('sequelize');
const { User, TestAttempt, Answer, Question, Certification, Topic, Achievement, UserAchievement } = require('../models');
const { auth } = require('../middleware/auth');
const sequelize = require('../config/database');

const router = express.Router();

// Dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const completedTests = await TestAttempt.findAll({
      where: { userId, status: 'completed' },
      include: [{ model: Certification, as: 'certification', attributes: ['name', 'code', 'color'] }],
      order: [['completedAt', 'DESC']],
    });

    const totalTests = completedTests.length;
    const totalQuestions = completedTests.reduce((sum, t) => sum + t.totalQuestions, 0);
    const avgScore = totalTests > 0 ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / totalTests) : 0;
    const bestScore = totalTests > 0 ? Math.max(...completedTests.map(t => t.score)) : 0;
    const lowestScore = totalTests > 0 ? Math.min(...completedTests.map(t => t.score)) : 0;
    const recentTests = completedTests.slice(0, 5);

    // Score over time
    const scoreHistory = completedTests.slice(0, 20).reverse().map(t => ({
      date: t.completedAt,
      score: t.score,
      cert: t.certification?.code,
    }));

    // Topic performance
    const answers = await Answer.findAll({
      where: { attemptId: { [Op.in]: completedTests.map(t => t.id) } },
      include: [{ model: Question, as: 'question', include: [{ model: Topic, as: 'topic' }] }],
    });

    const topicStats = {};
    answers.forEach(a => {
      const topicName = a.question?.topic?.name || 'General';
      if (!topicStats[topicName]) topicStats[topicName] = { correct: 0, total: 0 };
      topicStats[topicName].total += 1;
      if (a.isCorrect) topicStats[topicName].correct += 1;
    });

    const topicPerformance = Object.entries(topicStats).map(([name, stats]) => ({
      name,
      score: Math.round((stats.correct / stats.total) * 100),
      total: stats.total,
      correct: stats.correct,
    })).sort((a, b) => a.score - b.score);

    // Weak topics
    const weakTopics = topicPerformance.filter(t => t.score < 70).slice(0, 5);

    // Achievements
    const userAchievements = await UserAchievement.findAll({
      where: { userId },
      include: [{ model: Achievement, as: 'achievement' }],
    });

    res.json({
      totalTests,
      totalQuestions,
      avgScore,
      bestScore,
      lowestScore,
      recentTests,
      scoreHistory,
      topicPerformance,
      weakTopics,
      achievements: userAchievements,
      overallProgress: Math.min(Math.round((totalTests / 50) * 100), 100),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const completedTests = await TestAttempt.findAll({
      where: { userId, status: 'completed' },
      include: [
        { model: Certification, as: 'certification' },
        { model: Answer, as: 'answers', include: [{ model: Question, as: 'question', include: [{ model: Topic, as: 'topic' }] }] },
      ],
      order: [['completedAt', 'DESC']],
    });

    const totalTests = completedTests.length;
    if (totalTests === 0) {
      return res.json({ totalTests: 0, message: 'No tests completed yet' });
    }

    const avgScore = Math.round(completedTests.reduce((s, t) => s + t.score, 0) / totalTests);
    const bestScore = Math.max(...completedTests.map(t => t.score));
    const lowestScore = Math.min(...completedTests.map(t => t.score));

    // All answers analytics
    const allAnswers = completedTests.flatMap(t => t.answers);
    const totalAnswered = allAnswers.filter(a => a.userAnswer !== null).length;
    const totalCorrect = allAnswers.filter(a => a.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const avgTimePerQuestion = totalAnswered > 0 ? Math.round(allAnswers.reduce((s, a) => s + (a.timeTaken || 0), 0) / totalAnswered) : 0;

    // Cert performance
    const certPerformance = {};
    completedTests.forEach(t => {
      const certName = t.certification?.name || 'Unknown';
      if (!certPerformance[certName]) certPerformance[certName] = { scores: [], tests: 0 };
      certPerformance[certName].scores.push(t.score);
      certPerformance[certName].tests += 1;
    });

    const certStats = Object.entries(certPerformance).map(([name, data]) => ({
      name,
      avgScore: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length),
      tests: data.tests,
      bestScore: Math.max(...data.scores),
    }));

    // Topic performance
    const topicStats = {};
    allAnswers.forEach(a => {
      const topicName = a.question?.topic?.name || 'General';
      if (!topicStats[topicName]) topicStats[topicName] = { correct: 0, total: 0 };
      topicStats[topicName].total += 1;
      if (a.isCorrect) topicStats[topicName].correct += 1;
    });

    const topicPerformance = Object.entries(topicStats).map(([name, s]) => ({
      name, score: Math.round((s.correct / s.total) * 100), total: s.total,
    })).sort((a, b) => a.score - b.score);

    const weakest = topicPerformance[0];
    const recommendation = weakest ? `Your weakest topic is ${weakest.name} (${weakest.score}%). Focus on improving this area.` : null;

    res.json({
      totalTests,
      avgScore,
      bestScore,
      lowestScore,
      accuracy,
      avgTimePerQuestion,
      totalQuestionsAnswered: totalAnswered,
      totalCorrect,
      certStats,
      topicPerformance,
      recommendation,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isActive: true, showOnLeaderboard: true, role: 'user' },
      attributes: ['id', 'displayName', 'fullName'],
    });

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const tests = await TestAttempt.findAll({
          where: { userId: user.id, status: 'completed' },
        });
        if (tests.length === 0) return null;
        const avgScore = Math.round(tests.reduce((s, t) => s + t.score, 0) / tests.length);
        const bestScore = Math.max(...tests.map(t => t.score));
        return {
          id: user.id,
          name: user.displayName || user.fullName,
          testsCompleted: tests.length,
          avgScore,
          bestScore,
        };
      })
    );

    const filtered = leaderboard.filter(Boolean).sort((a, b) => b.avgScore - a.avgScore).slice(0, 50);
    filtered.forEach((entry, i) => { entry.rank = i + 1; });

    res.json(filtered);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ certifications: [], topics: [] });
    }
    const certifications = await Certification.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { code: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
        isActive: true,
      },
    });
    const topics = await Topic.findAll({
      where: { name: { [Op.like]: `%${q}%` }, isActive: true },
      include: [{ model: Certification, as: 'certification', attributes: ['name', 'code', 'slug'] }],
    });
    res.json({ certifications, topics });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
