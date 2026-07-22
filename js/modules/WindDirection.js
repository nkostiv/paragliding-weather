/**
 * Wind Direction Module
 * ============================================================================
 * Utilities for wind direction calculations, cardinal conversions, and
 * directional range checking (handles cross-zero cases like 350°-30°).
 */

const WindDirection = (() => {
    // Cardinal directions: 16-point compass
    const CARDINAL_DIRECTIONS = [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW'
    ];

    /**
     * Normalize wind direction to 0-360 range
     * @param {number} degrees - Raw degree value (may be negative or > 360)
     * @returns {number} Normalized value 0-360
     */
    const normalize = (degrees) => {
        if (degrees == null || isNaN(degrees)) return 0;
        return ((degrees % 360) + 360) % 360;
    };

    /**
     * Convert degrees to cardinal direction (16-point compass)
     * @param {number} degrees - Wind direction in degrees (0-360)
     * @returns {string} Cardinal direction (e.g., 'NE', 'S')
     */
    const toCardinal = (degrees) => {
        const normalized = normalize(degrees);
        // Each cardinal is 22.5 degrees wide (360 / 16)
        const index = Math.round(normalized / 22.5) % 16;
        return CARDINAL_DIRECTIONS[index];
    };

    /**
     * Get detailed cardinal description (8-point compass)
     * @param {number} degrees - Wind direction in degrees
     * @returns {string} Direction name (e.g., 'North', 'Northeast')
     */
    const getDetailedName = (degrees) => {
        const names = {
            'N': 'North',
            'NE': 'Northeast',
            'E': 'East',
            'SE': 'Southeast',
            'S': 'South',
            'SW': 'Southwest',
            'W': 'West',
            'NW': 'Northwest'
        };
        const normalized = normalize(degrees);
        const index = Math.round(normalized / 45) % 8;
        const cardinal = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][index];
        return names[cardinal];
    };

    /**
     * Check if wind direction falls within a valid range
     * Handles ranges that cross 0° (e.g., 340°-60°) correctly
     * @param {number} windDir - Current wind direction (0-360)
     * @param {number} minDir - Minimum acceptable direction
     * @param {number} maxDir - Maximum acceptable direction
     * @returns {boolean} True if direction is within range
     */
    const isInRange = (windDir, minDir, maxDir) => {
        const wind = normalize(windDir);
        const min = normalize(minDir);
        const max = normalize(maxDir);

        // Normal case: range doesn't cross 0°
        if (min <= max) {
            return wind >= min && wind <= max;
        }

        // Cross-zero case: range wraps around (e.g., 340°-60°)
        return wind >= min || wind <= max;
    };

    /**
     * Calculate angular distance between two directions (shortest path)
     * @param {number} from - Starting direction
     * @param {number} to - Ending direction
     * @returns {number} Shortest angular distance (-180 to 180)
     */
    const getAngularDistance = (from, to) => {
        const f = normalize(from);
        const t = normalize(to);
        let distance = t - f;

        if (distance > 180) {
            distance -= 360;
        } else if (distance < -180) {
            distance += 360;
        }

        return distance;
    };

    /**
     * Calculate mean direction of multiple directions
     * Handles circular nature of angles (e.g., mean of 350° and 10° is 0°)
     * @param {array} directions - Array of wind directions
     * @returns {number} Mean direction (0-360)
     */
    const getMeanDirection = (directions) => {
        if (!directions || directions.length === 0) return 0;

        let sinSum = 0;
        let cosSum = 0;

        directions.forEach(dir => {
            const radians = (normalize(dir) * Math.PI) / 180;
            sinSum += Math.sin(radians);
            cosSum += Math.cos(radians);
        });

        const meanRadians = Math.atan2(sinSum / directions.length, cosSum / directions.length);
        return normalize((meanRadians * 180) / Math.PI);
    };

    /**
     * Get quadrant name from direction
     * @param {number} degrees - Wind direction
     * @returns {string} Quadrant name ('NE', 'SE', 'SW', 'NW')
     */
    const getQuadrant = (degrees) => {
        const normalized = normalize(degrees);
        if (normalized < 90) return 'NE';
        if (normalized < 180) return 'SE';
        if (normalized < 270) return 'SW';
        return 'NW';
    };

    /**
     * Format direction for display
     * @param {number} degrees - Wind direction
     * @returns {string} Formatted string (e.g., "45° NE")
     */
    const format = (degrees) => {
        const normalized = normalize(degrees);
        return `${normalized}° ${toCardinal(normalized)}`;
    };

    // Public API
    return {
        normalize,
        toCardinal,
        getDetailedName,
        isInRange,
        getAngularDistance,
        getMeanDirection,
        getQuadrant,
        format
    };
})();
