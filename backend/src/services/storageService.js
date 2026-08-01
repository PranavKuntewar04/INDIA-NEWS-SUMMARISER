const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

const getLatestSummaryPath = () => path.join(config.DATA_DIR, 'latest.json');

const ensureDataDir = () => {
  if (!fs.existsSync(config.DATA_DIR)) {
    fs.mkdirSync(config.DATA_DIR, { recursive: true });
  }
};

const saveSummary = (payload) => {
  try {
    ensureDataDir();
    const tempPath = path.join(config.DATA_DIR, `latest.tmp.${Date.now()}.json`);
    const finalPath = getLatestSummaryPath();
    const archivePath = path.join(config.DATA_DIR, `${payload.id || Date.now()}.json`);
    
    const data = JSON.stringify(payload, null, 2);
    
    fs.writeFileSync(archivePath, data, 'utf8');
    
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, finalPath);
    
    logger.info(`Successfully saved summary ${payload.id || ''}`);
    
    setTimeout(() => cleanupOldArchives(), 100);
    
    return true;
  } catch (error) {
    logger.error('Failed to save summary', { error: error.message });
    throw error;
  }
};

const getLatestSummary = () => {
  try {
    const filePath = getLatestSummaryPath();
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to read latest summary', { error: error.message });
    throw error;
  }
};

const getHistory = (limit = 10, offset = 0) => {
  try {
    ensureDataDir();
    const files = fs.readdirSync(config.DATA_DIR)
      .filter(file => file.endsWith('.json') && file !== 'latest.json' && !file.includes('.tmp.'))
      .sort()
      .reverse();

    const paginated = files.slice(offset, offset + limit);
    return paginated.map(file => {
      const filePath = path.join(config.DATA_DIR, file);
      const stat = fs.statSync(filePath);
      return { file, size: stat.size, createdAt: stat.birthtime };
    });
  } catch (error) {
    logger.error('Failed to get history', { error: error.message });
    throw error;
  }
};

const cleanupOldArchives = () => {
  try {
    ensureDataDir();
    const now = Date.now();
    const maxAgeMs = config.MAX_HISTORY * 60 * 60 * 1000;
    
    const files = fs.readdirSync(config.DATA_DIR);
    let deletedCount = 0;

    files.forEach(file => {
      if (!file.endsWith('.json') || file === 'latest.json') return;
      
      const filePath = path.join(config.DATA_DIR, file);
      const stat = fs.statSync(filePath);
      
      if (now - stat.birthtimeMs > maxAgeMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      logger.info(`Cleaned up ${deletedCount} old archive files`);
    }
  } catch (error) {
    logger.error('Failed during archive cleanup', { error: error.message });
  }
};

module.exports = {
  saveSummary,
  getLatestSummary,
  getHistory,
  cleanupOldArchives
};
