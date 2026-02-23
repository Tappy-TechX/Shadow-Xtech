const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

const UPTIME_VIDEO = "https://files.catbox.moe/eubadj.mp4";
const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

// Quoted contact reference
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Uptime | Status 🟢",
            vcard:
                "BEGIN:VCARD\n" +
                "VERSION:3.0\n" +
                "FN:SCIFI\n" +
                "ORG:Shadow-Xtech BOT;\n" +
                "TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\n" +
                "END:VCARD"
        }
    }
};

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, current date/time, and uptime quotes.",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        const currentTime = new Date();

        const quotes = [
            "System check complete — bot uptime stable. 🟢",
            "Uptime verified — running without interruptions. ⚡",
            "Monitoring systems — all services operational. 🛰",
            "Power core steady — no downtime detected. 🔋",
            "Runtime confirmed — bot performing optimally. 🚀",
            "AI engine active — uptime within safe limits. 🧠",
            "Signal strong — uptime holding firm. 📡",
            "Diagnostic result — system fully online. ⚙️",
            "Connectivity intact — bot responding smoothly. 🌐",
            "Maintenance log — zero crashes recorded. 🛠"
        ];

        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomQuote = getRandom(quotes);

        const formatDateTime = (date) => {
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
        };

        const formattedCurrentTime = formatDateTime(currentTime);
        const formattedStartTime = formatDateTime(startTime);

        // ===== ALL STYLES =====

        const style1 = `╭───『 UPTIME 』───⳹
│ ⏱️ ${uptime}
│ 🕰️ Current: ${formattedCurrentTime}
│ 🚀 Started: ${formattedStartTime}
│ 💬 "${randomQuote}"
╰────────────────⳹
${config.DESCRIPTION}`;

        const style2 = `•——[ UPTIME ]——•
├─ ⏳ ${uptime}
├─ 🕒 Current: ${formattedCurrentTime}
├─ 🗓️ Since: ${formattedStartTime}
├─ 💬 "${randomQuote}"
•——[ ${config.BOT_NAME} ]——•`;

        const style3 = `▄▀▄▀▄ BOT UPTIME ▄▀▄▀▄
♢ Running: ${uptime}
♢ Live: ${formattedCurrentTime}
♢ Since: ${formattedStartTime}
💬 "${randomQuote}"
${config.DESCRIPTION}`;

        const style4 = `┌──────────────────────┐
│  ⚡ UPTIME STATUS ⚡  │
├──────────────────────┤
│ • Time: ${uptime}
│ • Current: ${formattedCurrentTime}
│ • Started: ${formattedStartTime}
│ • Version: 4.0.0
│ • Quote: "${randomQuote}"
└──────────────────────┘`;

        const style5 = `▰▰▰▰▰ UPTIME ▰▰▰▰▰
⏳ ${uptime}
🗓️ ${formattedCurrentTime}
🕰️ ${formattedStartTime}
💬 "${randomQuote}"
${config.DESCRIPTION}`;

        const style6 = `╔══════════════════════╗
║ ${config.BOT_NAME} UPTIME ║
╠══════════════════════╣
║ > RUNTIME: ${uptime}
║ > CURRENT: ${formattedCurrentTime}
║ > SINCE: ${formattedStartTime}
║ > QUOTE: "${randomQuote}"
╚══════════════════════╝`;

        const style7 = `┌───────────────┐
│ ⏱️ UPTIME │
└───────────────┘
${uptime}
Current: ${formattedCurrentTime}
Since: ${formattedStartTime}
💬 "${randomQuote}"
${config.BOT_NAME}`;

        const style8 = `⏱️ *Uptime Report*
🟢 Online for: ${uptime}
📅 Current: ${formattedCurrentTime}
📅 Since: ${formattedStartTime}
💬 _"${randomQuote}"_
${config.DESCRIPTION}`;

        const style9 = `╔♫═⏱️═♫══════════╗
${config.BOT_NAME} UPTIME
╚♫═⏱️═♫══════════╝
✧ ${uptime}
✧ Live: ${formattedCurrentTime}
✧ Since: ${formattedStartTime}
✧ "${randomQuote}"`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃ UPTIME ANALYSIS ┃
┗━━━━━━━━━━━━━━━━━━┛
◈ Duration: ${uptime}
◈ Current: ${formattedCurrentTime}
◈ Started: ${formattedStartTime}
◈ Stability: 100%
◈ Insight: "${randomQuote}"
${config.DESCRIPTION}`;

        const styles = [
            style1, style2, style3, style4, style5,
            style6, style7, style8, style9, style10
        ];

        const caption = getRandom(styles);

        await conn.sendMessage(
            from,
            {
                video: { url: UPTIME_VIDEO },
                gifPlayback: true,
                caption,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363369453603973@newsletter",
                        newsletterName: config.OWNER_NAME || "Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "⚙️ SHADOW-XTECH UPTIME STATUS",
                        body: "Bot is live and operational — stay connected!",
                        thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                        sourceUrl: whatsappChannelLink,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            },
            { quoted: quotedContact }
        );

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});