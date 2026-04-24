const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config.env");

/**
 * Ensure config.env exists
 */
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "");
}

/**
 * Load env values
 */
dotenv.config({ path: envPath });

/**
 * Convert helper
 */
function convertToBool(text, fault = "true") {
    return text === fault;
}

/**
 * ===============================
 * DEFAULT CONFIG VALUES
 * ===============================
 */
const defaults = {
    SESSION_ID: "Shadow-Xtech~TIZS1bRB#tdEuL2kc47iAhItPKKQ_XaqkKLXp8zcqfR9",

    AUTO_STATUS_SEEN: "true",
    AUTO_STATUS_REPLY: "false",
    AUTO_STATUS_REACT: "true",
    AUTO_STATUS_MSG: "*Seen Your Status By Shadow-Xtech 🩷*",

    WELCOME: "true",
    ADMIN_EVENTS: "false",
    ANTI_LINK: "true",
    DELETE_LINKS: "false",
    ANTI_LINK_KICK: "false",
    ANTI_LINK_ACTION: "warn",

    MENTION_REPLY: "false",
    CUSTOM_REACT: "false",
    CUSTOM_REACT_EMOJIS:
        "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    CUSTOM_REACT_MODE: "all",

    PREFIX: ".",
    BOT_NAME: "SHADOW-XTECH",
    STICKER_NAME: "SHADOW-XTECH",
    OWNER_NUMBER: "254759000340",
    OWNER_NAME: "Black-Tappy",
    DESCRIPTION: "*© Powered By Black-Tappy*",

    MENU_IMAGE_URL: "https://files.catbox.moe/og4tsk.jpg",
    ALIVE_IMG: "https://files.catbox.moe/og4tsk.jpg",
    LIVE_MSG: "> AM ACTIVE *SHADOW-XTECH*⚡",

    AUTO_FONT: "off",
    READ_MESSAGE: "false",
    AUTO_REACT: "false",
    AUTO_REPLY: "false",
    AUTO_VOICE: "false",
    AUTO_STICKER: "false",
    ALWAYS_ONLINE: "false",
    AUTO_TYPING: "false",
    AUTO_RECORDING: "false",
    AUTO_TYPING_RECORDING: "false",
    READ_CMD: "false",

    ANTI_BAD: "false",
    ANTI_VV: "true",
    ANTICALL: "false",

    ANTI_DEL_PATH: "log",
    ANTI_DELETE: "true",
    ANTI_EDIT: "true",

    MODE: "public",
    CHATBOT_MODE: "false",
    PUBLIC_MODE: "true",

    DEV: "254759000340",

    DATABASE_URL: process.env.DATABASE_URL || "",

    GIFTED_API_KEY: "",
    GIFTED_TECH_API: "https://api.giftedtech.co.ke",

    CHANNEL_REACT: "true",
    CHANNEL_REACT_EMOJI:
        "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",

    OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
};

/**
 * ===============================
 * ACTIVE CONFIG STORAGE
 * ===============================
 */
const store = {};

/**
 * Load defaults + saved env
 */
for (const key in defaults) {
    store[key] = process.env[key] ?? defaults[key];
}

/**
 * ===============================
 * SAVE FUNCTION
 * ===============================
 */
function saveConfig() {
    let data = "";

    for (const key in store) {
        data += `${key}=${store[key]}\n`;
    }

    fs.writeFileSync(envPath, data);
}

/**
 * ===============================
 * UPDATE CONFIG (PERSISTENT)
 * ===============================
 */
function updateConfig(key, value) {
    store[key] = String(value);
    process.env[key] = String(value);
    saveConfig();
}

/**
 * ===============================
 * RESET CONFIG
 * ===============================
 */
function resetConfig(key) {
    if (!(key in defaults)) return false;

    store[key] = defaults[key];
    process.env[key] = defaults[key];
    saveConfig();

    return true;
}

/**
 * ===============================
 * AUTO SYNC NEW KEYS AFTER UPDATE
 * ===============================
 */
function syncNewDefaults() {
    let changed = false;

    for (const key in defaults) {
        if (!store[key]) {
            store[key] = defaults[key];
            process.env[key] = defaults[key];
            changed = true;
        }
    }

    if (changed) saveConfig();
}

syncNewDefaults();

/**
 * ===============================
 * PROXY EXPORT (IMPORTANT)
 * ===============================
 * Keeps plugin usage unchanged:
 * config.ANTI_LINK still works normally
 */
module.exports = new Proxy(store, {
    get(target, prop) {
        if (prop === "updateConfig") return updateConfig;
        if (prop === "resetConfig") return resetConfig;
        if (prop === "saveConfig") return saveConfig;
        if (prop === "convertToBool") return convertToBool;

        return target[prop];
    }
});
