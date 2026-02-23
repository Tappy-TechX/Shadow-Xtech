const { cmd } = require('../command');    
const config = require('../config');    

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';    
const thumbnailUrl = 'https://files.catbox.moe/3l3qgq.jpg';    

const LOADING_MESSAGES = [    
  "⎾⟪ 🔍 Syncing owner data... ⟫⏌",    
  "⎾⟪ 📡 Establishing uplink... ⟫⏌",    
  "⎾⟪ 🧠 Linking neural ID... ⟫⏌",    
  "⎾⟪ ⚙️ Preparing access... ⟫⏌",    
  "⎾⟪ 💠 Fetching core credentials... ⟫⏌"    
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
      displayName: "⚙️ Owner | Number 🚀",    
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
  desc: "Displays bot owner's contact info as a forwarded card",    
  category: "main",    
  filename: __filename    
}, async (conn, mek, m, { from, reply, sender }) => {    
  try {    
    const ownerNumber = config.OWNER_NUMBER;    
    const ownerName = config.OWNER_NAME;    

    if (!ownerNumber || !ownerName) {    
      return reply("🚫 Missing owner details in the config file.");    
    }    

    // Typing simulation  
    await conn.sendPresenceUpdate('composing', from);    
    await delay(1200);    

    const randomLoading = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];    
    await reply(randomLoading);    
    await conn.sendPresenceUpdate('composing', from);    
    await delay(1500);    

    // Updated stylish caption text  
    const stylishText =
`*🛡️ SYSTEM ACCESS: OWNER MODULE 🛡️*\n\n` +
`*👤 Name:* ${ownerName}\n` +
`*📞 Number:* ${ownerNumber}\n` +
`*🔰 System ID:* Shadow-Xtech AI\n` +
`*⚙️ Core Version:* 8.0.0 Beta\n` +
`*🧠 Neural Core:* ACTIVE\n` +
`*🌐 Node State:* LINKED\n\n` +
`📩 Use responsibly or emergencies only.`;

    // Send forwarded newsletter  
    await conn.sendMessage(from, {  
      text: stylishText,  
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
          title: "⚙️ Access | Module",  
          body: "Speed • Stability • Sync",  
          thumbnailUrl: thumbnailUrl,  
          sourceUrl: whatsappChannelLink,  
          mediaType: 1,  
          renderLargerThumbnail: false,  
        }  
      }  
    }, { quoted: quotedContact });  

  } catch (error) {    
    console.error(error);    
    await reply(`❌ *Error: Owner Module Failed*\n> ${error.message}`);    
  }    
});