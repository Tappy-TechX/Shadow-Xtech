const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, current date/time, random images, and quotes.",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        const currentTime = new Date();

        const imageUrls = [
            "https://files.catbox.moe/etqc8k.jpg",
            "https://files.catbox.moe/odst1m.jpg", // Replace with actual image URLs
            "https://files.catbox.moe/95n1x6.jpg", // Replace with actual image URLs
            "https://files.catbox.moe/0w7hqx.jpg", // Replace with actual image URLs
            "https://files.catbox.moe/og4tsk.jpg"  // Replace with actual image URLs
        ];

        const quotes = [
            "🪀The best way to predict the future is to create it🎀.",
            "🎁Stay hungry, stay foolish🍁.",
            "🌅Innovation distinguishes between a leader and a follower🌐.",
            "⚜️The only way to do great work is to love what you do📶.",
            "✨Life is what happens when you're busy making other plans.✨"
        ];

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomImageUrl = getRandomElement(imageUrls);
        const randomQuote = getRandomElement(quotes);

        // Function to format date and time nicely
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

        // Style 1: Classic Box
        const style1 = `╭───『 UPTIME 』───⳹
│
│ ⏱️ ${uptime}
│ 🕰️ Current: ${formattedCurrentTime}
│ 🚀 Started: ${formattedStartTime}
│
│ 💬 "${randomQuote}"
╰────────────────⳹
${config.DESCRIPTION}`;

        // Style 2: Minimalist
        const style2 = `•——[ UPTIME ]——•
  │
  ├─ ⏳ ${uptime}
  ├─ 🕒 Current: ${formattedCurrentTime}
  ├─ 🗓️ Since: ${formattedStartTime}
  │
  ├─ 💬 "${randomQuote}"
  •——[ ${config.BOT_NAME} ]——•`;

        // Style 3: Fancy Borders
        const style3 = `▄▀▄▀▄ BOT UPTIME ▄▀▄▀▄

  ♢ Running: ${uptime}
  ♢ Live: ${formattedCurrentTime}
  ♢ Since: ${formattedStartTime}
  
  💬 "${randomQuote}"
  
  ${config.DESCRIPTION}`;

        // Style 4: Code Style
        const style4 = `┌──────────────────────┐
│  ⚡ UPTIME STATUS ⚡  │
├──────────────────────┤
│ • Time: ${uptime}
│ • Current: ${formattedCurrentTime}
│ • Started: ${formattedStartTime}
│ • Version: 4.0.0
│ • Quote: "${randomQuote}"
└──────────────────────┘`;

        // Style 5: Modern Blocks
        const style5 = `▰▰▰▰▰ UPTIME ▰▰▰▰▰

  ⏳ ${uptime}
  🗓️ ${formattedCurrentTime}
  🕰️ ${formattedStartTime}
  
  💬 "${randomQuote}"
  
  ${config.DESCRIPTION}`;

        // Style 6: Retro Terminal
        const style6 = `╔══════════════════════╗
║   ${config.BOT_NAME} UPTIME    ║
╠══════════════════════╣
║ > RUNTIME: ${uptime}
║ > CURRENT: ${formattedCurrentTime}
║ > SINCE: ${formattedStartTime}
║ > QUOTE: "${randomQuote}"
╚══════════════════════╝`;

        // Style 7: Elegant
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

        // Style 8: Social Media Style
        const style8 = `⏱️ *Uptime Report* ⏱️

🟢 Online for: ${uptime}
📅 Current Time: ${formattedCurrentTime}
📅 Since: ${formattedStartTime}

💬 _"${randomQuote}"_

${config.DESCRIPTION}`;

        // Style 9: Fancy List
        const style9 = `╔♫═⏱️═♫══════════╗
   ${config.BOT_NAME} UPTIME
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ ${uptime}
 ✧ Live: ${formattedCurrentTime}
 ✧ Since ${formattedStartTime}
 ✧ "${randomQuote}"
•・゜゜・* ✧  *・゜゜・•`;

        // Style 10: Professional
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
            image: { url: randomImageUrl },
            caption: selectedStyle,
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
