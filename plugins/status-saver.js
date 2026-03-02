const { cmd } = require("../command");

// VCard Contact (DML VERIFIED ✅)
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🫧 Status | Saver 📥",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:DML VERIFIED ✅\nORG:DML-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255622220680:+255 713 541 112\nEND:VCARD"
    }
  }
};

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363369453603973@newsletter",
      newsletterName: "Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ",
      serverMessageId: 1
    }
  }
};

cmd({
  pattern: "send",
  alias: ["sendme", 'save'],
  react: '📤',
  desc: "Forwards quoted message back to user",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    // Check if the command is used in a status
    const isStatus = message.key.remoteJid === "status@broadcast";
    
    if (!match.quoted) {
      const boxText = `🍁 *Please reply to a message!*`;

      return await client.sendMessage(isStatus ? message.key.participant : from, {
        text: boxText,
        ...newsletterContext
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message, ...newsletterContext };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg",
          ...newsletterContext
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4",
          ...newsletterContext
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false,
          ...newsletterContext
        };
        break;
      default:
        const unsupportedBox = `❌ *Only image, video, and audio messages are supported*`;

        return await client.sendMessage(isStatus ? message.key.participant : from, {
          text: unsupportedBox,
          ...newsletterContext
        }, { quoted: message });
    }

    // Send to the participant's personal chat if it's from status, otherwise to the current chat
    const sendTo = isStatus ? message.key.participant : from;
    await client.sendMessage(sendTo, messageContent, options);
    
  } catch (error) {
    console.error("Forward Error:", error);

    const errorBox = `❌ *Error forwarding message:*${error.message}`;

    await client.sendMessage(isStatus ? message.key.participant : from, {
      text: errorBox,
      ...newsletterContext
    }, { quoted: message });
  }
});
