const config = require('../config');
const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

// --- CONFIGURATION ---

const MENU_ZIP_URL = 'https://github.com/Tappy-TechX/Shadow-Xtech/archive/refs/heads/main.zip';
const MENU_VIDEO_URL = 'https://files.catbox.moe/eubadj.mp4';

// Quoted Contact
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ System | Menu 📜",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\nEND:VCARD"
        }
    }
};

// Loading Messages
const LOADING_MESSAGES = [
    "Initializing connection...🌐",
    "Establishing Bot commands...📂",
    "Verifying credentials...😂",
    "Connecting to WhatsApp API...🗝️",
    "Preparing menu...🆔",
    "Redirecting to commands...📜",
    "Connecting to servers...🛰️",
    "Fetching command list...📝",
    "Authenticating user...👤",
    "Compiling menu...⚙️",
    "Displaying menu now...✅",
    "Waking up the bot...😴",
    "Brewing some coffee...☕",
    "Checking for updates...🔄",
    "Loading all modules...📦",
    "Unleashing the menu...💥",
    "Accessing mainframe...💻",
    "Decrypting command protocols...🛡️",
    "Calibrating response time...⚡",
    "Generating menu interface...🎨",
    "Welcome, user...👋"
];

// --- COMMAND ---

cmd({
    pattern: "menu",
    alias: ["panel", "commands"],
    react: "📂",
    desc: "Show bot menu",
    category: "main",
    use: ".menu",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {

        // Random loading message
        const randomLoadingMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

        // Header
        const header = `
╭──⭘💈 *${config.BOT_NAME}* 💈─·⭘
┆ ◦ • 👑 Owner : *${config.OWNER_NAME}*
┆ ◦ • ⚙️ Prefix : *[${config.PREFIX}]*
┆ ◦ • 🌐 Platform : *Heroku*
┆ ◦ • 📦 Version : ${config.version}
┆ ◦ • ⏱️ Runtime : *${runtime(process.uptime())}*
┆ ◦ • 🎲 Mode : *${config.MODE}*
┆ ◦ • 🎀 Dev : *Black-Tappy*
┆ ◦ • 🚀 Version : *4.0.0 Mᴇᴛᴀ*
╰────────────────┈⊷

${randomLoadingMessage}
`;

        // Menu Body
        const menuCaption = `
${header}

╭━━〔 *MAIN MENU* 〕━━⬣
┃ 📥 .download
┃ 🎵 .lyrics
┃ 🌤️ .weather
┃ ⏱️ .uptime
┃ 🧠 .ai
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *OWNER MENU* 〕━━⬣
┃ 🔒 .ban
┃ 🔓 .unban
┃ ⚙️ .mode
╰━━━━━━━━━━━━━━━⬣

© Shadow Xtech
`;

        // 1. Send VIDEO MENU (with external ad reply style)
        await conn.sendMessage(from, {
            video: { url: MENU_VIDEO_URL },
            caption: menuCaption,
            gifPlayback: true,
            mimetype: 'video/mp4',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: quotedContact });

        // 2. Send DOCUMENT MENU
        await conn.sendMessage(from, {
            document: { url: MENU_ZIP_URL },
            mimetype: 'application/zip',
            fileName: 'Shadow-Xtech.zip',
            caption: "📦 Download full bot here",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Shadow Xtech",
                    newsletterJid: "120363369453603973@newsletter"
                }
            }
        }, { quoted: quotedContact });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});