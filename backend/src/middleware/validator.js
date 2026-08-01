const logger = require('../utils/logger');

const validateSummaryPayload = (req, res, next) => {
  const payload = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Payload is missing' });
  }

  const requiredFields = ['timestamp', 'categories'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      logger.warn(`Validation failed: missing ${field}`);
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  if (!Array.isArray(payload.categories)) {
    return res.status(400).json({ error: '"categories" must be an array' });
  }

  next();
};

module.exports = validateSummaryPayload;
