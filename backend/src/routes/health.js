const express = require('express');
const router = express.Router();
const storageService = require('../services/storageService');

router.get('/', (req, res) => {
  let summaryFreshness = null;
  try {
    const latest = storageService.getLatestSummary();
    if (latest && latest.timestamp) {
      summaryFreshness = latest.timestamp;
    }
  } catch (err) {
    // ignore
  }

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    latestSummaryTimestamp: summaryFreshness
  });
});

module.exports = router;
