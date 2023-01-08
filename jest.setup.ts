import "reflect-metadata";
import log from "@src/logger";

// Default log level "info" is too noisy when we are running tests,
// but we still want to see errors and warnings.
if (process.env.LOG_LEVEL === undefined) process.env.LOG_LEVEL = log.level = "warn";
