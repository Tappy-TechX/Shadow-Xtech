const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Alive | Status 🟢",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
        }
    }
};

// Track last used style index for sequential rotation
let lastStyleIndex = -1;

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with sequential style rotation, memory, heap, disk usage, random quote, and date/time.",
    category: "main",
    react: "⏱️",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // Uptime
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        const currentTime = new Date();

        // Memory & heap
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2); // MB
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(2); // MB
        const usedHeap = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // MB
        const totalHeap = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2); // MB

        // Disk usage
        const disk = await checkDiskSpace('/');
        const diskTotal = (disk.size / 1024 / 1024 / 1024).toFixed(2); // GB
        const diskFree = (disk.free / 1024 / 1024 / 1024).toFixed(2); // GB
        const diskUsed = (diskTotal - diskFree).toFixed(2); // GB

        // Random quote
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

        const formatDateTime = (date) => date.toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
        });
        const formattedCurrentTime = formatDateTime(currentTime);
        const formattedStartTime = formatDateTime(startTime);

        // All text-only styles
        const styles = [
            `╭───『 *UPTIME* 』───⳹
│
│ *⏱️ Uptime: ${uptime}*
│ *🕰️ Current: ${formattedCurrentTime}*
│ *🚀 Started: ${formattedStartTime}*
│ *🖥️ Free Mem: ${freeMem}MB / ${totalMem}MB*
│ *📦 Heap: ${usedHeap}MB / ${totalHeap}MB*
│ *💾 Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
│ *${randomQuote}*
╰────────────────⳹
> ${config.DESCRIPTION}`,

            `•——[ *UPTIME* ]——•
├─ *⏳ ${uptime}*
├─ *🕒 Current: ${formattedCurrentTime}*
├─ *🗓️ Since: ${formattedStartTime}*
├─ *🖥️ Free Mem: ${freeMem}MB / ${totalMem}MB*
├─ *🗄️ Heap: ${usedHeap}MB / ${totalHeap}MB*
├─ *💾 Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
├─ *${randomQuote}*
•——[ *${config.BOT_NAME}* ]——•`,

            `▄▀▄▀▄ *BOT UPTIME* ▄▀▄▀▄
♢ *Running: ${uptime}*
♢ *Live: ${formattedCurrentTime}*
♢ *Since: ${formattedStartTime}*
♢ *Free Mem: ${freeMem}MB / ${totalMem}MB*
♢ *Heap: ${usedHeap}MB / ${totalHeap}MB*
♢ *Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
♢ *${randomQuote}*
♢ *${config.DESCRIPTION}*`,

            `┌──────────────────────┐
│  ⚡ *UPTIME STATUS* ⚡  │
├──────────────────────┤
│ • *Time: ${uptime}*
│ • *Current: ${formattedCurrentTime}*
│ • *Started: ${formattedStartTime}*
│ • *Free Mem: ${freeMem}MB / ${totalMem}MB*
│ • *Heap: ${usedHeap}MB / ${totalHeap}MB*
│ • *Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
│ • *Version: 4.0.0*
│ • *${randomQuote}*
└──────────────────────┘`,

            `▰▰▰▰▰ *UPTIME* ▰▰▰▰▰
⏳ *Runtime: ${uptime}*
🗓️ *Live: ${formattedCurrentTime}*
🕰️ *Since: ${formattedStartTime}*
🖥️ *Free Mem: ${freeMem}MB / ${totalMem}MB*
🗄️ *Heap: ${usedHeap}MB / ${totalHeap}MB*
💾 *Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
*${randomQuote}*
> *${config.DESCRIPTION}*`,

            `╭─────────────────╮
│ 🟢 *UPTIME STATUS* 🟢
├─────────────────┤
│ ⏱ *Uptime : ${uptime}*
│ 🕒 *Current : ${formattedCurrentTime}*
│ 🚀 *Started : ${formattedStartTime}*
│ 💻 *Free Mem : ${freeMem}MB / ${totalMem}MB*
│ 📦 *Heap : ${usedHeap}MB / ${totalHeap}MB*
│ 💾 *Disk : ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
│ *${randomQuote}*
╰─────────────────╯`,

            `┌───────────────┐
│  *⏱️  UPTIME*  │
└───────────────┘
│
│ *🟢 Runtime: ${uptime}*
│ *⏱️ Current: ${formattedCurrentTime}*
│ *⏳ Since ${formattedStartTime}*
│ *🖥️ Free Mem: ${freeMem}MB / ${totalMem}MB*
│ *📦 Heap: ${usedHeap}MB / ${totalHeap}MB*
│ *💾 Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
│ *${randomQuote}*
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`,

            `⏱️ *Uptime Report* ⏱️
🟢 *Online for: ${uptime}*
📅 *Current Time: ${formattedCurrentTime}*
📅 *Since: ${formattedStartTime}*
🖥️ *Free Mem: ${freeMem}MB / ${totalMem}MB*
🗄️ *Heap: ${usedHeap}MB / ${totalHeap}MB*
💾 *Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
*${randomQuote}*
*${config.DESCRIPTION}*`,

            `╔♫═⏱️═♫══════════╗
    *UPTIME ANALYSIS*
╚♫═⏱️═♫══════════╝
•・゜゜・* ✧  ・゜゜・•
✧ *⏳ Runtime: ${uptime}*
✧ *🟢 Live: ${formattedCurrentTime}*
✧ *⏱️ Since ${formattedStartTime}*
✧ *🖥️ Free Mem: ${freeMem}MB / ${totalMem}MB*
✧ *🗄️ Heap: ${usedHeap}MB / ${totalHeap}MB*
✧ *💾 Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
✧ *${randomQuote}*
•・゜゜・ ✧  *・゜゜・•`,

            `┏━━━━━━━━━━━━━━━━━━┓
┃  UPTIME ANALYSIS  ┃
┗━━━━━━━━━━━━━━━━━━┛
◈ *Duration: ${uptime}*
◈ *Current Time: ${formattedCurrentTime}*
◈ *Start Time: ${formattedStartTime}*
◈ *Free Mem: ${freeMem}MB / ${totalMem}MB*
◈ *Heap: ${usedHeap}MB / ${totalHeap}MB*
◈ *Disk: ${diskUsed}GB / ${diskTotal}GB free ${diskFree}GB*
◈ *Stability: 100%*
◈ *Version:  4.0.0*
◈ *${randomQuote}*
◈ *${config.DESCRIPTION}*`
        ];

        // Sequential rotation: next style index
        lastStyleIndex = (lastStyleIndex + 1) % styles.length;
        const messageText = styles[lastStyleIndex];

        // Send text-only message
        await conn.sendMessage(from, {
            text: messageText,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | Uptime Status",
                    body: "Stable • Running • Healthy",
                    thumbnailUrl: "https://files.catbox.moe/ycn8mx.jpg",
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