const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestAttempt = sequelize.define('TestAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  certificationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('practice', 'exam'),
    defaultValue: 'practice',
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'mixed',
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  incorrectAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  skippedAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress',
  },
  selectedTopics: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  questionIds: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  suspiciousEvents: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  attemptId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userAnswer: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isMarked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '🏆',
  },
  criteria: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general',
  },
});

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  achievementId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  earnedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = { TestAttempt, Answer, Achievement, UserAchievement };
