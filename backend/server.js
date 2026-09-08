require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, User, Certification, Topic, Question, Achievement } = require('./models');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Database sync and seed
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced successfully');

    // Check if data exists
    const certCount = await Certification.count();
    if (certCount === 0) {
      console.log('Seeding database...');
      const seedData = require('./seeders/seedData');

      // Seed certifications
      await Certification.bulkCreate(seedData.certifications);
      console.log(`Seeded ${seedData.certifications.length} certifications`);

      // Seed topics
      await Topic.bulkCreate(seedData.topics);
      console.log(`Seeded ${seedData.topics.length} topics`);

      // Seed questions
      await Question.bulkCreate(seedData.questions);
      console.log(`Seeded ${seedData.questions.length} questions`);

      // Seed achievements
      await Achievement.bulkCreate(seedData.achievements);
      console.log(`Seeded ${seedData.achievements.length} achievements`);

      // Update certification question counts
      for (const cert of seedData.certifications) {
        const count = await Question.count({ where: { certificationId: cert.id } });
        await Certification.update({ totalQuestions: count }, { where: { id: cert.id } });
      }

      console.log('Database seeded successfully!');
    }

    // Create admin user if not exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        fullName: 'Admin',
        mobile: '9999999999',
        email: 'admin@networkprep.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        displayName: 'Admin',
      });
      console.log('Admin user created (mobile: 9999999999, password: admin123)');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 NetworkPrep API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
  });
});

module.exports = app;
