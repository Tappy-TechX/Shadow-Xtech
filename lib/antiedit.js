const { loadMessage, saveMessage } = require("./store");
const { getAnti } = require("../data/antiedit");

function extractContent(message) {
    if (!message) return null;

    return (
        message?.conversation ||
        message?.extendedTextMessage?.text ||
        message?.imageMessage?.caption ||
        message?.videoMessage?.caption ||
        message?.documentMessage?.caption ||
        null
    );
}

async function handleEdit(conn, updates) {
    try {
        for (const update of updates) {
            const { key, update: updateData } = update;

            if (!key || !updateData?.message) continue;
            if (key.fromMe) continue;
            if (key.remoteJid === "status@broadcast") continue;

            // original stored message
            const oldData = loadMessage(key.id);
            if (!oldData) continue;

            const oldMsg = oldData.message;

            const oldText = extractContent(oldMsg.message);
            const newText = extractContent(updateData.message);

            if (!oldText || !newText) continue;
            if (oldText === newText) continue;

            const isGroup = oldData.jid.endsWith("@g.us");
            const enabled = await getAnti(isGroup ? "gc" : "dm");

            if (!enabled) continue;

            const sender = isGroup
                ? key.participant
                : key.remoteJid;

            const senderNum = sender.split("@")[0];
            const time = new Date().toLocaleString();

            let editedInfo;

            if (isGroup) {
                let groupName = oldData.jid;

                try {
                    const metadata = await conn.groupMetadata(oldData.jid);
                    groupName = metadata.subject;
                } catch {}

                editedInfo = `-- AntiEdit Detected --

⏱️ Time: ${time}
🟢 Group: ${groupName}
📂 Edited by: @${senderNum}
👤 Sender: @${senderNum}

📝 Old Message:
${oldText}

✏️ New Message:
${newText}`;
            } else {
                editedInfo = `-- AntiEdit Detected --

⏱️ Time: ${time}
📂 Edited by: @${senderNum}
👤 Sender: @${senderNum}

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
                    message: updateData.message
                },
                oldData.jid
            );
        }
    } catch (err) {
        console.log("AntiEdit Error:", err);
    }
}

module.exports = { handleEdit };