const { cmd } = require('../command');
const { downloadTiktok } = require("@mrnima/tiktok-downloader");

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
            displayName: "⚙️ TikTok | Stream 📸",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
        }
    }
};

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("🚫 Invalid TikTok link.");

        reply("⏳ Downloading video, please wait...");

        const result = await downloadTiktok(q);

        if (!result || !result.video) {
            return reply("⚠️ Failed to fetch TikTok video.");
        }

        const videoUrl = result.video.noWatermark || result.video.watermark;

        const caption = `*_📥 Downloaded By Shadow -Xtech_*`;

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
                    title: "⚙️ Shadow-Xtech | TikPulse",
                    body: "Trend • Loop • Share",
                    thumbnailUrl: "https://files.catbox.moe/ubexsx.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (e) {
        console.error("🔴 Error in TikTok downloader command:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});