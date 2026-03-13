const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');
let settingsCache = {}; 

// Initialize settings from file or create if not exists
const loadSettings = () => {
    const dataDir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dataDir)) {
        try {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log(`⚙️ Created directory: ${dataDir}`);
        } catch (e) {
            console.error(`🔴 Failed to create directory ${dataDir}`, e);
            
        }
    }

    if (fs.existsSync(SETTINGS_FILE)) {
        try {
            const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf8');
            // Handle empty file case
            if (fileContent.trim() === '') {
                console.log("📂 settings.json is empty, initializing with defaults.");
                settingsCache = {
                    "ANTICALL": false 
                };
            } else {
                settingsCache = JSON.parse(fileContent);
                console.log("📂 Settings loaded from file.");
            }

            if (typeof settingsCache.ANTICALL === 'undefined') {
                settingsCache.ANTICALL = false; 
                saveSettings(); 
            }
        } catch (e) {
            console.error("🔴 Failed to parse settings.json. Creating a new one with default values.", e);
            settingsCache = {
                "ANTICALL": false 
            };
            saveSettings();
        }
    } else {
        settingsCache = {
            "ANTICALL": false 
        };
        saveSettings();
        console.log("🔴 settings.json not found, created with default values.");
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
        console.log("📂 Settings saved to file.");
    } catch (e) {
        console.error("🔴 Failed to save settings.json", e);
    }
};

const getSetting = (key) => {
    // Return undefined if key doesn't exist, consistent with object behavior
    return settingsCache[key];
};

const setSetting = (key, value) => {
    settingsCache[key] = value;
    saveSettings(); 
};

// Load settings when the module is required
loadSettings();

module.exports = {
    getSetting,
    setSetting,
    loadSettings 
};
