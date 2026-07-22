/**
 * Logger Module
 * ============================================================================
 * Centralized logging with configurable levels, history tracking, and export
 * capabilities. Respects CONFIG.app.debug for production/development modes.
 */

class Logger {
    static #level = 'info'; // 'debug', 'info', 'warn', 'error'
    static #history = [];
    static #maxHistory = 200;
    static #enableConsole = true;

    /**
     * Initialize logger with config
     * @param {object} config - Configuration object
     * @param {boolean} config.debug - Enable debug logging
     * @param {boolean} config.enableConsole - Log to console
     */
    static initialize(config = {}) {
        this.#level = config.debug ? 'debug' : 'info';
        this.#enableConsole = config.enableConsole !== false;
    }

    /**
     * Debug level logging (only in debug mode)
     */
    static debug(message, data) {
        this.#log('debug', message, data);
    }

    /**
     * Info level logging
     */
    static info(message, data) {
        this.#log('info', message, data);
    }

    /**
     * Warning level logging
     */
    static warn(message, data) {
        this.#log('warn', message, data);
    }

    /**
     * Error level logging
     */
    static error(message, data) {
        this.#log('error', message, data);
    }

    /**
     * Internal logging implementation
     */
    static #log(level, message, data) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
            data: data !== undefined ? data : null
        };

        // Add to history
        this.#history.push(entry);
        if (this.#history.length > this.#maxHistory) {
            this.#history.shift();
        }

        // Log to console if enabled and level is sufficient
        if (this.#enableConsole && this.#shouldLog(level)) {
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, data || '');
        }
    }

    /**
     * Check if a log level should be shown
     */
    static #shouldLog(level) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        return levels[level] >= levels[this.#level];
    }

    /**
     * Get recent log history
     * @param {number} limit - Maximum entries to return
     * @returns {array} Array of log entries
     */
    static getHistory(limit = 100) {
        return this.#history.slice(-limit).map(entry => ({ ...entry }));
    }

    /**
     * Export logs as JSON string
     * @returns {string} JSON string of all logs
     */
    static export() {
        return JSON.stringify(this.#history, null, 2);
    }

    /**
     * Clear log history
     */
    static clear() {
        this.#history = [];
    }

    /**
     * Get current log level
     */
    static getLevel() {
        return this.#level;
    }
}
