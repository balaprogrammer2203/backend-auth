const { createLogger, format, transports }= require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const config = require('../../config/config');

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const wcLogger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    enumerateErrorFormat(),
    timestamp(),
    config.env === 'development' ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(({ level, message, label, timestamp }) => `${timestamp}: ${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
    new transports.File({ filename: "./logs/error.log", level: 'error' })
  ],
  exceptionHandlers: [new transports.File({ filename: "./logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "./logs/rejections.log" })],
});

module.exports = wcLogger;
