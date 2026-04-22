const config = require("../config");
const { getAnti } = require("../data/antiedit");

const store = new Map();

// save original message
function saveMessage(id, msg) {
    store.set(id, msg);
}

// retrieve old message
function getMessage(id) {
    return store.get(id);
}

// check if enabled
async function isEnabled(chatId) {
    try {
        const isGroup = chatId.endsWith("@g.us");

        const dbStatus = await getAnti(
            isGroup ? "gc" : "dm"
        );

        if (
            typeof dbStatus === "boolean"
        ) {
            return dbStatus;
        }

        return config.ANTI_EDIT === "true";
    } catch {
        return config.ANTI_EDIT === "true";
    }
}

// extract text helper
function extractText(message) {
    return (
        message?.conversation ||
        message?.extendedTextMessage?.text ||
        message?.imageMessage?.caption ||
        message?.videoMessage?.caption ||
        ""
    );
}

// detect edits
async function handleEdit(conn, updates) {
    try {
        for (const update of updates) {
            if (
                !update.update?.message
            )
                continue;

            const protocol =
                update.update.message
                    ?.protocolMessage;

            if (!protocol) continue;

            // type 14 = edited message
            if (
                protocol.type !== 14
            )
                continue;

            const originalMessageId =
                protocol.key?.id;

            if (!originalMessageId)
                continue;

            const oldMsg =
                getMessage(
                    originalMessageId
                );

            if (!oldMsg) continue;

            const chatId =
                update.key.remoteJid;

            const enabled =
                await isEnabled(
                    chatId
                );

            if (!enabled) continue;

            const oldText =
                extractText(
                    oldMsg.message
                );

            const newText =
                extractText(
                    protocol.editedMessage
                );

            if (
                !oldText ||
                !newText
            )
                continue;

            if (
                oldText === newText
            )
                continue;

            const sender =
                update.key
                    .participant ||
                update.key
                    .remoteJid;

            const time =
                new Date().toLocaleString();

            let editedInfo;

            if (
                chatId.endsWith(
                    "@g.us"
                )
            ) {
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

            await conn.sendMessage(
                chatId,
                {
                    text: editedInfo,
                    mentions: [sender]
                }
            );
        }
    } catch (err) {
        console.log(
            "AntiEdit Error:",
            err
        );
    }
}

module.exports = {
    saveMessage,
    getMessage,
    handleEdit
};