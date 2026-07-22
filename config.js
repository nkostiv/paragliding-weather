/**
 * Paragliding Weather App - Configuration
 * ============================================================================
 * This file contains API keys, settings, and constants for the application.
 * 
 * To override values locally without committing:
 * 1. Create config.local.js with your overrides
 * 2. Add config.local.js to .gitignore
 * 3. Load config.local.js AFTER config.js in index.html
 * 
 * Example config.local.js:
 * ──────────────────────────
 * CONFIG.windy.key = 'your-local-development-key';
 */

const CONFIG = {
    // ========================================================================
    // Windy API Configuration
    // ========================================================================
    windy: {
        // API Key - Get your own at https://www.windy.com/api
        key: 'kmrq6dIdIm07Uh4Rz8k9J6QFBQL1nSBh',
        
        // Default map center (Czech Republic)
        lat: 49.8,
        lon: 15.4,
        
        // Default zoom level
        zoom: 8,
        
        // Overlay type (wind, temp, pressure, etc.)
        overlay: 'wind',
        
        // Wind level (surface, 950hPa, 850hPa, etc.)
        level: 'surface'
    },
    
    // ========================================================================
    // Weather API Configuration (Open-Meteo - Free, No Key Required)
    // ========================================================================
    weather: {
        baseUrl: 'https://api.open-meteo.com/v1/forecast',
        
        // Current weather parameters to fetch
        currentParams: 'wind_direction_10m,wind_speed_10m,wind_gusts_10m',
        
        // Timeout for weather API calls (ms)
        timeout: 10000
    },
    
    // ========================================================================
    // Wind Thresholds for Flyability Assessment
    // ========================================================================
    // Adjust these based on your skill level and preferences
    windThresholds: {
        ms: {
            min: 2,        // Minimum wind speed for flying (m/s)
            max: 8,        // Maximum safe wind speed (m/s)
            maxGust: 11    // Maximum gust speed (m/s)
        },
        kmh: {
            min: 7.2,
            max: 28.8,
            maxGust: 39.6
        },
        knots: {
            min: 3.9,
            max: 15.5,
            maxGust: 21.4
        },
        mph: {
            min: 4.5,
            max: 17.9,
            maxGust: 24.6
        }
    },
    
    // ========================================================================
    // Unit System Definitions
    // ========================================================================
    unitSystems: {
        ms: {
            speed: 'm/s',
            altitude: 'm',
            label: 'm/s, m'
        },
        kmh: {
            speed: 'km/h',
            altitude: 'm',
            label: 'km/h, m'
        },
        knots: {
            speed: 'knots',
            altitude: 'ft',
            label: 'knots, ft'
        },
        mph: {
            speed: 'mph',
            altitude: 'ft',
            label: 'mph, ft'
        }
    },
    
    // ========================================================================
    // Sites Data Configuration
    // ========================================================================
    sites: {
        // Path to GeoJSON file containing paragliding sites
        dataFile: 'sites.json',
        
        // Default to show on load
        defaultZoom: 8
    },
    
    // ========================================================================
    // Application Settings
    // ========================================================================
    app: {
        // Default unit system on first load
        defaultUnit: 'ms',
        
        // Enable console logging (set to false for production)
        debug: false,
        
        // Application title
        title: '🪂 CZ Paragliding Weather',
        
        // Default center coordinates
        defaultCenter: {
            lat: 49.8,
            lon: 15.4
        }
    }
};

// ============================================================================
// Export for module systems (if needed)
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
