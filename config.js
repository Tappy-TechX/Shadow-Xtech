const fs = require("fs");

if (fs.existsSync("config.env")) {
    require("dotenv").config({ path: "./config.env" });
}

const { getGlobal, setGlobal } = require("./data/settings");

// Default config values
const defaults = {
    SESSION_ID: "Shadow-Xtech~TIZS1bRB#tdEuL2kc47iAhItPKKQ_XaqkKLXp8zcqfR9_BoFxsQ8",

    AUTO_STATUS_SEEN: "true",
    AUTO_STATUS_REPLY: "false",
    AUTO_STATUS_REACT: "true",
    AUTO_STATUS_MSG: "*Seen Your Status By Shadow-Xtech 🩷*",

    WELCOME: "true",
    ADMIN_EVENTS: "false",

    ANTI_LINK: "true",
    DELETE_LINKS: "false",
    ANTI_LINK_KICK: "false",

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

    // FIXED FONT KEY
    AUTO_FONT: "off",

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
    DATABASE_URL: "postgresql://...",

    GIFTED_API_KEY: "_0u5aff45,_0l1876s8qc",
    GIFTED_TECH_API: "https://api.giftedtech.co.ke"
};

// Dynamic config
module.exports = new Proxy(defaults, {
    get(target, key) {
        const settingKey = String(key);

        // 1. settings.json priority
        const savedValue = getGlobal(settingKey);
        if (savedValue !== undefined) {
            return savedValue;
        }

        // 2. config.env fallback
        if (process.env[settingKey] !== undefined) {
            return process.env[settingKey];
        }

        // 3. Save missing default automatically
        if (target[settingKey] !== undefined) {
            setGlobal(settingKey, target[settingKey]);
            return target[settingKey];
        }

        return undefined;
    }
});
