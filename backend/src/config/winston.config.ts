import path from "path";
import winston, { format } from "winston";

const logDir = path.resolve(__dirname, "./../../logs");

const customLogger = () =>
  winston.createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    defaultMeta: { app: "backend" },
    exitOnError: false, //do not exit execution when error occurs
    transports: [
      // - Write all logs with importance level of `info` or higher to `combined.log`
      //   (i.e., fatal, error, warn, and info, but not trace)
      new winston.transports.File({
        filename: path.resolve(logDir, "combined/combined.json"),
      }),
      new winston.transports.File({
        filename: path.resolve(logDir, "combined/combined.log"),
      }),

      // - Write all logs with importance level of `error` or higher to `error.json`
      //   (i.e., error, fatal, but not other levels)
      new winston.transports.File({
        filename: path.resolve(logDir, "error/error.json"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.resolve(logDir, "error/error.log"),
        level: "error",
      }),
    ],

    // handle exceptions. because wheeuuu!!!
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.resolve(logDir, "exceptions/exceptions.log"),
      }),
    ],
  });

export const logger = customLogger();
