const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const os = require('os');

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 

// Quoted contact 
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Uptime | Check 🚀",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
        }
    }
};

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats, CPU%, RAM/heap usage, current date/time, quotes, and ads.",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        const currentTime = new Date();

        // Memory usage
        const memoryUsage = process.memoryUsage();
        const formatBytes = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
        const ramUsage = formatBytes(memoryUsage.rss);
        const heapUsed = formatBytes(memoryUsage.heapUsed);
        const heapTotal = formatBytes(memoryUsage.heapTotal);

        // CPU info
        const cpuInfo = os.cpus();
        const cpuCount = cpuInfo.length;

        // Calculate CPU %
        const getCPUPercent = () => {
            const startMeasure = process.cpuUsage();
            return new Promise((resolve) => {
                setTimeout(() => {
                    const endMeasure = process.cpuUsage(startMeasure);
                    const elapTime = 1000; // 1 second
                    const cpuPercent = ((endMeasure.user + endMeasure.system) / 1000 / elapTime) * 100;
                    resolve(cpuPercent.toFixed(2));
                }, 1000);
            });
        };
        const cpuPercent = await getCPUPercent();

        // Quotes
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

        // Format dates
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

        // All 10 styles
        const style1 = `╭───『 UPTIME 』───⳹
│
│ *⏱️ Activity Span: ${uptime}*
│ *⏳ Live Time: ${formattedCurrentTime}*
│ *🚀 Live From: ${formattedStartTime}*
│ *💾 RAM: ${ramUsage}*
│ *📦 Heap: ${heapUsed}/${heapTotal}*
│ *🖥️ CPU: ${cpuPercent}% | ${cpuCount} cores*
│ *${randomQuote}*
╰────────────────⳹
> ${config.DESCRIPTION}`;

        const style2 = `•——[ *UPTIME* ]——•
  ├─ *⏳ Active Time: ${uptime}*
  ├─ *🕒 Real-Time: ${formattedCurrentTime}*
  ├─ *🗓️ Started At: ${formattedStartTime}*
  ├─ *💾 RAM: ${ramUsage}*
  ├─ *📦 Heap: ${heapUsed}/${heapTotal}*
  ├─ *🖥️ CPU: ${cpuPercent}% | ${cpuCount} cores*
  ├─ *${randomQuote}*
  •——[ *${config.BOT_NAME}* ]——•`;

        const style3 = `*▄▀▄▀▄ BOT UPTIME ▄▀▄▀▄*

♢ *Active Time: ${uptime}*
♢ *Running: ${formattedCurrentTime}*
♢ *Started At: ${formattedStartTime}*
♢ *RAM Usage: ${ramUsage}*
♢ *Heap: ${heapUsed}/${heapTotal}*
♢ *CPU: ${cpuPercent}% | ${cpuCount} cores*
♢ *${randomQuote}*

> ♢ *${config.DESCRIPTION}*`;

        const style4 = `┌───────────────────┐
│  *⚡ UPTIME STATUS ⚡*  │
├───────────────────┤
│ • *Runtime: ${uptime}*
│ • *Timestamp: ${formattedCurrentTime}*
│ • *Start Time: ${formattedStartTime}*
│ • *RAM: ${ramUsage}*
│ • *Heap: ${heapUsed}/${heapTotal}*
│ • *CPU: ${cpuPercent}% | ${cpuCount} cores*
│ • *Version: 4.0.0*
│ • *${randomQuote}*
└───────────────────┘`;

        const style5 = `*▰▰▰▰▰ UPTIME ▰▰▰▰▰*

*⏳ Server Status: ${uptime}*
*🗓️ System Clock: ${formattedCurrentTime}*
*🕜 Active Since: ${formattedStartTime}*
*💾 RAM: ${ramUsage}*
*📦 Heap: ${heapUsed}/${heapTotal}*
*🖥️ CPU: ${cpuPercent}% | ${cpuCount} cores*
*${randomQuote}*

> *${config.DESCRIPTION}*`;

        const style6 = `═•──────────────•═
🌟 SHADOW-XECH UPTIME 🌟
═•──────────────•═

⏳ Duration : ${uptime}
📅 System Clock  : ${formattedCurrentTime}
🚀 Initiated At : ${formattedStartTime}
💾 Memory  : ${ramUsage} 
📦 Heap: ${heapUsed}/${heapTotal}
🖥 CPU     : ${cpuPercent}% | ${cpuCount} cores
💡 Quote   : "${randomQuote}"
═•──────────────•═`;

        const style7 = `┌───────────────┐
│  ⏱️  UPTIME  │
└───────────────┘
│
│ *Running For: ${uptime}*
│ *System Clock: ${formattedCurrentTime}*
│ *Since: ${formattedStartTime}*
│ *RAM: ${ramUsage}*  
│ *CPU: ${cpuPercent}% | ${cpuCount} cores*
│
│ *${randomQuote}*
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`;

        const style8 = `⏱️ *Uptime Report* ⏱️

*🟢 Live Duration: ${uptime}*
*📅 System Clock: ${formattedCurrentTime}*
*📅 Started At: ${formattedStartTime}*
*💾 RAM: ${ramUsage}*
*📦 Heap: ${heapUsed}/${heapTotal}*
*🖥️ CPU: ${cpuPercent}% | ${cpuCount} cores*

_*${randomQuote}*_

> *${config.DESCRIPTION}*`;

        const style9 = `╔♫═⏱️═♫══════════╗
   ${config.bot_name} UPTIME
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ *Running For: ${uptime}*
 ✧ *System Clock: ${formattedCurrentTime}*
 ✧ *Since ${formattedStartTime}*
 ✧ *RAM: ${ramUsage}*
 ✧ *Heap: ${heapUsed}/${heapTotal}*
 ✧ *CPU: ${cpuPercent}% | ${cpuCount} cores*
 ✧ *${randomQuote}*
•・゜゜・* ✧  *・゜゜・•`;

        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  UPTIME ANALYSIS  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ *Duration: ${uptime}*
◈ *Current Time: ${formattedCurrentTime}*
◈ *Start Time: ${formattedStartTime}*
◈ *RAM: ${ramUsage}*
◈ *Heap: ${heapUsed}/${heapTotal}*
◈ *CPU: ${cpuPercent}% | ${cpuCount} cores*
◈ *Stability: 100%*
◈ *Version:  4.0.0*
◈ *${randomQuote}*

◈ ${config.DESCRIPTION}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = getRandomElement(styles);

        // Send final message with external ad + newsletter
        await conn.sendMessage(from, {
            text: selectedStyle,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | Uptime Pulse",
                    body: "Speed • Stability • Sync",
                    thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
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