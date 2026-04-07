const settingsManager = require('../lib/settingsmanager');
const { cmd } = require('../command');

const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Anticall | System 📞",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

cmd({
    pattern: "anticall",
    alias: ["callblock", "togglecall"],
    desc: "Manage anti-call system",
    category: "owner",
    react: "📞",
    filename: __filename,
    fromMe: true
},
async (conn, mek, m, { isOwner, reply, from, sender, args }) => {
    try {

        if (!isOwner) return reply("🚫 Owner only command.");

        const arg = (args[0] || "").toLowerCase();
        const subArg = args.slice(1).join(" ");

        const status = settingsManager.getSetting("ANTICALL") || false;
        const action = settingsManager.getSetting("ANTICALL_ACTION") || "reject";
        const message = settingsManager.getSetting("ANTICALL_MESSAGE") || 
        "🚫 *Auto Call Rejection!*\n\nPlease do not call this bot.";

        let text = "";
        let reactEmoji = "📞";

        // ===== TOGGLE =====
        if (arg === "on") {
            settingsManager.setSetting("ANTICALL", true);
            text = "✅ Anti-call has been *enabled*.";
            reactEmoji = "✅";

        } else if (arg === "off") {
            settingsManager.setSetting("ANTICALL", false);
            text = "❌ Anti-call has been *disabled*.";
            reactEmoji = "❌";

        // ===== SET MESSAGE =====
        } else if (arg === "message") {
            if (!subArg) {
                return reply("⚠️ Provide a message.\nExample:\n.anticall message Please don't call me.");
            }

            settingsManager.setSetting("ANTICALL_MESSAGE", subArg);
            text = `✅ Anti-call rejection message updated to:\n\n"${subArg}"`;
            reactEmoji = "✏️";

        // ===== SET ACTION =====
        } else if (arg === "action") {
            if (!["reject", "block"].includes(subArg)) {
                return reply("⚠️ Use:\n.anticall action reject\nor\n.anticall action block");
            }

            settingsManager.setSetting("ANTICALL_ACTION", subArg);
            text = `✅ Anti-call action set to *${subArg.toUpperCase()}*`;
            reactEmoji = "⚙️";

        // ===== STATUS PANEL =====
        } else if (arg === "status" || !arg) {

            const statusEmoji = status ? "✅ ON" : "❌ OFF";

            text = `
📞 *Anti-Call Settings*

🔹 Status: ${statusEmoji}
🔹 Action: ${action.toUpperCase()}
🔹 Message: ${message}

🛠 *Usage:*
• .anticall on/off
• .anticall message <text>
• .anticall action reject/block
            `.trim();

            reactEmoji = "ℹ️";

        } else {
            return reply("❌ Invalid option.");
        }

        await conn.sendMessage(from, {
            react: { text: reactEmoji, key: mek.key }
        });

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

    } catch (e) {
        console.error("Anticall error:", e);
        reply(`Error: ${e.message}`);
    }
});