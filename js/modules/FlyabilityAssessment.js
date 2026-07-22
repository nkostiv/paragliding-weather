/**
 * Flyability Assessment Module
 * ============================================================================
 * Determines flyability status based on weather conditions and site constraints.
 * Provides detailed assessment breakdown for pilot decision-making.
 */

const FlyabilityAssessment = (() => {
    /**
     * Assess overall flyability for a site
     * @param {object} weatherData - Current weather {windDir, windSpeed, gust}
     * @param {object} siteConstraints - Site limits {windMin, windMax}
     * @param {object} pilotThresholds - Pilot limits {min, max, maxGust}
     * @returns {object} Assessment result with status and breakdown
     */
    const assess = (weatherData, siteConstraints, pilotThresholds) => {
        if (!weatherData) {
            return {
                status: 'unavailable',
                flyable: false,
                directionOK: null,
                speedOK: null,
                gustOK: null,
                reasons: ['Weather data unavailable']
            };
        }

        const { windDir, windSpeed, gust } = weatherData;
        const { windMin, windMax } = siteConstraints;
        const { min, max, maxGust } = pilotThresholds;

        // Check each constraint
        const directionOK = WindDirection.isInRange(windDir, windMin, windMax);
        const speedOK = windSpeed >= min && windSpeed <= max;
        const gustOK = gust <= maxGust;
        const windingNearMax = windSpeed > max * 0.9;

        // Determine overall status
        let status = 'flyable';
        const reasons = [];

        if (!directionOK) {
            status = 'unflyable';
            reasons.push(`Wind direction ${windDir}° outside acceptable range (${windMin}°-${windMax}°)`);
        }

        if (!gustOK) {
            status = 'unflyable';
            reasons.push(`Gust ${gust} m/s exceeds maximum ${maxGust} m/s`);
        }

        if (!speedOK) {
            status = status === 'flyable' ? 'marginal' : status;
            if (windSpeed < min) {
                reasons.push(`Wind speed ${windSpeed} m/s below minimum ${min} m/s`);
            } else {
                reasons.push(`Wind speed ${windSpeed} m/s exceeds maximum ${max} m/s`);
            }
        }

        if (speedOK && windingNearMax && status === 'flyable') {
            status = 'marginal';
            reasons.push(`Wind approaching maximum threshold (${windSpeed}/${max} m/s)`);
        }

        return {
            status, // 'flyable', 'marginal', 'unflyable', 'unavailable'
            flyable: status === 'flyable',
            marginal: status === 'marginal',
            unflyable: status === 'unflyable',
            directionOK,
            speedOK,
            gustOK,
            reasons,
            weather: { windDir, windSpeed, gust },
            thresholds: { min, max, maxGust }
        };
    };

    /**
     * Get human-readable status message
     * @param {string} status - Status code
     * @returns {object} Message and emoji
     */
    const getStatusMessage = (status) => {
        const messages = {
            flyable: {
                emoji: '✅',
                text: 'FLYABLE',
                description: 'Perfect conditions!'
            },
            marginal: {
                emoji: '⚠️',
                text: 'MARGINAL',
                description: 'Use caution'
            },
            unflyable: {
                emoji: '❌',
                text: 'UNFLYABLE',
                description: 'Too dangerous'
            },
            unavailable: {
                emoji: '❓',
                text: 'DATA UNAVAILABLE',
                description: 'Cannot assess conditions'
            }
        };
        return messages[status] || messages.unavailable;
    };

    /**
     * Get CSS class name for status styling
     * @param {string} status - Status code
     * @returns {string} CSS class name
     */
    const getStatusClass = (status) => {
        const mapping = {
            flyable: 'flyable',
            marginal: 'marginal',
            unflyable: 'unflyable',
            unavailable: 'marginal'
        };
        return `flyability-status ${mapping[status] || 'marginal'}`;
    };

    /**
     * Score flyability 0-100 for ranking sites
     * @param {object} assessment - Assessment result from assess()
     * @returns {number} Score 0-100
     */
    const scoreAssessment = (assessment) => {
        if (assessment.status === 'unavailable') return 0;
        if (assessment.status === 'unflyable') return 20;
        if (assessment.status === 'marginal') return 60;
        return 100;
    };

    /**
     * Compare two assessments for ranking
     * @param {object} a - First assessment
     * @param {object} b - Second assessment
     * @returns {number} Comparison result (-1, 0, 1) for sorting
     */
    const compare = (a, b) => {
        const scoreA = scoreAssessment(a);
        const scoreB = scoreAssessment(b);
        return scoreB - scoreA; // Higher score first
    };

    // Public API
    return {
        assess,
        getStatusMessage,
        getStatusClass,
        scoreAssessment,
        compare
    };
})();
