// code by ⿻ ⌜ Black-Tappy ⌟⿻⃮͛♥️𖤐

const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "sss",
    alias: ["ss", "ssweb", "webss"],
    react: "📸",
    desc: "Take HD screenshot of any website.",
    category: "tools",
    use: ".ss <url>",
    filename: __filename
},
async (conn, mek, m, {
    from, q, reply
}) => {

    if (!q) {
        return reply("⚠️ Please provide a website URL.\n\nExample:\n.ss google.com");
    }

    try {

        // Auto add https if user forgot
        let url = q.startsWith("http://") || q.startsWith("https://") 
        ? q 
        : `https://${q}`;

        // Screenshot API
        const screenshot = `https://image.thum.io/get/fullpage/${url}`;

        // Processing message
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const msg = {
            image: { url: screenshot },
            caption:
`*🌐 WEB SCREENSHOT DOWNLOADER*

🔗 *URL:* ${url}

> *© Powered By Shadow‑Xtech*`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363369453603973@newsletter",
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ‑𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, msg, { quoted: m });

        // Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.log(error);

        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply("❌ Failed to capture screenshot. The website may block bots.");
    }
});

// ⿻ ⌜ Black-Tappy ⌟⿻⃮͛♥️𖤐