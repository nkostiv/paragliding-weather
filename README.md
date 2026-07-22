 Paragliding Weather App — Functional Specification

**Reference Application:** [nkostiv.github.io/paragliding-weather](https://nkostiv.github.io/paragliding-weather/)

---

## 1. Overview & Purpose
The **Paragliding Weather App** is a specialized, lightweight web application designed to help paraglider pilots quickly evaluate flyability conditions for specific take-off sites using specialized weather forecasts, altitude wind parameters, and custom flight criteria.

---

## 2. Core Functional Modules

### A. Spot Selection & Mapping
* **Interactive Map:** Interactive map interface (e.g., Leaflet / OpenStreetMap) displaying registered flying sites (take-off and landing zones).
* **Spot Information:** Interactive markers showing site details:
  * Take-off orientation (e.g., N, SW, 210°)
  * Altitude / Elevation (m / ft)
  * Suitable wind direction windows
  * Site notes and flight safety warnings
* **Location Search & Geolocation:** Search spots by name or use device GPS to discover nearby take-offs.

### B. Weather Forecast & Paragliding Metrics
* **Meteorological Data Integration:** Pulls forecasts from public weather APIs (e.g., Open-Meteo, ECMWF, ICON, GFS).
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
| **Frontend Stack** | HTML5, CSS3, JavaScript (React / Vanilla JS) |
| **Mapping Engine** | Leaflet.js with OpenStreetMap / OpenTopoMap tiles |
| **Weather API** | Open-Meteo API / Public meteorological data endpoints |
| **Data Persistence** | Browser `localStorage` (for settings and favorites) |
