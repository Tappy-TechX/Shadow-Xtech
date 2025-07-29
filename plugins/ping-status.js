const config = require('../config');
const { cmd, commands } = require('../command');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

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

        const speedLatencyQuotes = [
            "“🔋 *Speed defines intelligence.*”",
            "“🛰️ *Latency is the language of performance.*”",
            "“👾 *Bots that blink are bots that win.*”",
            "“💡 *Digital flow never waits.*”",
            "“⏱️ *Milliseconds matter in the matrix.*”",
            "“⚡ *Optimized to outrun time.*”",
            "“🔧 *You ping, I race.*”",
            "“🛠️ *Diagnostics complete — all systems nominal.*”",
            "“🎯 *Real-time. Right now.*”"
        ];

        const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];
        const stableEmojis = ['🟢', '✅', '🧠', '📶', '🛰️'];
        const moderateEmojis = ['🟡', '🌀', '⚠️', '🔁', '📡'];
        const slowEmojis = ['🔴', '🐌', '❗', '🚨', '💤'];

        const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        const randomQuote = speedLatencyQuotes[Math.floor(Math.random() * speedLatencyQuotes.length)];

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

        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(sender, 'image');
        } catch {
            profilePicUrl = 'https://i.ibb.co/gdpjw5w/pp-wa-3.jpg';
        }

        const stylishText = `
⎾===========================================⏌
 📡 SYSTEM DIAGNOSTICS — PULSE REPORT
 ⌬━━━━━━━━━━━━━━━━━━━⌬
  ◉ Bot ID       » ${config.botname || "SHADOW-XTECH"}
  ◉ Response     » ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${latencyMs} ms ⚡
  ◉ Load Memory  » ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} *${memoryUsageMB.toFixed(2)} MB* 📦
  ◉ Stability    » ${stabilityEmoji} *${stabilityText}*
  ◉ Time Sync    » ${new Date().toLocaleTimeString()}
 ⌬━━━━━━━━━━━━━━━━━━━⌬
 ➤ ${randomQuote}
⎿===========================================⏋
        `.trim();

        await conn.sendMessage(from, {
            image: { url: profilePicUrl },
            caption: stylishText,
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
                    title: "⚙️ Shadow-Xtech | System Pulse",
                    body: "Speed • Stability • Sync",
                    thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});