const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", "retrive"],
  react: "👾",
  desc: "Retrieve quoted view-once message",
  category: "fun", // Changed from owner to a public category
  filename: __filename
}, async (conn, message, match, { from, sender }) => {
  try {

    if (!match.quoted) {
      return await conn.sendMessage(from, {
        text: "*🍁 Please reply to a view-once message!*"
      }, { quoted: message });
    }

    const quotedMsg = match.quoted;
    const buffer = await quotedMsg.download();
    const mtype = quotedMsg.mtype;

    // 🔹 Contact used for quoting the reply
    const quotedContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "🔂 View | Once 🚀",
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
END:VCARD`
        }
      }
    };

    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: quotedMsg.text || "🖼️ Retrieved View Once Image",
          mimetype: quotedMsg.mimetype || "image/jpeg"
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: quotedMsg.text || "🎥 Retrieved View Once Video",
          mimetype: quotedMsg.mimetype || "video/mp4"
        };
        break;

      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quotedMsg.ptt || false
        };
        break;

      default:
        return await conn.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
      ...messageContent,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363369453603973@newsletter",
          newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | Retrieve Engine",
          body: "Quick • Instant • View",
          thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10", 
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact });

  } catch (error) {
    console.error("vv Error:", error);
    await conn.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
});