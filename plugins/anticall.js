const settingsManager = require('../lib/settingsmanager'); // Path to your settings manager
const { cmd } = require('../command'); // Command registration

// Quoted contact card to be used in replies
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Shadow-Xtech | Verified ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

cmd({
    pattern: "anticall",
    alias: ["callblock", "togglecall"],
    desc: "Manages the anti-call feature. Use: .anticall [on/off]",
    category: "owner",
    react: "📞",
    filename: __filename,
    fromMe: true // Only accessible by bot itself
},
async (conn, mek, m, { isOwner, reply, from, sender, args, prefix }) => {
    try {
        if (!isOwner) {
            return reply("🚫 This command is for the bot owner only.");
        }

        let currentStatus = settingsManager.getSetting('ANTICALL');
        const arg = args[0] ? args[0].toLowerCase() : '';

        let replyText;
        let finalReactionEmoji = '📞';

        if (arg === 'on') {
            if (currentStatus) {
                replyText = `📞 Anti-call feature is already *enabled*.`;
                finalReactionEmoji = 'ℹ️';
            } else {
                settingsManager.setSetting('ANTICALL', true);
                replyText = `📞 Anti-call feature has been *enabled*!`;
                finalReactionEmoji = '✅';
            }
        } else if (arg === 'off') {
            if (!currentStatus) {
                replyText = `📞 Anti-call feature is already *disabled*.`;
                finalReactionEmoji = 'ℹ️';
            } else {
                settingsManager.setSetting('ANTICALL', false);
                replyText = `📞 Anti-call feature has been *disabled*!`;
                finalReactionEmoji = '❌';
            }
        } else if (arg === '') {
            const statusEmoji = currentStatus ? '✅ ON' : '❌ OFF';
            replyText = `
*📞 Anti-Call Feature Manager*

Current Status: *${statusEmoji}*

To turn On:
  \`\`\`${prefix}anticall on\`\`\`
To turn Off:
  \`\`\`${prefix}anticall off\`\`\`
            `.trim();
            finalReactionEmoji = '❓';
        } else {
            replyText = `❌ Invalid argument. Please use \`${prefix}anticall on\`, \`${prefix}anticall off\`, or just \`${prefix}anticall\` for help.`;
            finalReactionEmoji = '❓';
        }

        // React to the command message
        await conn.sendMessage(from, {
            react: { text: finalReactionEmoji, key: mek.key }
        });

        // Send the status/help reply with quoted contact
        await conn.sendMessage(from, {
            text: replyText,
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

    } catch (e) {
        console.error("Error in anticall command:", e);
        reply(`An error occurred while managing anti-call: ${e.message}`);
    }
});