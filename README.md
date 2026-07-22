# Paragliding Weather App — Functional Specification & Setup Guide

**Reference Application:** [nkostiv.github.io/paragliding-weather](https://nkostiv.github.io/paragliding-weather/)

---

## 1. Overview & Purpose
The **Paragliding Weather App** is a specialized, lightweight web application designed to help paraglider pilots quickly evaluate flyability conditions for specific take-off sites using specialized weather forecasts, altitude wind parameters, and custom flight criteria.

---

## 2. Core Functional Modules

### A. Spot Selection & Mapping
* **Interactive Map:** Interactive map interface (Leaflet with Windy API) displaying registered flying sites (take-off and landing zones).
* **Spot Information:** Interactive markers showing site details:
  * Take-off orientation (e.g., N, SW, 210°)
  * Altitude / Elevation (m / ft)
  * Suitable wind direction windows
  * Site notes and flight safety warnings
* **Location Search & Geolocation:** Search spots by name or use device GPS to discover nearby take-offs.

### B. Weather Forecast & Paragliding Metrics
* **Meteorological Data Integration:** Pulls forecasts from public weather APIs (Open-Meteo, ECMWF, ICON, GFS).
* **Key Flyability Parameters:**
  * **Wind Speed & Gusts:** Surface (10m) and upper-altitude winds (e.g., 850 hPa, 700 hPa).
  * **Wind Direction:** Cardinal directions and degree bearings relative to site orientation.
  * **Thermal & Atmospheric Stability:** Boundary layer height, CAPE, and temperature lapse rates for thermal quality.
  * **Cloud Cover & Ceiling:** Low, mid, and high cloud coverage with estimated cloud base altitude.
  * **Precipitation:** Rain volume and probability.

### C. Flyability Assessment & Visual Indicators
* **Color-Coded Status:** Automated hourly flyability rating based on site thresholds and pilot limits:
  * 🟢 **Flyable:** Ideal wind speed, direction matching take-off window, no rain/storms.
  * 🟡 **Marginal:** Strong gusts, crosswind, or borderline thermal/cloud conditions.
  * 🔴 **Unflyable / Dangerous:** Excessive winds, unfavorable direction, precipitation, or storm risk.
* **Wind Rose / Directional Match:** Visual indicator displaying forecast wind direction relative to site take-off angles.

### D. Data Visualization & Charts
* **Hourly Meteogram:** Interactive timeline graph charting wind speed trends, gusts, cloud cover, and rain over 3 to 7 days.
* **Altitude Wind Profile:** Vertical profile view illustrating wind speed and direction changes across different flight levels.

### E. User Settings & Customization
* **Unit System Toggle:**
  * Wind Speed: `m/s`, `km/h`, `knots`, `mph`
  * Altitude: `m`, `ft`
  * Temperature: `°C`, `°F`
* **Custom Pilot Thresholds:** User-configurable wind speed limits (e.g., minimum and maximum comfortable wind speeds).
* **Local Storage:** Client-side persistence of favorite spots, recent searches, and unit preferences.

---

## 3. Technical & Architectural Summary

| Layer | Technology / Implementation |
| :--- | :--- |
| **Hosting & Deployment** | GitHub Pages static hosting |
| **Frontend Stack** | HTML5, CSS3, JavaScript (Vanilla JS) |
| **Mapping Engine** | Leaflet.js + Windy API for interactive weather maps |
| **Weather API** | Open-Meteo API (free, no key required) |
| **Configuration** | `config.js` for centralized settings & API keys |
| **Data Persistence** | Browser `localStorage` (for settings and favorites) |
| **Sites Data** | `sites.json` (GeoJSON FeatureCollection format) |

---

## 4. File Structure & Configuration

### Project Layout
```
paragliding-weather/
├── index.html              # Main application file
├── config.js               # Centralized configuration (API keys, thresholds)
├── config.local.js         # Local overrides (not committed, use for development)
├── sites.json              # Paragliding sites data (GeoJSON format)
├── .gitignore              # Protects sensitive local files
└── README.md               # This file
```

### Configuration Management

#### `config.js` - Central Configuration
Contains all application settings:
- **Windy API Key** — Interactive weather map
- **Wind Thresholds** — Flyability criteria per unit system
- **Unit Systems** — Conversions and displays
- **Application Settings** — Debug mode, title, defaults

**Update `config.js` when:**
- Changing Windy API key
- Adjusting wind speed thresholds
- Modifying default settings

#### `config.local.js` - Local Development Overrides (Optional)
Create locally for development without committing sensitive data:
```javascript
// config.local.js (NOT committed to Git)
CONFIG.windy.key = 'your-development-key-here';
CONFIG.app.debug = true;  // Enable console logging
```

**Add to `.gitignore`** to prevent accidental commits.

---

## 5. Critical HTML Requirements

### ⚠️ **REQUIRED: Windy Map Container**

The Windy API requires a specific DOM element to initialize. **This must be present in every version:**

```html
<body>
  <!-- REQUIRED: Windy Map Container -->
  <div id="windy"></div>
  
  <!-- Optional: Custom overlays -->
  <div id="header">...</div>
  <div id="infoPanel">...</div>
</body>
```

**Why:**
- Windy's `libBoot.js` script searches for `<div id="windy"></div>` on page load
- Without it, initialization fails with: `"Missing <div id="windy"></div> in the BODY"`
- Cannot use different IDs or nested containers

**Validation Checklist:**
- ✅ `<div id="windy"></div>` exists in `<body>`
- ✅ It's the **first element** or early in the DOM
- ✅ No ID typos (case-sensitive: `id="windy"`, not `id="Windy"` or `id="wind"`)
- ✅ It's a direct child of `<body>`, not nested in other containers

---

## 6. Setup & Development

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nkostiv/paragliding-weather.git
   cd paragliding-weather
   ```

2. **Create local config overrides (optional):**
   ```javascript
   // config.local.js
   CONFIG.windy.key = 'your-dev-key';
   CONFIG.app.debug = true;
   ```

3. **Load in browser (with local server recommended):**
   ```bash
   python -m http.server 8000
   # Visit: http://localhost:8000
   ```

### Deployment (GitHub Pages)

1. **Push to `main` branch** — GitHub Pages auto-deploys
2. **Enable Pages in Settings** — Repository → Settings → Pages
3. **Site available at:** `https://username.github.io/paragliding-weather/`

---

## 7. Sites Data Format

All paragliding sites are stored in **`sites.json`** as a GeoJSON FeatureCollection:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "name": "Site Name",
        "wind_range": {
          "from_deg": 100,
          "to_deg": 150,
          "crosses_zero": false
        },
        "website": "https://www.paragliding-mapa.cz/..."
      }
    }
  ]
}
```

**To add a new site:**
1. Get GPS coordinates (lon, lat)
2. Determine wind direction range
3. Add entry to `sites.json` features array
4. Commit and push

---

## 8. API Keys & Credentials

### Windy API Key
- **Get key:** https://www.windy.com/api
- **Store in:** `config.js` (production) or `config.local.js` (development)
- **Never commit:** Raw keys to public repos
- **Protect with:** `.gitignore` (for `config.local.js`)

### Open-Meteo API
- **No API key required** ✅
- **Free tier:** 10,000 calls/day
- **Endpoint:** https://api.open-meteo.com/v1/forecast

---

## 9. Testing Checklist

Before deploying changes:

### HTML Structure
- [ ] `<div id="windy"></div>` present in `<body>`
- [ ] All required scripts loaded in correct order
- [ ] No console errors on page load

### Configuration
- [ ] `config.js` loads successfully
- [ ] All `CONFIG` references resolve without errors
- [ ] Units toggle works (m/s ↔ km/h ↔ knots ↔ mph)

### Functionality
- [ ] Sites load from `sites.json`
- [ ] Weather data fetches from Open-Meteo API
- [ ] Markers display with correct flyability status
- [ ] Click marker → info panel shows (no null errors)
- [ ] Details link opens paragliding-mapa.cz page

### Styling
- [ ] Header visible and controls responsive
- [ ] Info panel slides up smoothly
- [ ] Colors match flyability status (green/yellow/red)
- [ ] Mobile layout adapts correctly (< 768px)

---

## 10. Common Issues & Solutions

### Error: "Missing <div id="windy"></div>"
**Cause:** Windy container not found in HTML
**Fix:** Add `<div id="windy"></div>` to `<body>` as first element

### Error: "Cannot set properties of null"
**Cause:** Script trying to access element that doesn't exist
**Fix:** Verify all required DOM elements exist and IDs are exact

### Weather data not loading
**Cause:** Open-Meteo API rate limit or network issue
**Fix:** Check browser console for errors, verify internet connection

### Config not loading
**Cause:** `config.js` not found or not loaded before main script
**Fix:** Ensure `<script src="config.js"></script>` appears before app script

### Sites not showing on map
**Cause:** `sites.json` not found or malformed
**Fix:** Verify file exists, validate JSON syntax at jsonlint.com

---

## 11. Future Enhancements

- [ ] Hourly meteogram with wind/cloud trends
- [ ] Altitude wind profile visualization
- [ ] Geolocation & nearby sites search
- [ ] Favorite sites localStorage
- [ ] Historical weather data
- [ ] Multi-language support
- [ ] Mobile app wrapper (PWA or React Native)

---

## 12. Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. **Verify HTML structure** (especially `<div id="windy">`)
4. Commit: `git commit -m "Add feature: ..."`
5. Push and create Pull Request

---

## 13. License & Attribution

- **Windy API:** [https://www.windy.com/api](https://www.windy.com/api)
- **Open-Meteo:** [https://open-meteo.com/](https://open-meteo.com/)
- **Leaflet:** [https://leafletjs.com/](https://leafletjs.com/)
- **Paragliding Sites:** [https://www.paragliding-mapa.cz/](https://www.paragliding-mapa.cz/)

---

**Last Updated:** July 22, 2026
