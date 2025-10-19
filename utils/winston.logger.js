import winston from "winston";
import chalk from "chalk";
import config from "../config/index.js";

const { combine, timestamp, printf } = winston.format;

// Custom console format with colored fields
const consoleFormat = combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    printf(({ timestamp, level, message, meta }) => {
        // Assume meta contains method and path
        const method = meta?.method ? chalk.magenta(meta.method) : "";
        const path = meta?.path ? chalk.blue(meta.path) : "";
        const logMessage = message || "";

        return `${chalk.cyan(timestamp)} [${level}]: ${method} ${path} ${logMessage}`;
    })
);

const fileFormat = combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: config.NODE_ENV === "development" ? "debug" : "info",
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: fileFormat,
        }),
        new winston.transports.File({
            filename: "logs/combined.log",
            format: fileFormat,
        }),
    ],
    exitOnError: false,
});

export default logger;
