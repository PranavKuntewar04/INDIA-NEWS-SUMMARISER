require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  API_KEY: process.env.API_KEY || 'your-secret-api-key',
  DATA_DIR: process.env.DATA_DIR || './data/summaries',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  MAX_HISTORY: parseInt(process.env.MAX_HISTORY, 10) || 168,
};
