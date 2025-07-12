const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../settings.json');

let settingsCache = {};

/**
 * Loads settings from the settings.json file.
 * If the file doesn't exist, it creates it with default values.
 * If the file exists but is corrupted or empty, it creates a new one with defaults.
 * It also ensures the 'ANTICALL' setting exists, defaulting to true if not found.
 */
const loadSettings = () => {
    if (fs.existsSync(SETTINGS_FILE)) {
        try {
            // Read the file content and parse it as JSON.
            settingsCache = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
            console.log("[SETTINGS] Settings loaded from file.");
            
            if (typeof settingsCache.ANTICALL === 'undefined') {
                settingsCache.ANTICALL = true; // Default value
                saveSettings(); // Save the updated settings with the default value
            }
        } catch (e) {
            console.error("[SETTINGS ERROR] Failed to parse settings.json, creating a new one.", e);
            settingsCache = {
                "ANTICALL": true // Default settings
            };
            saveSettings();
        }
    } else {
        // If the settings file does not exist, create it with default values.
        settingsCache = {
            "ANTICALL": true // Default settings
        };
        saveSettings();
        console.log("[SETTINGS] settings.json not found, created with default values.");
    }
};

/**
 * Saves the current settings from the in-memory cache to the settings.json file.
 * It formats the JSON with an indent of 2 spaces for readability.
 */
const saveSettings = () => {
    try {
        // Write the JSON string to the file, overwriting if it exists.
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsCache, null, 2), 'utf8');
        console.log("[SETTINGS] Settings saved to file.");
    } catch (e) {
        // Log any errors encountered during the save operation.
        console.error("[SETTINGS ERROR] Failed to save settings.json", e);
    }
};

/**
 * Retrieves a specific setting from the in-memory cache.
 * @param {string} key - The name of the setting to retrieve.
 * @returns {*} The value of the requested setting, or undefined if it doesn't exist.
 */
const getSetting = (key) => {
    return settingsCache[key];
};

/**
 * Sets or updates a specific setting in the in-memory cache and immediately saves it to the file.
 * @param {string} key - The name of the setting to set.
 * @param {*} value - The new value for the setting.
 */
const setSetting = (key, value) => {
    settingsCache[key] = value;
    saveSettings(); // Save immediately after updating the cache
};

// Load settings when the module is first required to ensure the cache is populated.
loadSettings();

module.exports = {
    getSetting,
    setSetting,
    loadSettings // Exporting loadSettings allows for manual refreshing if needed, though it's called on load.
};
