const fs = require('fs'); 
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });        

function convertToBool(text, fault = 'true') { 
    return text === fault ? true : false; 
}        

module.exports = {        

    // =============================== 
    //  🔐 Session 
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
    CUSTOM_REACT_MODE: process.env.CUSTOM_REACT_MODE || "all",

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
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log", // "log" sends to bot owner, "chat" sends to chat
    ANTI_DELETE: process.env.ANTI_DELETE || "true", // Enable or disable anti-delete feature globally
    // =============================== 
    // 🌍 Mode Settings 
    // =============================== 
    MODE: process.env.MODE || "public", 
    CHATBOT_MODE: process.env.CHATBOT_MODE || "false",
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",        

    // =============================== 
    // 👨🏾‍💻 Developer Settings 
    // =============================== 
    DEV: process.env.DEV || "254759000340",  
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_AeNhu3a2VFOM@ep-bitter-bird-an8g7zvq-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
    
    // =============================== 
    // 🎁 GiftedTech API Settings
    // =============================== 
    GIFTED_API_KEY: process.env.GIFTED_API_KEY || '_0u5aff45,_0l1876s8qc',
    GIFTED_TECH_API: process.env.GIFTED_TECH_API || 'https://api.giftedtech.co.ke',     

    // =============================== 
    // 🖥️ Channel React Settings 
    // =============================== 
    CHANNEL_REACT: process.env.CHANNEL_REACT || "true",
    CHANNEL_REACT_EMOJI: process.env.CHANNEL_REACT_EMOJI || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍", 

    // =============================== 
    // 🧠 OpenAI Settings 
    // =============================== 
    OPENAI_API_KEY: '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'        
    
};