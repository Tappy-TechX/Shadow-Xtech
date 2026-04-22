const { loadMessage, saveMessage } = require("./store");
const { getAnti } = require("../data/antiedit");

async function handleEdit(conn, updates) {
    for (const update of updates) {
        try {
            if (!update.update?.message) continue;

            const oldData = loadMessage(update.key.id);
            if (!oldData) continue;

            const oldMsg = oldData.message;
            const newMsg = update.update.message;

            const oldText =
                oldMsg.message?.conversation ||
                oldMsg.message?.extendedTextMessage?.text ||
                "";

            const newText =
                newMsg?.conversation ||
                newMsg?.extendedTextMessage?.text ||
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

            // update stored version
            saveMessage(
                {
                    ...oldMsg,
                    message: newMsg
                },
                oldData.jid
            );

        } catch (err) {
            console.log("AntiEdit Error:", err);
        }
    }
}

module.exports = { handleEdit };