import { transports, format } from "winston";
const { printf, combine } = format;

const prettyConsoleJson = printf((info) => {
  return JSON.stringify(info, null, 2);
});

// TRANSPORTS
// export const prodTransport = [
//   new transports.File({ filename: 'logs/combined.log' }),
//   new transports.File({ filename: 'logs/warning.log', level: 'warning' })
// ];

export const devTransport = [
  // new transports.File({ filename: 'logs/combined.log' }),
  // new transports.File({ filename: 'logs/warning.log', level: 'warning' }),
  new transports.Console({ format: combine(prettyConsoleJson) })
];

// EXCEPTION HANDLERS
// export const prodExceptionHandlers = [
//   new transports.File({ filename: 'logs/uncaught-exceptions.log' })
// ];

export const devExceptionHandlers = [
  // new transports.File({ filename: 'logs/uncaught-exceptions.log' }),
  new transports.Console({ format: combine(prettyConsoleJson) })
];

// REJECTION HANDLERS
// export const prodRejectionHandlers = [
//   new transports.File({ filename: 'logs/uncaught-rejections.log' })
// ];

export const devRejectionHandlers = [
  // new transports.File({ filename: 'logs/uncaught-rejections.log' }),
  new transports.Console({ format: combine(prettyConsoleJson) })
];