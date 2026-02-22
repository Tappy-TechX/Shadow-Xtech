const { cmd } = require('../command');
const config = require('../config');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
const thumbnailUrl = 'https://files.catbox.moe/3l3qgq.jpg';

const LOADING_MESSAGES = [
  "🔍 Syncing owner data...",
  "📡 Establishing uplink...",
  "🧠 Linking neural ID...",
  "⚙️ Preparing access...",
  "💠 Fetching core credentials..."
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Quoted Contact for messages
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Latency | Check 🚀",
      vcard: [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:SCIFI",
        "ORG:Shadow-Xtech BOT;",
        "TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001",
        "END:VCARD"
      ].join("\n")
    }
  }
};

cmd({
  pattern: "owner",
  react: "👨‍💻",
  desc: "Displays bot owner's contact info",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {

  try {
    const ownerNumber = config.OWNER_NUMBER;
    const ownerName = config.OWNER_NAME;

    if (!ownerNumber || !ownerName) {
      return reply("🚫 Missing owner details in the config file.");
    }

    // Typing Simulation
    await conn.sendPresenceUpdate('composing', from);
    await delay(1200);

    const randomLoading =
      LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    await reply(randomLoading);

    await conn.sendPresenceUpdate('composing', from);
    await delay(1500);

    // Send Contact vCard normally
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${ownerName}`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      'END:VCARD'
    ].join('\n');

    await conn.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    }, { quoted: mek });

    await conn.sendPresenceUpdate('composing', from);
    await delay(1200);

    // Send buttons message only (without video)
    const buttons = [
      {
        buttonId: `wa.me/${ownerNumber.replace('+', '')}`,
        buttonText: { displayText: '📞 Contact Owner' },
        type: 1
      },
      {
        buttonId: whatsappChannelLink,
        buttonText: { displayText: '🌐 Visit Channel' },
        type: 1
      },
      {
        buttonId: 'help',
        buttonText: { displayText: '⚙️ Help Menu' },
        type: 1
      }
    ];

    const buttonMessage = {
      text: `🛡️ *SYSTEM ACCESS: OWNER MODULE* 🛡️
◉ 👤 Name: ${ownerName}
◉ 📞 Number: ${ownerNumber}
◉ 🔰 System ID: Shadow-Xtech AI
◉ ⚙️ Core Version: 8.0.0 Beta
◉ 🧠 Neural Core: ACTIVE
◉ 🌐 Node State: LINKED
📩 Use responsibly or emergencies only.`,
      footer: "Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ",
      buttons: buttons,
      headerType: 1, // simple text header
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: 'Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ',
          serverMessageId: 143,
          externalAdReply: {
            title: "⚙️ Shadow-Xtech Owner Sync",
            body: "🔍 Quantum trace initialized.",
            thumbnailUrl: thumbnailUrl,
            sourceUrl: whatsappChannelLink,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      quoted: quotedContact
    };

    await conn.sendMessage(from, buttonMessage);

  } catch (error) {
    console.error(error);
    await reply(`❌ *Error: Owner Module Failed*\n> ${error.message}`);
  }

});