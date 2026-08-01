const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  console[level === 'error' ? 'error' : 'log'](JSON.stringify({ timestamp, level, message, ...meta }));
};

module.exports = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta)
};
