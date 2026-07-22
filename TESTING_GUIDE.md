# Phase 1 Testing Guide

## Quick Start Testing

### Run Locally
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Open DevTools Console (F12)

Run these tests in order:

---

## Test 1: Module Loading ✅

```javascript
// All modules should be defined
typeof Logger === 'function'                    // true
typeof AppState === 'function'                  // true
typeof UnitConverter === 'object'               // true
typeof WindDirection === 'object'               // true
typeof FlyabilityAssessment === 'object'        // true
```

**Expected:** All return `true`

---

## Test 2: Logger Functionality ✅

```javascript
// Logger should track history
Logger.info('Test message', {test: 123});
const history = Logger.getHistory(1);
console.log(history[0].message);        // "Test message"
console.log(history[0].level);          // "info"
```

**Expected:** Message and level appear in history

---

## Test 3: Unit Converter ✅

```javascript
// Test speed conversion
UnitConverter.convertSpeed(10, 'ms')     // 10
UnitConverter.convertSpeed(10, 'kmh')    // 36
UnitConverter.convertSpeed(10, 'knots')  // 19.4384
UnitConverter.convertSpeed(10, 'mph')    // 22.3694

// Test altitude conversion
UnitConverter.convertAltitude(1000, 'm') // 1000
UnitConverter.convertAltitude(1000, 'ft') // 3280.84

// Test symbols
UnitConverter.getUnitSymbol('kmh')       // "km/h"
UnitConverter.getUnitSymbol('ft')        // "ft"
```

**Expected:** Conversions match expected values

---

## Test 4: Wind Direction ✅

```javascript
// Test cardinal conversion
WindDirection.toCardinal(0)              // "N"
WindDirection.toCardinal(45)             // "NE"
WindDirection.toCardinal(90)             // "E"
WindDirection.toCardinal(360)            // "N"

// Test cross-zero range checking (important!)
WindDirection.isInRange(350, 340, 60)    // true (cross-zero works!)
WindDirection.isInRange(10, 340, 60)     // true
WindDirection.isInRange(200, 340, 60)    // false

// Normal range
WindDirection.isInRange(45, 0, 90)       // true
WindDirection.isInRange(135, 0, 90)      // false

// Test formatting
WindDirection.format(45)                 // "45° NE"
```

**Expected:** All return correct values, especially cross-zero range

---

## Test 5: Flyability Assessment ✅

```javascript
// Test with flyable conditions
const thresholds = CONFIG.windThresholds.ms; // {min: 2, max: 8, maxGust: 11}

const goodAssessment = FlyabilityAssessment.assess(
    { windDir: 45, windSpeed: 5, gust: 8 },
    { windMin: 0, windMax: 90 },
    thresholds
);

console.log(goodAssessment.status);      // "flyable"
console.log(goodAssessment.flyable);     // true
console.log(goodAssessment.directionOK); // true
console.log(goodAssessment.speedOK);     // true
console.log(goodAssessment.gustOK);      // true

// Test with unflyable conditions (gust too high)
const badAssessment = FlyabilityAssessment.assess(
    { windDir: 45, windSpeed: 5, gust: 15 },
    { windMin: 0, windMax: 90 },
    thresholds
);

console.log(badAssessment.status);       // "unflyable"
console.log(badAssessment.gustOK);       // false
console.log(badAssessment.reasons);      // Should include gust warning

// Test status messages
const msg = FlyabilityAssessment.getStatusMessage('flyable');
console.log(msg.emoji);                  // "✅"
console.log(msg.text);                   // "FLYABLE"
```

**Expected:** Assessments correctly identify flyable/unflyable conditions

---

## Test 6: AppState Management ✅

```javascript
// Test get/set
state.set('currentUnit', 'kmh');
console.log(state.get('currentUnit'));   // "kmh"

// Test listener
let changedValue = null;
const unsubscribe = state.subscribe('currentUnit', (newVal, oldVal) => {
    changedValue = newVal;
});

state.set('currentUnit', 'knots');
console.log(changedValue);               // "knots"
unsubscribe();

// Test that listener was unsubscribed
state.set('currentUnit', 'mph');
console.log(changedValue);               // Still "knots" (no change)

// Test snapshot
const snapshot = state.snapshot();
console.log(snapshot.sites.length);      // Should be 17
console.log(snapshot.currentUnit);       // "mph"
```

**Expected:** State changes trigger listeners correctly

---

## Test 7: Site Loading ✅

```javascript
// Should already be loaded from app init
const sites = state.get('sites');
console.log(sites.length);               // 17
console.log(sites[0].properties.name);   // "Býkovice" (or first site)
console.log(sites[0].geometry.type);     // "Point"
```

**Expected:** All 17 sites loaded with correct structure

