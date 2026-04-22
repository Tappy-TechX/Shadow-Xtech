const { loadMessage, saveMessage } = require("./store");
const { getAnti } = require("../data/antiedit");

async function handleEdit(conn, updates) {
    for (const update of updates) {
        try {
            const protocol = update.update?.message?.protocolMessage;

            // Gifted-baileys edit detection
            if (!protocol || protocol.type !== 14) continue;

            const oldData = loadMessage(update.key.id);
            if (!oldData) continue;

            const oldMsg = oldData.message;

            const editedMessage = protocol.editedMessage;
            if (!editedMessage) continue;

            const oldText =
                oldMsg.message?.conversation ||
                oldMsg.message?.extendedTextMessage?.text ||
                oldMsg.message?.imageMessage?.caption ||
                "";

            const newText =
                editedMessage?.conversation ||
                editedMessage?.extendedTextMessage?.text ||
                editedMessage?.imageMessage?.caption ||
                "";

            if (!oldText || !newText) continue;
            if (oldText === newText) continue;

            const isGroup = oldData.jid.endsWith("@g.us");
            const enabled = await getAnti(isGroup ? "gc" : "dm");

            if (!enabled) continue;

            const sender = isGroup
                ? oldMsg.key.participant
                : oldMsg.key.remoteJid;

            const time = new Date().toLocaleString();

            let editedInfo;

            if (isGroup) {
                const metadata = await conn.groupMetadata(oldData.jid);

                editedInfo = `-- AntiEdit Detected --

⏱️ Time: ${time}
🟢 Group: ${metadata.subject}
📂 Edited by: @${sender.split("@")[0]}
👤 Sender: @${sender.split("@")[0]}

📝 Old Message:
${oldText}

✏️ New Message:
${newText}`;
            } else {
                editedInfo = `-- AntiEdit Detected --

⏱️ Time: ${time}
📂 Edited by: @${sender.split("@")[0]}
👤 Sender: @${sender.split("@")[0]}

📝 Old Message:
${oldText}

✏️ New Message:
${newText}`;
            }

            await conn.sendMessage(oldData.jid, {
                text: editedInfo,
                mentions: [sender]
            });

            // update stored version after edit
            saveMessage(
                {
                    ...oldMsg,
                    message: editedMessage
                },
                oldData.jid
            );

        } catch (err) {
            console.log("AntiEdit Error:", err);
        }
    }
}

module.exports = { handleEdit };