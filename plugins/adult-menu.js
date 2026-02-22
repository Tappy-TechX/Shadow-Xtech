const axios = require("axios");
const { cmd } = require("../command");

// Contact used for quoting the reply
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🔞 Explicit | Content ⭐",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

cmd({
  pattern: "adult",
  alias: ["adultmenu"],
  desc: "18+ command menu",
  category: "menu",
  react: "🔞",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {

  try {

    const adultMenu = `
╭───❍「 *18+ CMD 🔞* 」❍
├⬡ .xvideo
├⬡ .porn
├⬡ .xvideos
├⬡ .randomporn
├⬡ .randomxvideo
╰───────────────❍
`;

    await conn.sendMessage(
      from,
      {
        image: { url: "https://files.catbox.moe/xbxftg.jpeg" },
        caption: adultMenu,
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
            title: "🔞 Shadow-Xtech 18+ System",
            body: "Advanced 18+ Command Panel",
            thumbnailUrl: "https://files.catbox.moe/xbxftg.jpeg",
            sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      },
      { quoted: quotedContact }
    );

  } catch (e) {
    console.error("Error in adult command:", e);
    reply(`An error occurred: ${e.message}`);
  }
});