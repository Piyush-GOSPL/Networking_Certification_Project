require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sequelize, User, Certification, Topic, Question, Achievement } = require('../models');

async function seedDatabase() {
  console.log('🚀 Starting database migration and seeding...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not defined in environment variables or .env file.');
    console.error('Please configure DATABASE_URL (e.g. your Neon Postgres connection string) before running seed.\n');
    process.exit(1);
  }

  try {
    console.log('📡 Testing connection to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully.');

    console.log('🔄 Syncing database tables (alter: true)...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database schema synchronized.');

    // Check if certification data exists
    const certCount = await Certification.count();
    if (certCount === 0) {
      console.log('\n🌱 Seeding initial test data...');
      const seedData = require('../seeders/seedData');

      // Seed certifications
      await Certification.bulkCreate(seedData.certifications);
      console.log(`  ✓ Seeded ${seedData.certifications.length} certifications`);

      // Seed topics
      await Topic.bulkCreate(seedData.topics);
      console.log(`  ✓ Seeded ${seedData.topics.length} topics`);

      // Seed questions
      await Question.bulkCreate(seedData.questions);
      console.log(`  ✓ Seeded ${seedData.questions.length} questions`);

      // Seed achievements
      await Achievement.bulkCreate(seedData.achievements);
      console.log(`  ✓ Seeded ${seedData.achievements.length} achievements`);

      // Update certification question counts
      console.log('  ✓ Updating certification question counts...');
      for (const cert of seedData.certifications) {
        const count = await Question.count({ where: { certificationId: cert.id } });
        await Certification.update({ totalQuestions: count }, { where: { id: cert.id } });
      }

      console.log('✅ Initial test data seeded successfully!');
    } else {
      console.log(`ℹ️ Database already has ${certCount} certifications. Skipping catalog seed.`);
    }

    // Ensure admin user exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      await User.create({
        fullName: 'Admin',
        mobile: '9999999999',
        email: 'admin@networkprep.com',
        password: adminPassword,
        role: 'admin',
        displayName: 'Admin',
      });
      console.log(`\n👑 Admin user created!`);
      console.log(`   Mobile: 9999999999`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    console.log('\n✨ Database migration and seeding completed successfully!\n');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database migration/seeding failed:', error);
    if (sequelize) {
      await sequelize.close().catch(() => {});
    }
    process.exit(1);
  }
}

seedDatabase();
