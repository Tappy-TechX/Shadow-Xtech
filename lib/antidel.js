const { isJidGroup } = require("@whiskeysockets/baileys");
const { loadMessage } = require("./store");
const { getAnti } = require("../data/antidel");

async function AntiDelete(conn, updates) {
    for (const update of updates) {
        try {
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

            // FIXED BOT JID
            const botJid =
                conn.user.id.split(":")[0] + "@s.whatsapp.net";

            let deleteInfo;
            let senderJid;
            let deleterJid;
            let mentions = [];

            // ---------------- GROUP ----------------
            if (isGroup) {
                const metadata = await conn.groupMetadata(stored.jid);

                senderJid =
                    mek.key.participant ||
                    mek.key.remoteJid;

                if (update.key.fromMe) {
                    deleterJid = botJid;
                } else {
                    deleterJid =
                        update.key.participant ||
                        update.participant ||
                        senderJid;
                }

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🟢 Group: ${metadata.subject}
🗑️ Deleted By: @${deleterJid.split("@")[0]}
👤 Original Sender: @${senderJid.split("@")[0]}`;

                mentions = [senderJid, deleterJid].filter(Boolean);
            }

            // ---------------- DM ----------------
            else {
                senderJid =
                    mek.key.remoteJid ||
                    mek.key.participant;

                if (update.key.fromMe) {
                    deleterJid = botJid;
                } else {
                    deleterJid = senderJid;
                }

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🗑️ Deleted By: @${deleterJid.split("@")[0]}
👤 Sender: @${senderJid.split("@")[0]}`;

                mentions = [deleterJid].filter(Boolean);
            }

            const text =
                mek.message?.conversation ||
                mek.message?.extendedTextMessage?.text;

            // TEXT MESSAGE
            if (text) {
                await conn.sendMessage(stored.jid, {
                    text: `${deleteInfo}

📄 *Deleted Message:*
${text}`,
                    mentions
                });
            }

            // MEDIA MESSAGE
            else if (
                mek.message?.imageMessage ||
                mek.message?.videoMessage ||
                mek.message?.documentMessage ||
                mek.message?.audioMessage ||
                mek.message?.stickerMessage
            ) {
                await conn.sendMessage(stored.jid, {
                    text: deleteInfo,
                    mentions
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
