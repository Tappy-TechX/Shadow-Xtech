const store = new Map();

/**
 * Save message
 */
function saveMessage(msg, jid) {
    if (!msg?.key?.id || !msg?.message) return;

    store.set(msg.key.id, {
        jid,
        message: msg,
        time: Date.now()
    });
}

/**
 * Get stored message
 */
function loadMessage(id) {
    return store.get(id);
}

/**
 * Delete manually
 */
function deleteMessage(id) {
    store.delete(id);
}

/**
 * Cleanup after 24hrs
 */
setInterval(() => {
    const now = Date.now();

    for (const [id, data] of store.entries()) {
        if (now - data.time > 1000 * 60 * 60 * 24) {
            store.delete(id);
        }
    }
}, 1000 * 60 * 10);

module.exports = {
    saveMessage,
    loadMessage,
    deleteMessage
};