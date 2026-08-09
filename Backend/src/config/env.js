require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_bite',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  isProduction: (process.env.NODE_ENV || 'development') === 'production'
};

if (!env.jwtSecret || env.jwtSecret === 'replace_with_a_long_random_string') {
  console.warn('WARNING: JWT_SECRET is not set or is a placeholder. Set it in .env before deploying.');
}

module.exports = env;
