const fs = require('fs'); 
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });        

function convertToBool(text, fault = 'true') { 
    return text === fault ? true : false; 
}        

module.exports = {        

    // =============================== 
    // 🔐 Session 
    // =============================== 
    SESSION_ID: process.env.SESSION_ID || "Shadow-Xtech~TIZS1bRB#tdEuL2kc47iAhItPKKQ_XaqkKLXp8zcqfR9_BoFxsQ8",        

    // =============================== 
    // 📊 Status Settings 
    // =============================== 
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true", 
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false", 
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true", 
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*Seen Your Status By Shadow-Xtech 🩷*",        

    // =============================== 
    // 👥 Group Settings 
    // =============================== 
    WELCOME: process.env.WELCOME || "true", 
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false", 
    ANTI_LINK: process.env.ANTI_LINK || "true", 
    DELETE_LINKS: process.env.DELETE_LINKS || "false", 
    ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",        

    // =============================== 
    // 💬 Mention & Reactions 
    // =============================== 
    MENTION_REPLY: process.env.MENTION_REPLY || "false", 
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false", 
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",        

    // =============================== 
    // 🤖 Bot Identity 
    // =============================== 
    PREFIX: process.env.PREFIX || ".", 
    BOT_NAME: process.env.BOT_NAME || "SHADOW-XTECH", 
    STICKER_NAME: process.env.STICKER_NAME || "SHADOW-XTECH", 
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254759000340", 
    OWNER_NAME: process.env.OWNER_NAME || "Black-Tappy", 
    DESCRIPTION: process.env.DESCRIPTION || "*© Powered By Black-Tappy*",        

    // =============================== 
    // 🖼️ Media Settings 
    // =============================== 
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/og4tsk.jpg", 
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/og4tsk.jpg", 
    LIVE_MSG: process.env.LIVE_MSG || "> AM ACTIVE *SHADOW-XTECH*⚡",        

    // =============================== 
    // 💬 Message Behavior 
    // =============================== 
    READ_MESSAGE: process.env.READ_MESSAGE || "false", 
    AUTO_REACT: process.env.AUTO_REACT || "false", 
    AUTO_REPLY: process.env.AUTO_REPLY || "false", 
    AUTO_VOICE: process.env.AUTO_VOICE || "false", 
    AUTO_STICKER: process.env.AUTO_STICKER || "false", 
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false", 
    AUTO_TYPING: process.env.AUTO_TYPING || "false", 
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false", 
    READ_CMD: process.env.READ_CMD || "false",        

    // =============================== 
    // 🛡️ Security Settings 
    // =============================== 
    ANTI_BAD: process.env.ANTI_BAD || "false", 
    ANTI_VV: process.env.ANTI_VV || "true", 
    ANTICALL: process.env.ANTICALL || "false",        

    // =============================== 
    // ♻️ Antidelete Settings 
    // =============================== 
    ANTI_DELETE_GC: process.env.ANTI_DELETE_GC || "true",     // Enable in Group Chats 
    ANTI_DELETE_DM: process.env.ANTI_DELETE_DM || "true",     // Enable in Private Chats        

    /* ANTI_DEL_PATH: "log"  = send deleted messages to bot inbox "same" = resend in same chat */ 
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log",        

    // =============================== 
    // 🌍 Mode Settings 
    // =============================== 
    MODE: process.env.MODE || "public", 
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",        

    // =============================== 
    // 👨🏾‍💻 Developer Settings 
    // =============================== 
    DEV: process.env.DEV || "254759000340",        

    // =============================== 
    // 🖥️ Channel React Settings 
    // =============================== 
    channelReact: { 
        enabled: true,            
        emojis: ["🔥", "❤️", "😂", "🥳", "😁"] 
    },        

    // =============================== 
    // 🧠 OpenAI Settings 
    // =============================== 
    OPENAI_API_KEY: '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'        
    
};