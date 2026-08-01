const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');

const summaryRoutes = require('./routes/summary');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimiter);

app.use('/api/summary', summaryRoutes);
app.use('/api/health', healthRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled application error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(config.PORT, () => {
  logger.info(`Backend API server running on port ${config.PORT}`);
  logger.info(`CORS allowed origin: ${config.CORS_ORIGIN}`);
});
