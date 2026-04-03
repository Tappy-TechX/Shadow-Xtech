const messages = new Map();

function saveMessage(mek, jid) {
    if (!mek?.key?.id) return;

    messages.set(mek.key.id, {
        message: mek,
        jid: jid
    });
}

function loadMessage(id) {
    return messages.get(id);
}

module.exports = { saveMessage, loadMessage };