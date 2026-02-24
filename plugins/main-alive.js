const { cmd } = require("../command");
const moment = require("moment");

// Bot start time
let botStartTime = Date.now(); 

// Fancy quotes array
const FANCY_QUOTES = [
    "⚙️ Systems fully operational 🚀",
    "🧩 Core modules running smooth 🌟",
    "🤖 AI routines online now ⚡",
    "🔮 Quantum node active ⚡",
    "🚀 Bot engines firing strong 💥",
    "📡 Protocols loaded and ready ✅",
    "🌊 Streams flowing without errors 🛡️",
    "🟢 Operations stable and normal ✔️"
];

// Status messages array
const BOT_STATUS_MESSAGES = [
    "🛰️ All circuits green ✅",
    "⚡ Processing cmds smoothly 🔄",
    "🤖 AI heartbeat detected 💓",
    "🌐 Network links stable 🔗",
    "🚀 Modules synced and ready 🛠️",
    "🔋 Power levels optimal ⚡",
    "🧠 Kernel routines active 🌀",
    "📡 Signals received clearly 🎯"
];

// Quoted contact for replies
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

// Random selection helpers
const getRandomQuote = () => FANCY_QUOTES[Math.floor(Math.random() * FANCY_QUOTES.length)];
const getRandomStatus = () => BOT_STATUS_MESSAGES[Math.floor(Math.random() * BOT_STATUS_MESSAGES.length)];

// WhatsApp channel link
const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Alive command
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
▰▰▰▰▰▰▰▰▰▰▰▰▰
> *Hey 👋🏻* *${pushname}*
> 🕒 *Time*: *${currentTime}*
> 📅 *Date*: *${currentDate}*
> ⏳ *Uptime*: *${runtime.hours}h ${runtime.minutes}m ${runtime.seconds}s*
> *🤖 Status*: *${getRandomStatus()}*
> *${getRandomQuote()}*
▰▰▰▰▰▰▰▰▰▰▰▰▰
        `.trim();

        await conn.sendMessage(from, {
            video: { url: "https://files.catbox.moe/tmynfd.mp4" },
            gifPlayback: true,
            ptv: false,
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: '𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | Alive Status",
                    body: "Active • Healthy • Responsive",
                    thumbnailUrl: "https://files.catbox.moe/vn9ksi.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (error) {
        console.error("Error in alive command: ", error);
        return reply(
`❌ An error occurred while processing the *alive* command.
🛠 Error: ${error.message}`
        );
    }
});