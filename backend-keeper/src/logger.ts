import pino from "pino";
import { config } from "./config.js";

/**
 * Shared structured logger for the keeper daemon.
 *
 * Emits newline-delimited JSON (one object per line) so logs are easy to
 * parse and ship to a log aggregator. The level is configurable via the
 * `LOG_LEVEL` environment variable (see `config.logLevel`) and accepts any
 * pino level: trace | debug | info | warn | error | fatal | silent.
 */
export const logger = pino({ level: config.logLevel });
