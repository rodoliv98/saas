import { createLogger, format, config } from 'winston';
import {
  devExceptionHandlers, 
  devRejectionHandlers, 
  devTransport,
} from './winston-helper';
const { combine, timestamp, json, errors } = format;

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

/*
  {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  }
*/
// mudar assim que possível pra grafana ou outra coisa
const logger = createLogger({
  levels: config.syslog.levels,
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  format: formated,
  transports: devTransport,
  exceptionHandlers: devExceptionHandlers,
  rejectionHandlers: devRejectionHandlers
  // transports: process.env.NODE_ENV === 'prod' ? prodTransport : devTransport,
  // exceptionHandlers: process.env.NODE_ENV === 'prod' ? prodExceptionHandlers : devExceptionHandlers,
  // rejectionHandlers: process.env.NODE_ENV === 'prod' ? prodRejectionHandlers : devRejectionHandlers
});

export default logger;