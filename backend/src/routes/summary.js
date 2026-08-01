const express = require('express');
const router = express.Router();
const storageService = require('../services/storageService');
const authenticateApiKey = require('../middleware/auth');
const validateSummaryPayload = require('../middleware/validator');
const logger = require('../utils/logger');

router.post('/', authenticateApiKey, validateSummaryPayload, (req, res) => {
  try {
    const payload = req.body;
    storageService.saveSummary(payload);
    res.status(201).json({ message: 'Summary saved successfully', id: payload.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while saving summary' });
  }
});

router.get('/latest', (req, res) => {
  try {
    const summary = storageService.getLatestSummary();
    if (!summary) {
      return res.status(404).json({ error: 'No summary available yet' });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while retrieving summary' });
  }
});

router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const history = storageService.getHistory(limit, offset);
    res.json({ history, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while retrieving history' });
  }
});

module.exports = router;
