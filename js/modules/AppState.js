/**
 * Application State Management Module
 * ============================================================================
 * Centralized, observable state container with change notifications.
 * Replaces global mutable state object with proper state management.
 */

class AppState {
    #state = {
        sites: [],
        markers: new Map(),
        currentUnit: CONFIG.app.defaultUnit,
        mapInstance: null,
        loading: false,
        selectedSite: null,
        weatherCache: new Map()
    };

    #listeners = new Map(); // { key: Set<listener> }
    #globalListeners = new Set();

    /**
     * Get a state value (deep clone for objects to prevent external mutations)
     * @param {string} key - State key
     * @returns {any} State value
     */
    get(key) {
        if (key === undefined) {
            return this.#deepClone(this.#state);
        }
        return this.#deepClone(this.#state[key]);
    }

    /**
     * Set a state value and notify listeners
     * @param {string} key - State key
     * @param {any} value - New value
     * @returns {boolean} True if value changed, false if same
     */
    set(key, value) {
        const oldValue = this.#state[key];

        // Prevent unnecessary updates
        if (this.#areEqual(oldValue, value)) {
            return false;
        }

        this.#state[key] = value;
        this.#notifyListeners(key, value, oldValue);
        return true;
    }

    /**
     * Update nested object properties
     * @param {string} key - State key for object
     * @param {object} updates - Properties to merge
     * @returns {boolean} True if changed
     */
    update(key, updates) {
        const current = this.#state[key];
        if (typeof current !== 'object' || current === null) {
            throw new Error(`Cannot update non-object state key: ${key}`);
        }
        const updated = { ...current, ...updates };
        return this.set(key, updated);
    }

    /**
     * Subscribe to state changes
     * @param {string|null} key - Specific key to watch, or null for all changes
     * @param {function} listener - Callback(value, oldValue, key)
     * @returns {function} Unsubscribe function
     */
    subscribe(key, listener) {
        if (key === null || key === undefined) {
            // Global listener for all changes
            this.#globalListeners.add(listener);
            return () => this.#globalListeners.delete(listener);
        }

        // Key-specific listener
        if (!this.#listeners.has(key)) {
            this.#listeners.set(key, new Set());
        }
        this.#listeners.get(key).add(listener);

        return () => {
            this.#listeners.get(key).delete(listener);
            if (this.#listeners.get(key).size === 0) {
                this.#listeners.delete(key);
            }
        };
    }

    /**
     * Subscribe to multiple keys
     * @param {array} keys - Keys to watch
     * @param {function} listener - Callback(changes)
     * @returns {function} Unsubscribe function
     */
    subscribeMultiple(keys, listener) {
        const unsubscribers = keys.map(key =>
            this.subscribe(key, (value, oldValue) => {
                listener({ [key]: { value, oldValue } });
            })
        );
        return () => unsubscribers.forEach(unsub => unsub());
    }

    /**
     * Get state snapshot (for debugging)
     * @returns {object} Deep clone of entire state
     */
    snapshot() {
        return this.#deepClone(this.#state);
    }

    /**
     * Reset state to initial values
     */
    reset() {
        this.#state = {
            sites: [],
            markers: new Map(),
            currentUnit: CONFIG.app.defaultUnit,
            mapInstance: null,
            loading: false,
            selectedSite: null,
            weatherCache: new Map()
        };
        this.#notifyListeners('__reset__', null, null);
    }

    /**
     * Internal: Notify listeners of change
     */
    #notifyListeners(key, newValue, oldValue) {
        // Key-specific listeners
        if (this.#listeners.has(key)) {
            this.#listeners.get(key).forEach(listener => {
                try {
                    listener(newValue, oldValue, key);
                } catch (error) {
                    Logger.error(`Error in state listener for ${key}`, error);
                }
            });
        }

        // Global listeners
        this.#globalListeners.forEach(listener => {
            try {
                listener(key, newValue, oldValue);
            } catch (error) {
                Logger.error('Error in global state listener', error);
            }
        });
    }

    /**
     * Deep equality check
     */
    #areEqual(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return a === b;
        if (typeof a !== typeof b) return false;
        if (typeof a !== 'object') return a === b;

        // For Maps and Sets
        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false;
            for (const [key, val] of a) {
                if (!b.has(key) || !this.#areEqual(val, b.get(key))) return false;
            }
            return true;
        }

        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) return false;
            for (const val of a) {
                if (!b.has(val)) return false;
            }
            return true;
        }

        // For objects and arrays
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(key => this.#areEqual(a[key], b[key]));
    }

    /**
     * Deep clone for preventing external mutations
     */
    #deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Map) return new Map(obj);
        if (obj instanceof Set) return new Set(obj);
        if (Array.isArray(obj)) return obj.map(item => this.#deepClone(item));

        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.#deepClone(obj[key]);
            }
        }
        return cloned;
    }
}
