const { cmd } = require('../command');
const config = require("../config");

// Temporary warning storage (resets when bot restarts)
const warnings = {};

// Quoted contact card
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Antibadword | System 🚫",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

// Smart Bad Word Patterns (with bypass detection)
const badWordPatterns = [
  /f[\W_]*u[\W_]*c[\W_]*k/i,        // fuck
  /s[\W_]*h[\W_]*i[\W_]*t/i,       // shit
  /b[\W_]*i[\W_]*t[\W_]*c[\W_]*h/i, // bitch
  /b[\W_]*a[\W_]*s[\W_]*t[\W_]*a[\W_]*r[\W_]*d/i, // bastard
  /a[\W_]*s[\W_]*s[\W_]*h[\W_]*o[\W_]*l[\W_]*e/i, // asshole
  /d[\W_]*i[\W_]*c[\W_]*k/i,       // dick
  /p[\W_]*u[\W_]*s[\W_]*s[\W_]*y/i, // pussy
  /s[\W_]*e[\W_]*x/i,              // sex
  /p[\W_]*o[\W_]*r[\W_]*n/i,       // porn
  /s[\W_]*l[\W_]*u[\W_]*t/i,       // slut
  /w[\W_]*t[\W_]*f/i               // wtf
];

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  sender
}) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) return;
    if (config.ANTI_BAD_WORD !== "true") return;

    const messageText = body.toLowerCase();
    const containsBadWord = badWordPatterns.some(pattern => pattern.test(messageText));

    if (!containsBadWord) return;

    // Delete bad message
    await conn.sendMessage(from, { delete: m.key });

    // Initialize warning count
    if (!warnings[sender]) warnings[sender] = 0;
    warnings[sender] += 1;

    const userTag = `@${sender.split("@")[0]}`;
    const warnCount = warnings[sender];

    // If user reaches 3 warnings → Kick
    if (warnCount >= 3) {

      await conn.groupParticipantsUpdate(from, [sender], "remove");
      delete warnings[sender];

      const kickText = `🚫 *USER REMOVED!* 🚫

👤 *${userTag}*
📝 *Reason: Repeated use of inappropriate language.*
⚠️ *Limit exceeded (3/3 warnings)*

⚙️ *Shadow-Xtech Protection Active*`;

      await conn.sendMessage(from, {
        text: kickText,
        contextInfo: {
          mentionedJid: [sender]
        }
      }, { quoted: quotedContact });

    } else {

      const replyText = `🚫 *BAD WORD DETECTED!* ⚠️

👤 *${userTag}*
📌 *Warning: ${warnCount}/3*

❗ *After 3 warnings you will be removed.*

⚙️ *Shadow-Xtech Protection Active*`;

      await conn.sendMessage(from, {
        text: replyText,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363369453603973@newsletter',
            newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
            serverMessageId: 143
          }
        }
      }, { quoted: quotedContact });
    }

  } catch (error) {
    console.error(error);
  }
});