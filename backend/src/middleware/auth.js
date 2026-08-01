const config = require('../config');
const logger = require('../utils/logger');

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey || apiKey !== config.API_KEY) {
    logger.warn('Unauthorized access attempt', { ip: req.ip });
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  next();
};

module.exports = authenticateApiKey;
