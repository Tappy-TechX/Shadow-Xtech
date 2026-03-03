const { cmd } = require("../command");
const { facebook } = require("@mrnima/facebook-downloader");

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

// Quoted Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Meta | Extractor 📸",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*`Need a valid Facebook URL`*\n*Example: `.fb https://www.facebook.com/...`*");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    // Fetch video using @mrnima/facebook-downloader
    const result = await facebook(q);

    if (!result || !result.video) {
      return reply("❌ Failed to fetch the video. Please try another link.");
    }

    const videoUrl = result.video;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: "*_📥 Downloaded By Shadow-Xtech_*",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363369453603973@newsletter",
          newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | FB Insight",
          body: "Post • Like • Comment",
          thumbnailUrl: "https://files.catbox.moe/2mnw2r.jpg",
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