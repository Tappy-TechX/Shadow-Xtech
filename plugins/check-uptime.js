const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const moment = require('moment-timezone'); // Make sure moment-timezone is installed

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

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, current date/time, random video/gif, and quotes.",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);

        // Nairobi Time
        const currentTime = moment().tz("Africa/Nairobi").toDate();
        const formatDateTime = (date) => moment(date).tz("Africa/Nairobi").format("dddd, MMMM Do YYYY, h:mm:ss A");

        const formattedCurrentTime = formatDateTime(currentTime);
        const formattedStartTime = formatDateTime(startTime);

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

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomQuote = getRandomElement(quotes);

        // 10 Styles
        const style1 = `╭───『 *UPTIME* 』───⳹
│
│ *⏱️ Running: ${uptime}*
│ *📆 Current: ${formattedCurrentTime}*
│ *🚀 Started: ${formattedStartTime}*
│
│ *${randomQuote}*
╰────────────────⳹
${config.DESCRIPTION}`;

        const style2 = `•——[ *UPTIME* ]——•
  │
  ├─ *⌛ Running: ${uptime}"
  ├─ *🕒 Current: ${formattedCurrentTime}*
  ├─ *🗓️ Since: ${formattedStartTime}*
  │
  ├─ *${randomQuote}*
  •——[ *${config.BOT_NAME}* ]——•`;

        const style3 = `▄▀▄▀▄ *BOT UPTIME* ▄▀▄▀▄

  *♢ Running: ${uptime}*
  *♢ Live: ${formattedCurrentTime}*
  *♢ Since: ${formattedStartTime}*
  
  *${randomQuote}*
  
  > *${config.DESCRIPTION}*`;

        const style4 = `┌──────────────────────┐
│  *⚡ UPTIME STATUS ⚡*  │
├──────────────────────┤
│ • *Time: ${uptime}*
│ • *Current: ${formattedCurrentTime}*
│ • *Started: ${formattedStartTime}*
│ • *Version: 4.0.0*
│ • *Status: ${randomQuote}*
└──────────────────────┘`;

        const style5 = `▰▰▰▰▰ *UPTIME* ▰▰▰▰▰

  *🟢 ${uptime}*
  *🗓️ ${formattedCurrentTime}*
  *⌛ ${formattedStartTime}*
    
  *${randomQuote}*
    
  > *${config.DESCRIPTION}*`;

        const style6 = `╔══════════════════════╗
║   *${config.BOT_NAME} UPTIME*    ║
╠══════════════════════╣
║ > *RUNTIME: ${uptime}*
║ > *CURRENT: ${formattedCurrentTime}*
║ > *SINCE: ${formattedStartTime}*
║ > *STATUS: ${randomQuote}*
╚══════════════════════╝`;

        const style7 = `┌───────────────┐
│  *⏱️  UPTIME*  │
└───────────────┘
│
│ *🟢 Runtime: ${uptime}*
│
│ *📅 Current: ${formattedCurrentTime}*
│ *⌛ Since ${formattedStartTime}*
│
│ *${randomQuote}*
│
┌───────────────┐
│  *${config.BOT_NAME}*  │
└───────────────┘`;

        const style8 = `⏱️ *Uptime Report* ⏱️

*🟢 Online for: ${uptime}*
*📅 Current Time: ${formattedCurrentTime}*
*📅 Since: ${formattedStartTime}*

_*${randomQuote}*_

> *${config.DESCRIPTION}*`;

        const style9 = `╔♫═⏱️═♫══════════╗
   *${config.BOT_NAME} UPTIME*
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ *Runtime: ${uptime}*
 ✧ *Live: ${formattedCurrentTime}*
 ✧ *Since: ${formattedStartTime}*
 ✧ *Status: ${randomQuote}*
•・゜゜・* ✧  *・゜゜・•`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  *UPTIME ANALYSIS*  ┃
┗━━━━━━━━━━━━━━━━━━┛

*◈ Duration: ${uptime}*
*◈ Current Time: ${formattedCurrentTime}*
*◈ Start Time: ${formattedStartTime}*
*◈ Stability: 100%*
*◈ Version:  4.0.0*
*◈ Insight: ${randomQuote}*

> *${config.DESCRIPTION}*`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const caption = getRandomElement(styles);

        // Replace with your WhatsApp channel link
        const whatsappChannelLink = "https://chat.whatsapp.com/YourChannelLinkHere";

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
                    title: "🟢 Shadow-Xtech | Uptime Status",
                    body: "Stable • Running • Healthy",
                    thumbnailUrl: "https://files.catbox.moe/kttohz.jpeg",
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