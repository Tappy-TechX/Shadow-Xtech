const settingsManager = require('./settingsmanager');

// Quoted contact card
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

module.exports = (conn) => {

    conn.ev.on('call', async (callData) => {

        if (!settingsManager.getSetting("ANTICALL")) {
            console.log("[ANTICALL] Feature OFF.");
            return;
        }

        const action = settingsManager.getSetting("ANTICALL_ACTION") || "reject";
        const message = settingsManager.getSetting("ANTICALL_MESSAGE") || 
        "🚫 *Auto Call Rejection!*\n\n*Please do not call this bot.*";

        for (const call of callData) {

            if (call.status === 'offer') {

                const callerId = call.from;

                try {

                    // Always reject first
                    await conn.rejectCall(call.id, callerId);

                    // If action = block
                    if (action === "block") {
                        await conn.updateBlockStatus(callerId, "block");
                        console.log(`[ANTICALL] Blocked ${callerId}`);
                    }

                    // Send custom message WITH quoted contact + newsletter context
                    await conn.sendMessage(callerId, {
                        text: message,
                        contextInfo: {
                            mentionedJid: [callerId],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363369453603973@newsletter',
                                newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
                                serverMessageId: 143
                            }
                        }
                    }, { quoted: quotedContact });

                    console.log(`[ANTICALL] ${action.toUpperCase()} call from ${callerId}`);

                } catch (err) {
                    console.error("[ANTICALL ERROR]:", err);
                }
            }
        }
    });

    console.log("[ANTICALL] Advanced call handler loaded with quoted contact.");
};
