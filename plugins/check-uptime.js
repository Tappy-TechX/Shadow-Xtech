const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, current date/time, and quotes.",
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
    "🟢 Bot is running smooth",
    "⚡ System online and stable",
    "🚀 Bot uptime fully active",
    "💻 Server alive and kicking",
    "🔋 Power steady uptime confirmed",
    "🧠 Bot thinking and responding",
    "🌐 System stable no errors",
    "🔄 Running nonstop zero breaks",
    "🟣 Bot active all time",
    "⚙️ Engine running without limits",
    "🔥 Performance high uptime secured",
    "🟡 System alive stay connected",
    "📡 Signal strong bot online",
        ];

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomQuote = getRandomElement(quotes);

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

        const style1 = `╭───『 UPTIME 』───⳹
│
│ ⏱️ ${uptime}
│ 🕰️ Current: ${formattedCurrentTime}
│ 🚀 Started: ${formattedStartTime}
│
│ 💬 "${randomQuote}"
╰────────────────⳹
${config.DESCRIPTION}`;

        const style2 = `•——[ UPTIME ]——•
  │
  ├─ ⏳ ${uptime}
  ├─ 🕒 Current: ${formattedCurrentTime}
  ├─ 🗓️ Since: ${formattedStartTime}
  │
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
║   ${config.BOT_NAME} UPTIME    ║
╠══════════════════════╣
║ > RUNTIME: ${uptime}
║ > CURRENT: ${formattedCurrentTime}
║ > SINCE: ${formattedStartTime}
║ > QUOTE: "${randomQuote}"
╚══════════════════════╝`;

        const style7 = `┌───────────────┐
│  ⏱️  UPTIME  │
└───────────────┘
│
│ ${uptime}
│
│ Current: ${formattedCurrentTime}
│ Since ${formattedStartTime}
│
│ 💬 "${randomQuote}"
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`;

        const style8 = `⏱️ *Uptime Report* ⏱️

🟢 Online for: ${uptime}
📅 Current Time: ${formattedCurrentTime}
📅 Since: ${formattedStartTime}

💬 _"${randomQuote}"_

${config.DESCRIPTION}`;

        const style9 = `╔♫═⏱️═♫══════════╗
   ${config.BOT_NAME} UPTIME
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ ${uptime}
 ✧ Live: ${formattedCurrentTime}
 ✧ Since ${formattedStartTime}
 ✧ "${randomQuote}"
•・゜゜・* ✧  *・゜゜・•`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  UPTIME ANALYSIS  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ Duration: ${uptime}
◈ Current Time: ${formattedCurrentTime}
◈ Start Time: ${formattedStartTime}
◈ Stability: 100%
◈ Version:  4.0.0
◈ Insight: "${randomQuote}"

${config.DESCRIPTION}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = getRandomElement(styles);

        await conn.sendMessage(from, { 
            text: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.OWNER_NAME || '𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇ𝐜𝐡',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});