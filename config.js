const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config.env");

/**
 * Ensure config file exists
 */
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "");
}

/**
 * Load ENV FIRST
 */
dotenv.config({ path: envPath });

function convertToBool(text, fault = "true") {
    return text === fault;
}

/**
 * =========================
 * DEFAULT CONFIG
 * =========================
 */
const defaults = {
    SESSION_ID: "Shadow-Xtech~TIZS1bRB#tdEuL2kc47iAhItPKKQ",

    AUTO_FONT: "off",
    ANTI_LINK: "true",
    ANTI_LINK_ACTION: "warn",
    WELCOME: "true",
    PREFIX: ".",
    BOT_NAME: "SHADOW-XTECH",

    AUTO_STATUS_SEEN: "true",
    AUTO_STATUS_REPLY: "false",
    AUTO_STATUS_REACT: "true",

    OWNER_NUMBER: "254759000340",
    OWNER_NAME: "Black-Tappy",

    MENU_IMAGE_URL: "https://files.catbox.moe/og4tsk.jpg",
    ALIVE_IMG: "https://files.catbox.moe/og4tsk.jpg",

    LIVE_MSG: "> AM ACTIVE *SHADOW-XTECH*⚡",

    READ_MESSAGE: "false",
    AUTO_REACT: "false",
    AUTO_REPLY: "false",

    ANTI_DELETE: "true",
    ANTI_EDIT: "true",

    MODE: "public",

    DATABASE_URL: process.env.DATABASE_URL || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
};

/**
 * =========================
 * LOAD CONFIG (IMPORTANT FIX)
 * =========================
 * Priority:
 * 1. config.env (saved values)
 * 2. defaults
 */
const config = {};

for (const key in defaults) {
    if (process.env[key] !== undefined) {
        config[key] = process.env[key];
    } else {
        config[key] = defaults[key];
    }
}

/**
 * =========================
 * SAVE CONFIG
 * =========================
 */
function saveConfig() {
    let data = "";

    for (const key in config) {
        data += `${key}=${config[key]}\n`;
    }

    fs.writeFileSync(envPath, data);
}

/**
 * =========================
 * UPDATE CONFIG (FIXED)
 * =========================
 */
function updateConfig(key, value) {
    config[key] = String(value);
    process.env[key] = String(value);

    saveConfig();

    return true;
}

/**
 * =========================
 * RESET CONFIG
 * =========================
 */
function resetConfig(key) {
    if (!(key in defaults)) return false;

    config[key] = defaults[key];
    process.env[key] = defaults[key];

    saveConfig();

    return true;
}

/**
 * =========================
 * SYNC NEW KEYS AFTER UPDATE
 * =========================
 */
function syncNewDefaults() {
    let changed = false;

    for (const key in defaults) {
        if (!config[key]) {
            config[key] = defaults[key];
            process.env[key] = defaults[key];
            changed = true;
        }
    }

    if (changed) saveConfig();
}

syncNewDefaults();

/**
 * =========================
 * PROXY EXPORT (NO PLUGIN CHANGES)
 * =========================
 */
module.exports = new Proxy(config, {
    get(target, prop) {
        if (prop === "updateConfig") return updateConfig;
        if (prop === "resetConfig") return resetConfig;
        if (prop === "saveConfig") return saveConfig;
        if (prop === "convertToBool") return convertToBool;

        return target[prop];
    }
});
