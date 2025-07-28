const { cmd } = require('../command');
const config = require('../config');

const LOADING_MESSAGES = [
    "🔍 Initializing neural handshake with Shadow-Xtech Core...",
    "📡 Pinging mainframe... Establishing secure data tunnel...",
    "🧬 Decoding encrypted owner credentials...",
    "💠 Syncing with owner uplink interface...",
    "⚙️ Booting contact protocol... Please stand by..."
];

cmd({
    pattern: "owner",
    react: "👨‍💻",
    desc: "Displays bot owner's contact info",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER;
        const ownerName = config.OWNER_NAME;

        if (!ownerNumber || !ownerName) {
            return reply("⚠️ Missing owner details in the config file.");
        }

        // Step 0: Random futuristic loading message
        const randomLoading = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        await reply(randomLoading);

        // Step 1: Send contact card
        const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${ownerName}`,
            `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
            'END:VCARD'
        ].join('\n');

        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Step 2: Send image and owner details
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/og4tsk.jpg' },
            caption: 
`
⎾=========================================⏌
  🛡️ *SYSTEM ACCESS: OWNER MODULE* 🛡️
─────────────────────
👤 *Name:* ${ownerName}
📞 *Number:* ${ownerNumber}
🔰 *System ID:* Shadow-Xtech AI
⚙️ *Core Version:* 8.0.0 Beta
🧠 *Neural Core:* ACTIVE
🌐 *Node State:* LINKED
─────────────────────
📩 _Use responsibly or emergencies only._
⎿====================================⏋`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: '𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Step 3: Send audio (voice tag)
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/4yqp5m.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await reply(`❌ *ERROR: OWNER MODULE FAILED*\n> ${error.message}`);
    }
});