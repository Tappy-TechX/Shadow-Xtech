const { cmd } = require("../command");
const { getContentType, downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
  pattern: "vv2",
  alias: ["viewonce2", "retrieve2"],
  react: "👾",
  desc: "Owner Only - retrieve view-once message and send to inbox",
  category: "owner",
  filename: __filename
}, async (conn, message, match, { from, isOwner, sender }) => {
  try {

    if (!isOwner) {
      return await conn.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!message.quoted) {
      return await conn.sendMessage(from, {
        text: "*🍁 Please reply to a view-once message!*"
      }, { quoted: message });
    }

    let quotedMsg = message.quoted.message;

    // 🔹 Auto-detect view-once containers
    let type = getContentType(quotedMsg);

    if (type === "viewOnceMessage") {
      quotedMsg = quotedMsg.viewOnceMessage.message;
    } else if (type === "viewOnceMessageV2") {
      quotedMsg = quotedMsg.viewOnceMessageV2.message;
    } else if (type === "viewOnceMessageV2Extension") {
      quotedMsg = quotedMsg.viewOnceMessageV2Extension.message;
    }

    const mediaType = getContentType(quotedMsg);
    const media = quotedMsg[mediaType];

    if (!media) {
      return await conn.sendMessage(from, {
        text: "❌ Not a valid view-once media."
      }, { quoted: message });
    }

    // 🔹 Download the actual media
    const buffer = [];
    const stream = await downloadContentFromMessage(quotedMsg, mediaType.replace("Message", ""));
    for await (const chunk of stream) {
      buffer.push(chunk);
    }
    const data = Buffer.concat(buffer);

    // 🔹 Contact used for quoting
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

    // 🔹 Prepare message content
    let sendContent = {};
    switch (mediaType) {
      case "imageMessage":
        sendContent = {
          image: data,
          caption: media.caption || "🖼️ Retrieved View Once Image"
        };
        break;

      case "videoMessage":
        sendContent = {
          video: data,
          caption: media.caption || "🎥 Retrieved View Once Video"
        };
        break;

      case "audioMessage":
        sendContent = {
          audio: data,
          mimetype: "audio/mp4",
          ptt: media.ptt || false
        };
        break;

      default:
        return await conn.sendMessage(from, {
          text: "❌ Unsupported media type."
        }, { quoted: message });
    }

    // 🔹 Send media directly to user's inbox (from)
    await conn.sendMessage(from, {
      ...sendContent,
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
          title: "⚙️ Shadow-Xtech | System Pulse",
          body: "Speed • Stability • Sync",
          thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VaXXXXX",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact });

  } catch (err) {
    console.error("vv2 Error:", err);
    await conn.sendMessage(from, {
      text: "❌ Error retrieving view-once message:\n" + err.message
    }, { quoted: message });
  }
});