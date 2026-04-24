const fs = require("fs");
if (fs.existsSync("config.env")) require("dotenv").config({ path: "./config.env" });

const { getGlobal } = require("./data/settings");

// fallback parser
const env = (key, def) => process.env[key] ?? def;

// 🔥 SMART CONFIG WRAPPER
function getConfig(key, fallback) {
    const globalValue = getGlobal(key);
    if (globalValue !== undefined) return globalValue;

    return env(key, fallback);
}

module.exports = {

    // ===============================
    // 🔐 Session
    // ===============================
    SESSION_ID: getConfig("SESSION_ID",
        "Shadow-Xtech~TIZS1bRB#tdEuL2kc47iAhItPKKQ_XaqkKLXp8zcqfR9_BoFxsQ8"
    ),

    // ===============================
    // 📊 Status Settings
    // ===============================
    AUTO_STATUS_SEEN: getConfig("AUTO_STATUS_SEEN", "true"),
    AUTO_STATUS_REPLY: getConfig("AUTO_STATUS_REPLY", "false"),
    AUTO_STATUS_REACT: getConfig("AUTO_STATUS_REACT", "true"),
    AUTO_STATUS_MSG: getConfig("AUTO_STATUS_MSG", "*Seen Your Status By Shadow-Xtech 🩷*"),

    // ===============================
    // 👥 Group Settings
    // ===============================
    WELCOME: getConfig("WELCOME", "true"),
    ADMIN_EVENTS: getConfig("ADMIN_EVENTS", "false"),
    ANTI_LINK: getConfig("ANTI_LINK", "true"),
    DELETE_LINKS: getConfig("DELETE_LINKS", "false"),
    ANTI_LINK_KICK: getConfig("ANTI_LINK_KICK", "false"),

    // ===============================
    // 💬 Mention & Reactions
    // ===============================
    MENTION_REPLY: getConfig("MENTION_REPLY", "false"),
    CUSTOM_REACT: getConfig("CUSTOM_REACT", "false"),
    CUSTOM_REACT_EMOJIS: getConfig(
        "CUSTOM_REACT_EMOJIS",
        "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍"
    ),
    CUSTOM_REACT_MODE: getConfig("CUSTOM_REACT_MODE", "all"),

    // ===============================
    // 🤖 Bot Identity
    // ===============================
    PREFIX: getConfig("PREFIX", "."),
    BOT_NAME: getConfig("BOT_NAME", "SHADOW-XTECH"),
    STICKER_NAME: getConfig("STICKER_NAME", "SHADOW-XTECH"),
    OWNER_NUMBER: getConfig("OWNER_NUMBER", "254759000340"),
    OWNER_NAME: getConfig("OWNER_NAME", "Black-Tappy"),
    DESCRIPTION: getConfig("DESCRIPTION", "*© Powered By Black-Tappy*"),

    // ===============================
    // 🛡️ Security Settings
    // ===============================
    ANTI_BAD: getConfig("ANTI_BAD", "false"),
    ANTI_VV: getConfig("ANTI_VV", "true"),
    ANTICALL: getConfig("ANTICALL", "false"),

    // ===============================
    // ♻️ Anti Features
    // ===============================
    ANTI_DEL_PATH: getConfig("ANTI_DEL_PATH", "log"),
    ANTI_DELETE: getConfig("ANTI_DELETE", "true"),
    ANTI_EDIT: getConfig("ANTI_EDIT", "true"),

    // ===============================
    // 🌍 Mode Settings
    // ===============================
    MODE: getConfig("MODE", "public"),
    CHATBOT_MODE: getConfig("CHATBOT_MODE", "false"),
    PUBLIC_MODE: getConfig("PUBLIC_MODE", "true"),

    // ===============================
    // 👨🏾‍💻 Developer Settings
    // ===============================
    DEV: getConfig("DEV", "254759000340"),
    DATABASE_URL: getConfig("DATABASE_URL", "postgresql://..."),

    // ===============================
    // 🧠 API Keys
    // ===============================
    GIFTED_API_KEY: getConfig("GIFTED_API_KEY", "_0u5aff45,_0l1876s8qc"),
    GIFTED_TECH_API: getConfig("GIFTED_TECH_API", "https://api.giftedtech.co.ke"),

    OPENAI_API_KEY:
        process.env.OPENAI_API_KEY ||
        "sk-proj-xxxx"
};