const { cmd } = require('../command');
const { facebook } = require("@mrnima/facebook-downloader");

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Quoted Contact Object
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Facebook | Stream 🎥",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
        }
    }
};

cmd({
    pattern: "facebook",
    alias: ["fb", "fbdl", "fbvideo"],
    desc: "Download Facebook video",
    category: "downloader",
    react: "📘",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) return reply("❗ Please provide a Facebook video link.");
        if (!q.includes("facebook.com") && !q.includes("fb.watch"))
            return reply("🚫 Invalid Facebook link.");

        reply("⏳ Downloading Facebook video, please wait...");

        const result = await facebook(q);

        if (!result || !result.video) {
            return reply("⚠️ Failed to fetch Facebook video.");
        }

        const videoUrl = result.video;

        const caption = `*_📥 Downloaded By Shadow-Xtech_*`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | FB Stream",
                    body: "Watch • Download • Share",
                    thumbnailUrl: "https://files.catbox.moe/obdwt8.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (e) {
        console.error("🔴 Error in Facebook downloader command:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});