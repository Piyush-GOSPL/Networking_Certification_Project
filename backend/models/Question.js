const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  certificationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  topicId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'multiple_select', 'true_false', 'scenario', 'configuration', 'topology', 'cli_output'),
    defaultValue: 'multiple_choice',
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  codeBlock: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  correctAnswer: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  topologyData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  timesAnswered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timesCorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Question;
