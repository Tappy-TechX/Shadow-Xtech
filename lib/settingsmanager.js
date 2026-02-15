const fs = require('fs');
const path = require('path');

// Updated path to fetch settings.json from the 'data' directory
const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');
let settingsCache = {}; // Cache to hold settings in memory

// Initialize settings from file or create if not exists
const loadSettings = () => {
    // Ensure the 'data' directory exists before trying to read the file
    const dataDir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dataDir)) {
        try {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log(`[SETTINGS] Created directory: ${dataDir}`);
        } catch (e) {
            console.error(`[SETTINGS ERROR] Failed to create directory ${dataDir}`, e);
            
        }
    }

    if (fs.existsSync(SETTINGS_FILE)) {
        try {
            const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf8');
            // Handle empty file case
            if (fileContent.trim() === '') {
                console.log("[SETTINGS] settings.json is empty, initializing with defaults.");
                settingsCache = {
                    "ANTICALL": false // Default value
                };
            } else {
                settingsCache = JSON.parse(fileContent);
                console.log("[SETTINGS] Settings loaded from file.");
            }

            // Ensure ANTICALL exists if loaded from an old or empty file
            if (typeof settingsCache.ANTICALL === 'undefined') {
                settingsCache.ANTICALL = false; // Default to false if not found
                saveSettings(); // Save immediately after adding the default
            }
        } catch (e) {
            console.error("[SETTINGS ERROR] Failed to parse settings.json. Creating a new one with default values.", e);
            settingsCache = {
                "ANTICALL": false // Default value if file is corrupted or unreadable
            };
            saveSettings();
        }
    } else {
        settingsCache = {
            "ANTICALL": false // Default settings if file doesn't exist
        };
        saveSettings();
        console.log("[SETTINGS] settings.json not found, created with default values.");
    }
};

const saveSettings = () => {
    try {
        // Ensure the directory exists before writing (redundant if loadSettings ran, but safe)
        const dataDir = path.dirname(SETTINGS_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsCache, null, 2), 'utf8');
        console.log("[SETTINGS] Settings saved to file.");
    } catch (e) {
        console.error("[SETTINGS ERROR] Failed to save settings.json", e);
    }
};

const getSetting = (key) => {
    // Return undefined if key doesn't exist, consistent with object behavior
    return settingsCache[key];
};

const setSetting = (key, value) => {
    settingsCache[key] = value;
    saveSettings(); // Save immediately after setting
};

// Load settings when the module is required
loadSettings();

module.exports = {
    getSetting,
    setSetting,
    loadSettings // Export for potential manual refresh if needed
};