---

## Test 8: Weather Data Integration ✅

```javascript
// Get a site
const site = state.get('sites')[0];

// Manually fetch weather
await fetchWeatherData(site);
// Should return {windDir: number, windSpeed: number, gust: number}

// Check marker was created
const markers = state.get('markers');
console.log(markers.size);               // Should be 17 (all sites)
console.log(markers.has(site.properties.name)); // true
```

**Expected:** Weather data fetches successfully, markers are created

---

## Test 9: User Interactions ✅

### Marker Click
```javascript
// Programmatically trigger marker click
const markers = state.get('markers');
const firstMarkerData = markers.values().next().value;
firstMarkerData.marker.fireEvent('click');

// Info panel should appear
const panel = document.getElementById('infoPanel');
console.log(panel.classList.contains('visible')); // true
```

### Unit Toggle
```javascript
// Change unit
const select = document.getElementById('unitToggle');
select.value = 'kmh';
select.dispatchEvent(new Event('change'));

// State should update
console.log(state.get('currentUnit')); // "kmh"

// Panel should close
const panel = document.getElementById('infoPanel');
console.log(panel.classList.contains('visible')); // false
```

### Close Button
```javascript
// Show panel first
document.getElementById('unitToggle').value = 'ms';
const markers = state.get('markers');
markers.values().next().value.marker.fireEvent('click');

// Click close button
const closeBtn = document.getElementById('closePanel');
closeBtn.click();

// Panel should disappear
const panel = document.getElementById('infoPanel');
console.log(panel.classList.contains('visible')); // false
```

**Expected:** All interactions work correctly

---

## Test 10: Console Errors ✅

```javascript
// Check for any errors
const errors = Logger.getHistory().filter(e => e.level === 'error');
console.log(errors.length);              // 0 (no errors!)
```

**Expected:** No errors in logger history

---

## Performance Test ✅

```javascript
// Measure load time
console.time('App Load');
// App is already loaded, so check history
const first = Logger.getHistory(1000)[0];
const last = Logger.getHistory()[0];
const duration = new Date(last.timestamp) - new Date(first.timestamp);
console.log(`App initialization took ${duration}ms`); // Should be < 5000ms

// Check memory
console.memory; // If available, heap_size_limit and used_heap_size
```

**Expected:** App loads in < 5 seconds, memory usage reasonable

---

## Automated Test Summary

Create a test file to run all at once:

```javascript
// Save as: test-phase-1.js
// Run in console: copy-paste all commands

const tests = [
    // Test 1: Modules loaded
    () => ({
        name: 'Modules Loaded',
        pass: typeof Logger === 'function' &&
              typeof AppState === 'function' &&
              typeof UnitConverter === 'object'
    }),
    
    // Test 2: Logger works
    () => {
        Logger.info('Test');
        return {
            name: 'Logger',
            pass: Logger.getHistory(1)[0]?.level === 'info'
        };
    },
    
    // Test 3: Unit conversion
    () => ({
        name: 'Unit Converter',
        pass: UnitConverter.convertSpeed(10, 'kmh') === 36
    }),
    
    // Test 4: Wind direction
    () => ({
        name: 'Wind Direction',
        pass: WindDirection.toCardinal(45) === 'NE' &&
              WindDirection.isInRange(350, 340, 60) === true
    }),
    
    // Test 5: Flyability
    () => {
        const assessment = FlyabilityAssessment.assess(
            {windDir: 45, windSpeed: 5, gust: 8},
            {windMin: 0, windMax: 90},
            CONFIG.windThresholds.ms
        );
        return {
            name: 'Flyability Assessment',
            pass: assessment.status === 'flyable'
        };
    },
    
    // Test 6: AppState
    () => {
        state.set('test', 'value');
        return {
            name: 'AppState',
            pass: state.get('test') === 'value'
        };
    },
    
    // Test 7: Sites loaded
    () => ({
        name: 'Sites Loaded',
        pass: state.get('sites').length === 17
    }),
    
    // Test 8: No errors
    () => {
        const errors = Logger.getHistory().filter(e => e.level === 'error');
        return {
            name: 'No Console Errors',
            pass: errors.length === 0
        };
    }
];

// Run all tests
const results = tests.map(test => test());
console.table(results);

// Summary
const passed = results.filter(r => r.pass).length;
console.log(`✅ ${passed}/${results.length} tests passed`);
```

---

## What to Look For

✅ **All tests pass** → Phase 1 is working correctly
❌ **Any test fails** → Check browser console for detailed error
⚠️ **Slow performance** → Check Network tab for API delays

---

## Rollback If Needed

If tests fail:

```bash
# On GitHub:
git revert HEAD
git push origin main

# GitHub Pages redeploys within 2 minutes
```
