import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, errors, printf } = format;

const prettyConsoleJson = printf((info) => {
  return JSON.stringify(info, null, 2);
});

const formated = combine(
  errors({ stack: true }),
  timestamp({
    format: () => new Date(Date.now() - 3 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19)
  }),
  json()
)

const logger = createLogger({
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  format: formated,
  transports: [
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.Console({ format: combine(prettyConsoleJson) })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/uncaught-exceptions.log' }),
    new transports.Console({ format: combine(prettyConsoleJson) })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/uncaught-rejections.log' }),
    new transports.Console({ format: combine(prettyConsoleJson) })
  ]
});

export default logger;