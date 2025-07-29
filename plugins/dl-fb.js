const axios = require("axios");
const { cmd } = require("../command");

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Quoted Contact to use for the reply
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Meta Extractor | Verified ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

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
      return reply("*`Need a valid Facebook URL`* *Example: `.fb https://www.facebook.com/...`*");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Use a single, stable API endpoint
    const apiUrl = `https://api.dreaded.site/api/facebook?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data || !data.data.url) {
      return reply("❌ Failed to fetch the video. Please try another link.");
    }

    const videoUrl = data.data.url;

    const caption = 
`*⎾⦿======================================⏌*
  *🛰️ SHADOW XTECH — FB NODE CAPTURE*
  *⌬━━━━━━━━━━━━━━━━━━⌬*
   *📡 STREAM TYPE : Facebook/Meta-Grid*
   *🌐 DATA TRACE : ${q.split('?')[0]}*
   *🧾 SIGNAL STATUS : 🟢 LINK VERIFIED*
  
 _*⧉ PACKET FEED*_
   *🧬 UPLINK_ID | shadow.fb.grid://ΩF8Z2*
  *⌬━━━━━━━━━━━━━━━━━━⌬*
   *✅ MEDIA READY — TRANSMIT TO CLIENT*
*⎿========================================⏋*`;

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
          title: "⚙️ Shadow-Xtech | Meta Extractor",
          body: "Facebook Node Captured & Stream Unlocked",
          thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact });

  } catch (error) {
    console.error("Error in Facebook downloader:", error);
    reply("❌ Error fetching the video. Please try again later.");
  }
});