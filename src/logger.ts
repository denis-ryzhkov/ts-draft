import winston from "winston";

/**
 * Logger, configured and ready to use, e.g:
 *     log.info("Something happened", { details });
 */
const log: winston.Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

log.debug("Log configured", { logLevel: log.level });

export default log;
