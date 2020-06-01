import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment';
import { getRootPath } from '../utils/getRootPath';
const { combine, timestamp, printf, splat } = format;

const loggerFormat = printf((formatOption) => {
  splat().transform(formatOption);
  return `[${formatOption.level.toUpperCase().padStart(5, ' ')}]${
    formatOption.timestamp
  } - ${formatOption.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    loggerFormat,
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: `${getRootPath}/logs/log-%DATE%.log`,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      level: 'info',
      json: false,
    }),
  ],
});

export default logger;
