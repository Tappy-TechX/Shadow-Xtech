const store = new Map();

/**
 * Save message with metadata
 */
function saveMessage(msg, jid) {
    if (!msg?.key?.id || !msg.message) return;

    store.set(msg.key.id, {
        jid,
        message: msg,
        time: Date.now()
    });
}

/**
 * Load message
 */
function loadMessage(id) {
    return store.get(id);
}

/**
 * Delete message manually
 */
function deleteMessage(id) {
    store.delete(id);
}

/**
 * Auto cleanup (prevents memory leak)
 */
setInterval(() => {
    const now = Date.now();

    for (const [id, data] of store.entries()) {
        if (now - data.time > 1000 * 60 * 60) {
            store.delete(id);
        }
    }
}, 1000 * 60 * 10);

module.exports = {
    store,
    saveMessage,
    loadMessage,
    deleteMessage
};