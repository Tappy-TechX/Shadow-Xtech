const { cmd } = require('../command');
const config = require('../config');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
const thumbnailUrl = 'https://files.catbox.moe/3l3qgq.jpg';

const LOADING_MESSAGES = [
    "🔍 Syncing owner data...",
    "📡 Establishing uplink...",
    "🧠 Linking neural ID...",
    "⚙️ Preparing access...",
    "💠 Fetching core credentials..."
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
            return reply("🚫 Missing owner details in the config file.");
        }

        // Step 0: Loading message
        const randomLoading = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        await reply(randomLoading);

        // Step 1: Contact vCard
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

        // Step 1.5: Raw contact link
        await reply(`📞 *Owner Contact:* wa.me/${ownerNumber.replace('+', '')}`);

        // Step 2: Image + caption with forwarded context
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/og4tsk.jpg' },
            caption: 
`⎾=========================================⏌
  🛡️ *SYSTEM ACCESS: OWNER MODULE* 🛡️
 ⌬━━━━━━━━━━━━━━━━━━━⌬
  ◉ 👤 *Name:* ${ownerName}
  ◉ 📞 *Number:* ${ownerNumber}
  ◉ 🔰 *System ID:* Shadow-Xtech AI
  ◉ ⚙️ *Core Version:* 8.0.0 Beta
  ◉ 🧠 *Neural Core:* ACTIVE
  ◉ 🌐 *Node State:* LINKED
 ⌬━━━━━━━━━━━━━━━━━━━⌬
 📩 _Use responsibly or emergencies only._
⎿=========================================⏋`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: 'ֆཏɑɖօա-𝕏Ե𝖾𝖼ཏ',
                    serverMessageId: 143,
                    externalAdReply: {
                        title: "⚙️ Shadow-Xtech Owner Sync",
                        body: "🔍 Quantum trace initialized. Authority uplink to Prime Operator established.",
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: whatsappChannelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }
        }, { quoted: mek });

        // Step 3: Owner voice tag
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/4yqp5m.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await reply(`❌ *Error: Owner Module Failed*\n> *${error.message}*`);
    }
});