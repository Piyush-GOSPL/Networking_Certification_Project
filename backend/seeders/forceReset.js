const { sequelize, Certification, Topic, Question, Achievement, User, TestAttempt, Answer } = require('../models');
const seedData = require('./seedData');

async function forceReset() {
  try {
    console.log('Forcing sync and drop all tables...');
    await sequelize.sync({ force: true });
    
    console.log('Seeding certifications...');
    await Certification.bulkCreate(seedData.certifications);
    
    console.log('Seeding topics...');
    await Topic.bulkCreate(seedData.topics);
    
    console.log('Seeding questions...');
    await Question.bulkCreate(seedData.questions);
    
    console.log('Seeding achievements...');
    await Achievement.bulkCreate(seedData.achievements);
    
    console.log('Updating certification question counts...');
    for (const cert of seedData.certifications) {
      const count = await Question.count({ where: { certificationId: cert.id } });
      await Certification.update({ totalQuestions: count }, { where: { id: cert.id } });
    }
    
    console.log('Creating Admin user...');
    await User.create({
      fullName: 'Admin',
      mobile: '9999999999',
      email: 'admin@networkprep.com',
      password: 'admin123',
      role: 'admin',
      displayName: 'Admin',
    });
    
    console.log('Database reset and seeded successfully.');
  } catch (error) {
    console.error('Error during reset:', error);
  } finally {
    process.exit(0);
  }
}

forceReset();
