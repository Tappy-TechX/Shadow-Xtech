const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

// Quoted contact for replies
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Uptime | Status 🟢",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
        }
    }
};

// WhatsApp channel link for external ad
const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, current date/time, random video, and quotes.",
    category: "main",
    react: "⏱️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        const currentTime = new Date();

        // Bot status quotes
        const quotes = [
            "⚡ Bot uptime fully stable ✅",
            "🛰️ All systems online 🌐",
            "🤖 AI core running smoothly 🔄",
            "🔋 Power levels holding strong ⚡",
            "🚀 Processes active, bot alive 🛠️",
            "🟢 Status check: all clear ✔️",
            "🌌 Modules synced, responding fast 🌟",
            "📡 Bot heartbeat steady, operational 🎯"
        ];

        // Uptime emojis for randomization
        const uptimeEmojis = ["⏱️", "🕰️", "⏳", "⚡", "🚀"];

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomEmoji = getRandomElement(uptimeEmojis);
        const randomQuote = getRandomElement(quotes);

        // Format date/time nicely
        const formatDateTime = (date) => date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        const formattedCurrentTime = formatDateTime(currentTime);
        const formattedStartTime = formatDateTime(startTime);

        // --- 10 styles ---
        const style1 = `╭───『 *UPTIME* 』───⳹
│
│ *${randomEmoji} ${uptime}*
│ *🕰️ Current: ${formattedCurrentTime}*
│ *🚀 Started: ${formattedStartTime}*
│
│ *${randomQuote}*
╰────────────────⳹
${config.DESCRIPTION}`;

        const style2 = `•——[ *UPTIME* ]——•
│
├─ *${randomEmoji} ${uptime}*
├─ *🕒 Current: ${formattedCurrentTime}*
├─ *🗓️ Since: ${formattedStartTime}*
│
├─ *${randomQuote}*
•——[ *${config.BOT_NAME}* ]——•`;

        const style3 = `▄▀▄▀▄ *BOT UPTIME* ▄▀▄▀▄

♢ *Running: ${randomEmoji} ${uptime}*
♢ *Live: ${formattedCurrentTime}*
♢ Since: *${formattedStartTime}*

♢ *${randomQuote}*

> *${config.DESCRIPTION}*`;

        const style4 = `┌──────────────────────┐
│  ⚡ *UPTIME STATUS* ⚡  │
├──────────────────────┤
│ • *${randomEmoji} Time: ${uptime}*
│ • *${randomEmoji} Current: ${formattedCurrentTime}*
│ • *${randomEmoji} Started: ${formattedStartTime}*
│ • *${randomEmoji} Version: 4.0.0*
│ • *${randomQuote}*
└──────────────────────┘`;

        const style5 = `▰▰▰▰▰ *UPTIME* ▰▰▰▰▰

*${randomEmoji} ${uptime}*
*🗓️ ${formattedCurrentTime}*
*🕰️ ${formattedStartTime}*

*${randomQuote}*

> *${config.DESCRIPTION}*`;

        const style6 = `╔══════════════════════╗
║   *${config.BOT_NAME} UPTIME*    ║
╠══════════════════════╣
║ > *RUNTIME: ${uptime}*
║ > *CURRENT: ${formattedCurrentTime}*
║ > *SINCE: ${formattedStartTime}*
║ > *QUOTE: ${randomQuote}*
╚══════════════════════╝`;

        const style7 = `┌───────────────┐
│  *${randomEmoji}  UPTIME*  │
└───────────────┘
│
│ *${randomEmoji} ${uptime}*
│
│ *${randomEmoji} Current: ${formattedCurrentTime}*
│ *${randomEmoji} Since ${formattedStartTime}*
│
│ *${randomQuote}*
│
┌───────────────┐
│  *${config.BOT_NAME}*  │
└───────────────┘`;

        const style8 = `${randomEmoji} *Uptime Report* ${randomEmoji}

*🟢 Online for: ${randomEmoji} ${uptime}*
*📅 Current Time: ${formattedCurrentTime}*
*⏳ Since: ${formattedStartTime}*

*${randomQuote}*

> *${config.DESCRIPTION}*`;

        const style9 = `╔♫═${randomEmoji}═♫══════════╗
*${config.BOT_NAME} UPTIME*
╚♫═${randomEmoji}═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
✧ ${uptime}
✧ Live: ${formattedCurrentTime}
✧ Since ${formattedStartTime}
✧ *${randomQuote}*
•・゜゜・* ✧  *・゜゜・•`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  *${randomEmoji} UPTIME ANALYSIS*  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ *Duration: ${randomEmoji} ${uptime}*
◈ *Current Time: ${formattedCurrentTime}*
◈ *Start Time: ${formattedStartTime}*
◈ *Stability: 100%*
◈ *Version:  4.0.0*
◈ *${randomQuote}*

> *${config.DESCRIPTION}*`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const caption = getRandomElement(styles);

        // Send video as muted loop with external ad reply
        await conn.sendMessage(from, {
            video: { url: "https://files.catbox.moe/eubadj.mp4" },
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
                    title: "⚙️ Shadow-Xtech | Uptime Status",
                    body: "Stable • Running • Healthy",
                    thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});