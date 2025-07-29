const axios = require("axios");
const { cmd } = require("../command");

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*`Need a valid Facebook URL`*\n\nExample: `.fb https://www.facebook.com/...`");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Randomly select one API endpoint
    const apiEndpoints = [
      `https://apis.davidcyriltech.my.id/facebook?url=${encodeURIComponent(q)}`,
      `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(q)}`,
      `https://apis.davidcyriltech.my.id/facebook3?url=${encodeURIComponent(q)}`
    ];
    const apiUrl = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];

    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data || !data.data.url) {
      return reply("❌ Failed to fetch the video. Please try another link.");
    }

    const videoUrl = data.data.url;

    const caption = 
`⎾⦿=======================================⏌
  🛰️ SHADOW INTERCEPT — FB NODE CAPTURE
⎿==========================================⏋

  📡 STREAM TYPE     :: Facebook/Meta-Grid
  🌐 DATA TRACE      :: ${q.split('?')[0]}
  🧾 SIGNAL STATUS   :: 🟢 LINK VERIFIED

 ⧉ PACKET FEED
    ▸ RETRIEVAL_MODE :: DEEP SCAN
    ▸ STATUS_CODE    :: 200_OK
    ▸ DECRYPTION     :: COMPLETE

 🧬 UPLINK_ID        :: shadow.fb.grid://ΩF8Z2

⎾==========================================⏌
  ✅ MEDIA READY — TRANSMIT TO CLIENT
⎿==========================================⏋`;

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
          title: "⚙️ Shadow-Xtech | Meta Extractor",
          body: "Facebook Node Captured & Stream Unlocked",
          thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Error in Facebook downloader:", error);
    reply("❌ Error fetching the video. Please try again later.");
  }
});