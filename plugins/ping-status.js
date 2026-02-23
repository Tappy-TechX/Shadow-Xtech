const config = require('../config');
const { cmd, commands } = require('../command');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Contact used for quoting the reply
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Latency | Check 🚀",
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
  pattern: "ping",
  alias: ["speed", "pong"],
  use: '.ping',
  desc: "Check bot's response time, load, and stability.",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
  try {
    const start = Date.now();

    // 8 loading messages
    const loadingMessages = [
      "*⎾⟪ ⚡ Initializing diagnostic scan... ⟫⏌*",
      "*⎾⟪ 🚀 Engaging latency protocol... ⟫⏌*",
      "*⎾⟪ 📊 Probing system integrity... ⟫⏌*",
      "*⎾⟪ ⚙️ Optimizing digital threads... ⟫⏌*",
      "*⎾⟪ 🧠 Booting quantum core... ⟫⏌*",
      "*⎾⟪ 💡 Gathering neural response... ⟫⏌*",
      "*⎾⟪ 📡 Syncing data flux... ⟫⏌*",
      "*⎾⟪ ✨ Running chrono-lag check... ⟫⏌*"
    ];

    // 9 speed quotes
    const speedLatencyQuotes = [
      "“⚡ Checking ping across all nodes...”",
      "“⏱️ Measuring milliseconds for precision...”",
      "“📶 Network pulse detected — calculating...”",
      "“🚀 Testing bot reflex time...”",
      "“🔧 Ping diagnostics in progress...”",
      "“🛰️ Latency signals are being analyzed...”",
      "“💡 Response time calibration underway...”",
      "“🎯 Real-time ping measurement active...”",
      "“🛠️ Bot heartbeat — ping confirmed stable...”"
    ];

    const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];
    const stableEmojis = ['🟢', '✅', '🧠', '📶', '🛰️'];
    const moderateEmojis = ['🟡', '🌀', '⚠️', '🔁', '📡'];
    const slowEmojis = ['🔴', '🐌', '❗', '🚨', '💤'];

    const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const randomQuote = speedLatencyQuotes[Math.floor(Math.random() * speedLatencyQuotes.length)];

    // Send first loading message
    await conn.sendMessage(from, { text: randomLoadingMessage });

    const end = Date.now();
    const latencyMs = end - start;

    let stabilityEmoji = '';
    let stabilityText = '';

    if (latencyMs > 1000) {
      stabilityText = "Slow 🔴";
      stabilityEmoji = slowEmojis[Math.floor(Math.random() * slowEmojis.length)];
    } else if (latencyMs > 500) {
      stabilityText = "Moderate 🟡";
      stabilityEmoji = moderateEmojis[Math.floor(Math.random() * moderateEmojis.length)];
    } else {
      stabilityText = "Stable 🟢";
      stabilityEmoji = stableEmojis[Math.floor(Math.random() * stableEmojis.length)];
    }

    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;

    // Date, time, runtime
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toLocaleDateString();

    // Calculate runtime
    const uptime = process.uptime(); // seconds
    const runtime = {
      hours: Math.floor(uptime / 3600),
      minutes: Math.floor((uptime % 3600) / 60),
      seconds: Math.floor(uptime % 60)
    };

    // Final stylish report
    const stylishText = `
*📡 SYSTEM DIAGNOSTICS REPORT*
▰▰▰▰▰▰▰▰▰▰▰▰▰
💻 Bot ID  ◉» *${config.botname || "SHADOW-XTECH"}*
⏱ Clock    : ${currentTime} 
📆 Log      : ${currentDate}
🔄 Runtime  : ${runtime.hours}h/${runtime.minutes}m/${runtime.seconds}s
▰▰▰▰▰▰▰▰▰▰▰▰▰
📶 Latency        : ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${latencyMs} ms ⚡
🧬 Memory Load    : ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} *${memoryUsageMB.toFixed(2)} MB*
📊 Stability      » ${stabilityEmoji} *${stabilityText}*
⌛ Time Sync      » *${currentTime}*
━━━━━━━━━━━━━━━━━━━
*${randomQuote}*
━━━━━━━━━━━━━━━━━━━
`.trim();

    // Send final report
    await conn.sendMessage(from, {
      text: stylishText,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | System Pulse",
          body: "Speed • Stability • Sync",
          thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false,
        }
      }
    }, { quoted: quotedContact });

  } catch (e) {
    console.error("Error in ping command:", e);
    reply(`An error occurred: ${e.message}`);
  }
});