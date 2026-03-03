const { cmd } = require('../command');  
const { runtime } = require('../lib/functions');  
const config = require('../config');  

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
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"  
        }  
    }  
};  

// Track last used style to prevent repetition
let lastStyleIndex = -1;

cmd({  
    pattern: "uptime",  
    alias: ["runtime", "up"],  
    desc: "Show bot uptime with stylish formats, current date/time, random quotes, and looping video GIF.",  
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

        const styles = [
            `╭───『 UPTIME 』───⳹
│
│ ⏱️ ${uptime}
│ 🕰️ Current: ${formattedCurrentTime}
│ 🚀 Started: ${formattedStartTime}
│
│ 💬 "${randomQuote}"
╰────────────────⳹
${config.DESCRIPTION}`,

            `•——[ UPTIME ]——•
│
├─ ⏳ ${uptime}
├─ 🕒 Current: ${formattedCurrentTime}
├─ 🗓️ Since: ${formattedStartTime}
│
├─ 💬 "${randomQuote}"
•——[ ${config.BOT_NAME} ]——•`,

            `▄▀▄▀▄ BOT UPTIME ▄▀▄▀▄
♢ Running: ${uptime}
♢ Live: ${formattedCurrentTime}
♢ Since: ${formattedStartTime}
💬 "${randomQuote}"
${config.DESCRIPTION}`,

            `┌──────────────────────┐
│  ⚡ UPTIME STATUS ⚡  │
├──────────────────────┤
│ • Time: ${uptime}
│ • Current: ${formattedCurrentTime}
│ • Started: ${formattedStartTime}
│ • Version: 4.0.0
│ • Quote: "${randomQuote}"
└──────────────────────┘`,

            `▰▰▰▰▰ UPTIME ▰▰▰▰▰
⏳ ${uptime}
🗓️ ${formattedCurrentTime}
🕰️ ${formattedStartTime}
💬 "${randomQuote}"
${config.DESCRIPTION}`,

            `╔══════════════════════╗
║   ${config.BOT_NAME} UPTIME    ║
╠══════════════════════╣
║ > RUNTIME: ${uptime}
║ > CURRENT: ${formattedCurrentTime}
║ > SINCE: ${formattedStartTime}
║ > QUOTE: "${randomQuote}"
╚══════════════════════╝`,

            `┌───────────────┐
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
└───────────────┘`,

            `⏱️ *Uptime Report* ⏱️
🟢 Online for: ${uptime}
📅 Current Time: ${formattedCurrentTime}
📅 Since: ${formattedStartTime}
💬 "${randomQuote}"
${config.DESCRIPTION}`,

            `╔♫═⏱️═♫══════════╗
${config.BOT_NAME} UPTIME
╚♫═⏱️═♫══════════╝
•・゜゜・* ✧  ・゜゜・•
✧ ${uptime}
✧ Live: ${formattedCurrentTime}
✧ Since ${formattedStartTime}
✧ "${randomQuote}"
•・゜゜・ ✧  *・゜゜・•`,

            `┏━━━━━━━━━━━━━━━━━━┓
┃  UPTIME ANALYSIS  ┃
┗━━━━━━━━━━━━━━━━━━┛
◈ Duration: ${uptime}
◈ Current Time: ${formattedCurrentTime}
◈ Start Time: ${formattedStartTime}
◈ Stability: 100%
◈ Version:  4.0.0
◈ Insight: "${randomQuote}"
${config.DESCRIPTION}`
        ];

        // Random style without repeating the last one
        let styleIndex;
        do {
            styleIndex = Math.floor(Math.random() * styles.length);
        } while (styleIndex === lastStyleIndex);
        lastStyleIndex = styleIndex;
        const caption = styles[styleIndex];  

        // Send video as muted looping GIF
        await conn.sendMessage(from, {  
            video: { url: "https://files.catbox.moe/tmynfd.mp4" },  
            gifPlayback: true,  
            muted: true,       // 🔇 mute
            loop: true,        // 🔁 loop
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
                    thumbnailUrl: "https://files.catbox.moe/vn9ksi.jpg",  
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