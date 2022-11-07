// Load config from .env file
require('dotenv').config()

const LEVEL = process.env.LOG_LEVEL ?? 'info'
const winston = require('winston')

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  debug: {
    level: 'debug',
    filename: './logs/debug.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.debug)
  ],
  exitOnError: false
})


module.exports = logger