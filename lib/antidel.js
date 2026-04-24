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

            const botJid =
                conn.user.id.split(":")[0] + "@s.whatsapp.net";

            let deleteInfo;
            let sender;
            let deleter;
            let mentionList = [];

            // GROUP
            if (isGroup) {
                const metadata = await conn.groupMetadata(stored.jid);

                sender =
                    mek.key.participant ||
                    mek.key.remoteJid;

                if (update.key.fromMe) {
                    deleter = botJid;
                } else {
                    deleter =
                        update.key.participant ||
                        update.participant ||
                        sender;
                }

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🟢 Group: ${metadata.subject}
🗑️ Deleted By: @${deleter.split("@")[0]}
👤 Original Sender: @${sender.split("@")[0]}`;

                mentionList = [sender, deleter].filter(Boolean);
            }

            // DM
            else {
                sender =
                    mek.key.remoteJid ||
                    mek.key.participant;

                if (update.key.fromMe) {
                    deleter = botJid;
                } else {
                    deleter = sender;
                }

                deleteInfo = `🚨 *AntiDelete Detected*

⏱️ Time: ${time}
🗑️ Deleted By: @${deleter.split("@")[0]}
👤 Sender: @${sender.split("@")[0]}`;

                mentionList = [deleter].filter(Boolean);
            }

            const text =
                mek.message?.conversation ||
                mek.message?.extendedTextMessage?.text;

            if (text) {
                await conn.sendMessage(stored.jid, {
                    text: `${deleteInfo}

📄 *Deleted Message:*
${text}`,
                    mentions: mentionList
                });
            }

            else if (
                mek.message?.imageMessage ||
                mek.message?.videoMessage ||
                mek.message?.documentMessage ||
                mek.message?.audioMessage ||
                mek.message?.stickerMessage
            ) {
                await conn.sendMessage(stored.jid, {
                    text: deleteInfo,
                    mentions: mentionList
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