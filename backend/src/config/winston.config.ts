import path from "path";
import winston, { format } from "winston";

const logDir = path.resolve(__dirname, "../../logs/");

const customLogger = () =>
  winston.createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    defaultMeta: { app: "backend" },
    exitOnError: false, //do not exit execution when error occurs
    transports: [
      // writes all logs of http or higher to given files
      new winston.transports.File({
        filename: path.resolve(logDir, "combined/combined.json"),
      }),
      new winston.transports.File({
        filename: path.resolve(logDir, "combined/combined.log"),
      }),

      // error and higher to given files
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
    //silent:true,
  });

export const logger = customLogger();
