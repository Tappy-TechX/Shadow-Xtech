const { cmd } = require('../command');
const config = require('../config');

// Predefined quoted contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Anti-Link | System ℹ️",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

cmd({ on: "body" }, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
  try {
    if (!global.warnings) global.warnings = {};

    if (!isGroup || isAdmins || !isBotAdmins || !body) return;
    if (config.ANTI_LINK !== "true") return;

    // Message sender helper
    const username = sender.split('@')[0];

    // ✅ FIXED: safer link detection (no global flag issues)
    const linkPatterns = [
      /\bhttps?:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i,
      /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|shorte\.st|rebrand\.ly|ow\.ly|v\.gd|t2m\.io)\b/i,
      /\b[a-z0-9-]+\.(com|net|org|io|me|gg|co|app|dev|xyz|site|link|ly|tv|us|ru|in|pk|ke)\b/i
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink) return;

    // ✅ FUNCTION MOVED BEFORE USAGE
    const sendAntiLinkMessage = async (text) => {
      await conn.sendMessage(from, {
        text,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363369453603973@newsletter',
            newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
            serverMessageId: 143
          }
        }
      }, { quoted: quotedContact });
    };

    const action = config.ANTI_LINK_ACTION || "warn";

    // 🔸 WARN
    if (action === "warn") {
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;

      const text = `╭───────────────╮
│ *🔗 Link detected* │
│ *👤 @${username}* │
│ *🔴 Warning: ${global.warnings[sender]}* │
╰───────────────╯`;

      await sendAntiLinkMessage(text);
    }

    // 🔸 DELETE
    else if (action === "delete") {
      try {
        await conn.sendMessage(from, { delete: m.key });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }

    // 🔸 REMOVE
    else if (action === "remove") {
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;

      if (global.warnings[sender] >= 3) {
        await sendAntiLinkMessage(`@${username} removed for sending links 🚫`);
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      } else {
        const text = `╭───────────────╮
│ *🔗 Link detected* │
│ *👤 @${username}* │
│ *🔴 Warning: ${global.warnings[sender]}* │
╰───────────────╯`;

        await sendAntiLinkMessage(text);
      }
    }

    else {
      console.log("Unknown Anti-Link action:", action);
    }

  } catch (err) {
    console.error("Anti-link error:", err);
  }
});