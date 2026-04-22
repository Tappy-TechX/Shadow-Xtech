const { isJidGroup } = require("@whiskeysockets/baileys");
const { loadMessage } = require("./store");
const { getAnti } = require("../data/antidel");
const config = require("../config");

async function AntiDelete(conn, updates) {
    for (const update of updates) {
        try {
            if (update.update?.message !== null) continue;

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

                sender = mek.key.participant?.split("@")[0];
                deleter = update.key.participant?.split("@")[0];

                deleteInfo = `-- AntiDelete Detected --

⏱️ Time: ${time}
🟢 Group: ${metadata.subject}
📂 Deleted by: @${deleter}
👤 Sender: @${sender}`;
            } else {
                sender = mek.key.remoteJid?.split("@")[0];

                deleteInfo = `-- AntiDelete Detected --

⏱️ Time: ${time}
📂 Deleted by: @${sender}
👤 Sender: @${sender}`;
            }

            const text =
                mek.message?.conversation ||
                mek.message?.extendedTextMessage?.text;

            if (text) {
                await conn.sendMessage(stored.jid, {
                    text: `${deleteInfo}

📄 Message:
${text}`,
                    mentions: isGroup
                        ? [mek.key.participant, update.key.participant]
                        : [mek.key.remoteJid]
                });
            }

            else if (
                mek.message?.imageMessage ||
                mek.message?.videoMessage ||
                mek.message?.documentMessage ||
                mek.message?.audioMessage
            ) {
                await conn.sendMessage(stored.jid, {
                    text: deleteInfo
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