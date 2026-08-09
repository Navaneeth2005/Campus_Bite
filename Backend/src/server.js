const connectDB = require('./config/db');
const env = require('./config/env');
const app = require('./app');

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Campus Bite API running on http://localhost:${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const shutdown = async () => {
  console.log('\nShutting down...');
  const mongoose = require('mongoose');
  await mongoose.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
