const winston = require('winston');
const config = require('../config');

// Formats Log Messages so they don't suck
const template = (log) => 
`${log.timestamp} - [${log.level}]: ${log.stack || log.message}`;

// Winston Logger config. Uses logging block in config.js
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((log) => template(log))
    ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: config.logging.logFile })
  ]
});

module.exports = logger;