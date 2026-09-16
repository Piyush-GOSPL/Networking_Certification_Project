require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Root ping route for convenience
app.get('/', (req, res) => {
  res.json({ message: 'NetworkPrep API is running', health: '/api/health' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Guard app.listen so Vercel can run the app as a serverless function
if (process.env.VERCEL !== '1') {
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Connected to database');
      app.listen(PORT, () => {
        console.log(`\n🚀 NetworkPrep API Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
      });
    })
    .catch((err) => {
      console.error('⚠️ Database connection error:', err.message);
      // Start server anyway so health check and other diagnostics are accessible
      app.listen(PORT, () => {
        console.log(`\n🚀 NetworkPrep API Server running on http://localhost:${PORT} (without DB connection)`);
      });
    });
}

module.exports = app;
