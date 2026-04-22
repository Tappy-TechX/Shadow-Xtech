const store = new Map();

/**
 * Save message with timestamp
 */
function saveMessage(msg, jid) {
    if (!msg?.key?.id) return;

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
 * Delete message
 */
function deleteMessage(id) {
    store.delete(id);
}

/**
 * Auto cleanup 
 */
setInterval(() => {
    const now = Date.now();

    for (const [id, data] of store.entries()) {
        if (now - data.time > 1000 * 60 * 60) { // 1 hour
            store.delete(id);
        }
    }
}, 1000 * 60 * 10);

module.exports = {
    store,
    saveMessage,
    loadMessage,
    deleteMessage,
};