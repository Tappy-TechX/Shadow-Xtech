const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Bot launch time

const FALLBACK_WALLPAPERS = [
    "https://files.catbox.moe/og4tsk.jpg",
    "https://files.catbox.moe/odst1m.jpg",
    "https://files.catbox.moe/95n1x6.jpg",
    "https://files.catbox.moe/0w7hqx.jpg"
];

const FANCY_QUOTES = [
    "🧬 Neural grid stable — systems running within optimal range.",
    "🛰 Core uplink established — listening for user signal...",
    "⚡ Power node calibrated — quantum stream active.",
    "🧠 AI kernel synchronized — directive input mode engaged.",
    "⚙️ XTECH protocol active — mission parameters clear.",
    "🔋 Energy flow: 100% | AI routine: ALIVE",
    "🚀 Fusion reactor idle. Awaiting next instruction...",
    "🌐 Multi-thread ops: — No anomalies detected."
];

// Quoted contact to show as reference
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Alive | Status 🟢 ",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
        }
    }
};

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🎀",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const runtimeMs = Date.now() - botStartTime;
        const runtime = {
            hours: Math.floor(runtimeMs / (1000 * 60 * 60)),
            minutes: Math.floor((runtimeMs / (1000 * 60)) % 60),
            seconds: Math.floor((runtimeMs / 1000) % 60),
        };

        const caption = `
🌟 *SHADOW-XTECH STATUS* 🌟
*Hey 👋🏻 ${pushname}*
🕒 *Time*: *${currentTime}*
📅 *Date*: *${currentDate}*
⏳ *Uptime*: *${runtime.hours}h ${runtime.minutes}m ${runtime.seconds}s*

*🤖Status*: *Bot is alive and healthy🛠️*

"*${getRandomQuote()}*"

*🔹 Powered by Black-Tappy 🔹*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: getRandomWallpaper() },
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: 'Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ SHADOW-XTECH SYSTEM STATUS",
                    body: "Bot is live and operational — stay connected!",
                    thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (error) {
        console.error("Error in alive command: ", error);
        const errorMessage = `
❌ An error occurred while processing the *alive* command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});
