const config = require("../config");
const { getAnti } = require("../data/antiedit");
const { getDB } = require("./db");

const store = new Map();

// save message
function saveMessage(id, msg) {
    store.set(id, msg);
}

function getMessage(id) {
    return store.get(id);
}

// check enabled
async function isEnabled(chatId) {
    const isGroup = chatId.endsWith("@g.us");

    if (isGroup) return await getAnti("gc");
    return await getAnti("dm");
}

// handler
async function handleEdit(conn, updates) {
    if (!updates.messages) return;

    for (const msg of updates.messages) {
        if (!msg.message) continue;

        const id = msg.key.id;
        const chatId = msg.key.remoteJid;

        const oldMsg = getMessage(id);
        if (!oldMsg) continue;

        const oldText =
            oldMsg.message?.conversation ||
            oldMsg.message?.extendedTextMessage?.text ||
            "";

        const newText =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (!oldText || oldText === newText) continue;

        const enabled = await isEnabled(chatId);
        if (!enabled) continue;

        const sender = msg.key.participant || msg.key.remoteJid;
        const time = new Date().toLocaleString();

        let editedInfo;

        if (chatId.endsWith("@g.us")) {
            editedInfo = `-- Antiedit Detected --

⏱️ Time: ${time}
🟢 Group: ${chatId}
📂 Edited by: @${sender.split("@")[0]}
👤 Sender: @${sender.split("@")[0]}

📝 Old Message:
${oldText}

✏️ New Message:
${newText}`;
        } else {
            editedInfo = `-- Antiedit Detected --

⏱️ Time: ${time}
📂 Edited by: @${sender.split("@")[0]}
👤 Sender: @${sender.split("@")[0]}

📝 Old Message:
${oldText}

✏️ New Message:
${newText}`;
        }

        await conn.sendMessage(chatId, {
            text: editedInfo,
            mentions: [sender]
        });
    }
}

module.exports = {
    saveMessage,
    getMessage,
    handleEdit
};