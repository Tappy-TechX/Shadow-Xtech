const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// 🔁 Helper to write a single key back to config.env
function saveEnvVar(key, value) {
    const envPath = './config.env';
    const NEWLINE = '\n';

    // Ensure the file exists (create if missing)
    if (!fs.existsSync(envPath)) fs.writeFileSync(envPath, '', 'utf8');

    let lines = fs.readFileSync(envPath, 'utf8').split(NEWLINE);
    let found = false;

    // Replace the line that starts with "KEY=" (allowing optional quotes)
    const regex = new RegExp(`^${key}=.*$`);
    lines = lines.map(line => {
        if (regex.test(line)) {
            found = true;
            return `${key}=${value}`;   // store raw value without quotes
        }
        return line;
    });

    // If the key wasn't present, append it
    if (!found) {
        if (lines[lines.length - 1] !== '') lines.push(''); // blank line before new entry
        lines.push(`${key}=${value}`);
    }

    fs.writeFileSync(envPath, lines.join(NEWLINE), 'utf8');
}

// Helper to convert env var to bool (kept for backward compatibility)
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// ✅ Default values – same as your original config
const DEFAULTS = {
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
    CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
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
    DATABASE_URL: "postgresql://neondb_owner:npg_AeNhu3a2VFOM@ep-bitter-bird-an8g7zvq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
    GIFTED_API_KEY: "_0u5aff45,_0l1876s8qc",
    GIFTED_TECH_API: "https://api.giftedtech.co.ke",
    CHANNEL_REACT: "true",
    CHANNEL_REACT_EMOJI: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    OPENAI_API_KEY: "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",
};

// 🔁 The magic: Proxy that reads/writes process.env and persists to config.env
const configProxy = new Proxy({}, {
    get(target, prop) {
        // Always prefer process.env (which may have been changed at runtime)
        if (prop in process.env) return process.env[prop];
        if (prop in DEFAULTS) return DEFAULTS[prop];
        return undefined;
    },
    set(target, prop, value) {
        // Update the runtime environment
        process.env[prop] = String(value);
        // Save to config.env immediately
        saveEnvVar(prop, String(value));
        return true; // indicate success
    }
});

module.exports = configProxy;
