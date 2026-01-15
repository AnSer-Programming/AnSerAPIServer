/**
 * Centralized logging utility for ClientInfo module.
 * In production, logs are suppressed by default.
 * Set REACT_APP_DEBUG_LOGGING=true to enable all logs in production.
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.REACT_APP_DEBUG_LOGGING === 'true';
const shouldLog = isDevelopment || isDebugEnabled;

/**
 * Logger object with standard logging methods.
 * - In development: All logs are output to console.
 * - In production: Logs are suppressed unless REACT_APP_DEBUG_LOGGING=true.
 * - Errors are always logged (can be sent to monitoring service).
 */
const logger = {
  /**
   * Log informational messages (development only by default)
   * @param  {...any} args - Arguments to log
   */
  log(...args) {
    if (shouldLog) {
      console.log('[ClientInfo]', ...args);
    }
  },

  /**
   * Log debug messages (development only by default)
   * @param  {...any} args - Arguments to log
   */
  debug(...args) {
    if (shouldLog) {
      console.log('[ClientInfo:DEBUG]', ...args);
    }
  },

  /**
   * Log warning messages (development only by default)
   * @param  {...any} args - Arguments to log
   */
  warn(...args) {
    if (shouldLog) {
      console.warn('[ClientInfo:WARN]', ...args);
    }
  },

  /**
   * Log error messages (always logged, can integrate with error monitoring)
   * @param  {...any} args - Arguments to log
   */
  error(...args) {
    // Always log errors - these could be sent to error monitoring service (Sentry, etc.)
    console.error('[ClientInfo:ERROR]', ...args);

    // TODO: Integrate with error monitoring service in production
    // Example: if (!isDevelopment) { Sentry.captureException(args[0]); }
  },

  /**
   * Log info messages (development only by default)
   * @param  {...any} args - Arguments to log
   */
  info(...args) {
    if (shouldLog) {
      console.info('[ClientInfo:INFO]', ...args);
    }
  },

  /**
   * Group logging messages (development only)
   * @param {string} label - Group label
   */
  group(label) {
    if (shouldLog && console.group) {
      console.group(`[ClientInfo] ${label}`);
    }
  },

  /**
   * End a logging group (development only)
   */
  groupEnd() {
    if (shouldLog && console.groupEnd) {
      console.groupEnd();
    }
  },

  /**
   * Log a table (development only)
   * @param {any} data - Data to display in table format
   */
  table(data) {
    if (shouldLog && console.table) {
      console.table(data);
    }
  },
};

export default logger;
