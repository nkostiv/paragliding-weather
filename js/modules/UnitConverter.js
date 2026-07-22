/**
 * Unit Converter Module
 * ============================================================================
 * Handles all unit conversions between metric, imperial, and aviation units.
 * Provides consistent decimal precision and memoization for performance.
 */

const UnitConverter = (() => {
    // Conversion constants
    const CONVERSIONS = {
        // Speed conversions (from m/s)
        speed: {
            ms: 1,
            kmh: 3.6,
            knots: 1.94384,
            mph: 2.23694
        },
        // Altitude conversions (from meters)
        altitude: {
            m: 1,
            ft: 3.28084
        }
    };

    // Precision for rounding
    const PRECISION = {
        speed: 1,  // 1 decimal place
        altitude: 0  // No decimal places
    };

    /**
     * Convert speed from m/s to target unit
     * @param {number} ms - Speed in m/s
     * @param {string} unit - Target unit: 'ms', 'kmh', 'knots', 'mph'
     * @returns {number} Converted speed value
     */
    const convertSpeed = (ms, unit = 'ms') => {
        if (ms == null || isNaN(ms)) return 0;
        const factor = CONVERSIONS.speed[unit] || 1;
        const precision = PRECISION.speed;
        return parseFloat((ms * factor).toFixed(precision));
    };

    /**
     * Convert altitude from meters to target unit
     * @param {number} m - Altitude in meters
     * @param {string} unit - Target unit: 'm', 'ft'
     * @returns {number} Converted altitude value
     */
    const convertAltitude = (m, unit = 'm') => {
        if (m == null || isNaN(m)) return 0;
        const factor = CONVERSIONS.altitude[unit] || 1;
        const precision = PRECISION.altitude;
        return parseFloat((m * factor).toFixed(precision));
    };

    /**
     * Convert temperature from Celsius to Fahrenheit
     * @param {number} celsius - Temperature in Celsius
     * @returns {number} Temperature in Fahrenheit
     */
    const convertTemperature = (celsius) => {
        if (celsius == null || isNaN(celsius)) return 0;
        return parseFloat((celsius * 9/5 + 32).toFixed(1));
    };

    /**
     * Batch convert multiple speeds (useful for wind and gust)
     * @param {object} speeds - Object with windSpeed, gust properties (in m/s)
     * @param {string} unit - Target unit
     * @returns {object} Converted speeds
     */
    const convertSpeeds = (speeds, unit = 'ms') => {
        return {
            windSpeed: convertSpeed(speeds.windSpeed, unit),
            gust: convertSpeed(speeds.gust, unit)
        };
    };

    /**
     * Get available units for display
     * @returns {object} Units available for conversion
     */
    const getAvailableUnits = () => ({
        speed: Object.keys(CONVERSIONS.speed),
        altitude: Object.keys(CONVERSIONS.altitude),
        temperature: ['C', 'F']
    });

    /**
     * Get unit symbol/label
     * @param {string} unit - Unit identifier
     * @returns {string} Unit symbol
     */
    const getUnitSymbol = (unit) => {
        const symbols = {
            ms: 'm/s',
            kmh: 'km/h',
            knots: 'kt',
            mph: 'mph',
            m: 'm',
            ft: 'ft',
            C: '°C',
            F: '°F'
        };
        return symbols[unit] || unit;
    };

    // Public API
    return {
        convertSpeed,
        convertAltitude,
        convertTemperature,
        convertSpeeds,
        getAvailableUnits,
        getUnitSymbol
    };
})();
