const { cmd } = require('../command');
const axios = require('axios');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("🚫 Invalid TikTok link.");

        reply("⏳ Downloading video, please wait...");

        const apiUrl = `https://bk9.fun/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) return reply("⚠️ Failed to fetch TikTok video.");

        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;

        const caption = 
`⎾⦿========================================⏌
🔗 CYBERLINK — TIKTOK FEED INTERCEPT
⎿===========================================⏋

  👤 USER_HANDLE     :: ${author.nickname} (@${author.username})
  📁 VIDEO_TITLE     :: "${title}"
  🌐 SOURCE_NODE     :: TikTok_NW://Stream.Decrypt

 ⧉ ENGAGEMENT_LOG
  ▸ LIKES         :: ${like}
  ▸ COMMENTS      :: ${comment}
  ▸ SHARES        :: ${share}

 ⧉ STATUS_PACKET
  ▸ STREAM_STATUS :: ✅ UNLOCKED
  ▸ MEDIA_TYPE    :: VIDEO/NW/HD

 🧬 UPLINK_ID       :: shadow.matrix.grid://Ω1A2Z

⎾===========================================⏌
🛰️ END OF TRANSMISSION – SIG/149X
⎿===========================================⏋`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "ֆཏɑɖօա-𝕏Ե𝖾𝖼ཏ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | TikTok Node",
                    body: "Intercepted & Delivered from XtechLink",
                    thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});