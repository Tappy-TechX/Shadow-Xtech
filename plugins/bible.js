const axios = require("axios");
const { cmd } = require("../command");

// Updated quoted contact for all replies
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "📜 Bible | Verse💡",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
    }
  }
};

// WhatsApp channel link
const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

// Command: bible
cmd({
  pattern: "bible",
  desc: "Fetch Bible verses by reference.",
  category: "fun",
  react: "📖",
  filename: __filename
}, async (conn, mek, m, { args, reply, from, sender }) => {
  try {
    // Check if reference is provided
    if (!args.length) {
      return reply(`⚠️ *Please provide a Bible reference.*\n\n📝 *Example:*\n.bible John 1:1`, { quoted: quotedContact });
    }

    const reference = args.join(" ");
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data.text) {
      const { reference: ref, text, translation_name } = response.data;

      // Stylish text to send
      const stylishText =
        `📜 *Bible Verse Found!*\n\n` +
        `📖 *Reference: ${ref}*\n` +
        `📚 *Text: ${text}*\n\n` +
        `🗂️ *Translation: ${translation_name}*\n\n *© SHADOW-XTECH BIBLE*`;

      // Thumbnail for externalAdReply
      const thumbnailUrl = "https://files.catbox.moe/kttohz.jpeg"; 

      // Send forwarded newsletter with video
      await conn.sendMessage(from, {
        video: { url: "https://files.catbox.moe/tmynfd.mp4" },
        gifPlayback: true,
        caption: stylishText,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363369453603973@newsletter',
            newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
            serverMessageId: 143
          },
          externalAdReply: {
            title: "⚙️ Shadow-Xtech | Bible Menu",
            body: "Pray • Believe • Receive",
            thumbnailUrl: thumbnailUrl,
            sourceUrl: whatsappChannelLink,
            mediaType: 1,
            renderLargerThumbnail: false,
          }
        }
      }, { quoted: quotedContact });

    } else {
      reply("❌ *Verse not found.* Please check the reference and try again.", { quoted: quotedContact });
    }
  } catch (error) {
    console.error(error);
    reply("⚠️ *An error occurred while fetching the Bible verse.* Please try again.", { quoted: quotedContact });
  }
});