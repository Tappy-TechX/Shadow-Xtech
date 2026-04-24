const { isJidGroup } = require("@whiskeysockets/baileys");
const { loadMessage } = require("./store");
const { getAnti } = require("../data/antidel");

async function AntiDelete(conn, updates) {
    for (const update of updates) {
        try {
            // only detect deleted messages
            if (update.update?.message !== null) continue;

            console.log(
                "DELETE UPDATE:",
                JSON.stringify(update, null, 2)
            );

            const stored = loadMessage(update.key.id);
            if (!stored) continue;

            const mek = stored.message;
            const isGroup = isJidGroup(stored.jid);

            const antiType = isGroup ? "gc" : "dm";
            const enabled = await getAnti(antiType);

            if (!enabled) continue;

            const time = new Date().toLocaleString();

            let deleteInfo;
            let sender;
            let deleter;

            if (isGroup) {
                const metadata = await conn.groupMetadata(stored.jid);

                // original sender
                sender =
                    mek.key.participant?.split("@")[0] ||
                    mek.key.remoteJid?.split("@")[0];

                // actual deleter
                if (update.key.fromMe) {
                    deleter = conn.user.id
                        .split(":")[0]
                        .split("@")[0];
                } else {
                    deleter =
                        update.key.participant?.split("@")[0] ||
                        update.participant?.split("@")[0] ||
                        sender;
                }

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🟢 Group: ${metadata.subject}
🗑️ Deleted By: @${deleter}
👤 Original Sender: @${sender}`;
            } else {
                sender =
                    mek.key.remoteJid?.split("@")[0] ||
                    mek.key.participant?.split("@")[0];

                deleter = sender;

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🗑️ Deleted By: @${deleter}
👤 Sender: @${sender}`;
            }

            // Handle text messages
            const text =
                mek.message?.conversation ||
                mek.message?.extendedTextMessage?.text;

            if (text) {
                await conn.sendMessage(stored.jid, {
                    text: `${deleteInfo}

📄 *Deleted Message:*
${text}`,
                    mentions: isGroup
                        ? [
                              mek.key.participant,
                              update.key.participant
                          ].filter(Boolean)
                        : [mek.key.remoteJid]
                });
            }

            // Handle media messages
            else if (
                mek.message?.imageMessage ||
                mek.message?.videoMessage ||
                mek.message?.documentMessage ||
                mek.message?.audioMessage ||
                mek.message?.stickerMessage
            ) {
                await conn.sendMessage(stored.jid, {
                    text: deleteInfo,
                    mentions: isGroup
                        ? [
                              mek.key.participant,
                              update.key.participant
                          ].filter(Boolean)
                        : [mek.key.remoteJid]
                });

                await conn.relayMessage(
                    stored.jid,
                    mek.message,
                    {}
                );
            }

        } catch (err) {
            console.log("AntiDelete Error:", err);
        }
    }
}

module.exports = { AntiDelete };