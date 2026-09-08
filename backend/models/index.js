const sequelize = require('../config/database');
const User = require('./User');
const Certification = require('./Certification');
const Topic = require('./Topic');
const Question = require('./Question');
const { TestAttempt, Answer, Achievement, UserAchievement } = require('./TestAttempt');

// Certification -> Topic
Certification.hasMany(Topic, { foreignKey: 'certificationId', as: 'topics' });
Topic.belongsTo(Certification, { foreignKey: 'certificationId', as: 'certification' });

// Certification -> Question
Certification.hasMany(Question, { foreignKey: 'certificationId', as: 'questions' });
Question.belongsTo(Certification, { foreignKey: 'certificationId', as: 'certification' });

// Topic -> Question
Topic.hasMany(Question, { foreignKey: 'topicId', as: 'questions' });
Question.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// User -> TestAttempt
User.hasMany(TestAttempt, { foreignKey: 'userId', as: 'attempts' });
TestAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Certification -> TestAttempt
Certification.hasMany(TestAttempt, { foreignKey: 'certificationId', as: 'attempts' });
TestAttempt.belongsTo(Certification, { foreignKey: 'certificationId', as: 'certification' });

// TestAttempt -> Answer
TestAttempt.hasMany(Answer, { foreignKey: 'attemptId', as: 'answers' });
Answer.belongsTo(TestAttempt, { foreignKey: 'attemptId', as: 'attempt' });

// Question -> Answer
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User -> UserAchievement
User.hasMany(UserAchievement, { foreignKey: 'userId', as: 'userAchievements' });
UserAchievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Achievement -> UserAchievement
Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId', as: 'userAchievements' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId', as: 'achievement' });

module.exports = {
  sequelize,
  User,
  Certification,
  Topic,
  Question,
  TestAttempt,
  Answer,
  Achievement,
  UserAchievement,
};
