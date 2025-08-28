import * as winston from 'winston';

const logConfiguration = {
  format: winston.format.combine(
    winston.format.label({
      label: `🏷️`,
    }),
    // winston.format.colorize({
    //   all: true,
    // }),
    winston.format.timestamp({
      format: 'DD-MMM-YYYY HH:mm:ss',
    }),
    winston.format.errors({
      stack: true,
    }),
    winston.format.printf(
      (info : any) => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
};

export const logger = winston.createLogger(logConfiguration);
