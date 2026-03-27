const { cmd } = require("../command");

cmd({
  pattern: "vv2",
  alias: ["viewonce", "retrive"],
  react: "👾",
  desc: "Retrieve quoted view-once message and send to your inbox",
  category: "fun",
  filename: __filename
}, async (conn, message, match, { sender }) => {
  try {

    if (!match.quoted) {
      return await conn.sendMessage(message.from, {
        text: "*🍁 Please reply to a view-once message!*"
      }, { quoted: message });
    }

    const quotedMsg = match.quoted;
    const buffer = await quotedMsg.download();
    const mtype = quotedMsg.mtype;

    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: quotedMsg.text || "*🔥 Retrieved View Once Image*",
          mimetype: quotedMsg.mimetype || "image/jpeg"
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: quotedMsg.text || "*🎥 Retrieved View Once Video*",
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
        return await conn.sendMessage(message.from, {
          text: "*❌ Only image, video, and audio messages are supported*"
        }, { quoted: message });
    }

    // Send media privately to user's inbox
    await conn.sendMessage(sender, {
      ...messageContent,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | Retrieved View Once",
          body: "Quick • Instant • Private",
          thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    });

    // Delete the command message to keep chat clean
    await conn.sendMessage(message.from, { delete: message.key });

  } catch (error) {
    console.error("vv Error:", error);
    await conn.sendMessage(message.from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
});