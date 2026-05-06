const config = require('../config');    
const { cmd } = require('../command');    
const os = require("os");    
const { runtime } = require('../lib/functions');    

// --- CONFIGURATION ---    

const MENU_ZIP_URL = 'https://github.com/Tappy-TechX/Shadow-Xtech/archive/refs/heads/main.zip';    
const AD_IMAGE_URL = 'https://files.catbox.moe/ycn8mx.jpg';    

// Meta AI Quoted Contact
const quotedContact = {    
    key: {    
        fromMe: false,    
        participant: "0@s.whatsapp.net",    
        remoteJid: "status@broadcast"    
    },    
    message: {    
        contactMessage: {    
            displayName: "⚙️ System | Menu 📜",    
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Meta AI\nORG:Meta;\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 (313) 555-0002\nEND:VCARD"    
        }    
    }    
};    

// Loading Messages    
const LOADING_MESSAGES = [    
    "Initializing connection...🌐",    
    "Establishing Bot commands...📂",    
    "Loading modules...📦",    
    "Unleashing menu...💥",    
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

        const randomLoadingMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];    

        const menuCaption = `
╭──⭘💈 *${config.BOT_NAME}* 💈─·⭘
┆ 👤 Owner : *${config.OWNER_NAME}*
┆ ⚙️ Prefix : *[${config.PREFIX}]*
┆ 🌐 Platform : *Heroku*
┆ 📦 Version : ${config.version}
┆ ⏱️ Runtime : *${runtime(process.uptime())}*
┆ 🎲 Mode : *${config.MODE}*
╰────────────────┈⊷

${randomLoadingMessage}

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

        // DOCUMENT WITH META AI QUOTED CONTACT
        await conn.sendMessage(from, {
            document: { url: MENU_ZIP_URL },
            mimetype: 'application/zip',
            fileName: 'Shadow-Xtech.zip',
            caption: menuCaption,

            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,

                // 🔥 AD REPLY IMAGE
                externalAdReply: {
                    title: "Shadow Xtech Bot Menu",
                    body: "Click to view full bot system",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    thumbnailUrl: AD_IMAGE_URL,
                    sourceUrl: MENU_ZIP_URL
                },

                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: quotedContact });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});