const config = require("../config");
const axios = require("axios");

// Stores emojis per userId
const userEmojis = {};

/**
 * Pick a random item from an array
 * @param {Array} arr
 * @returns {*}
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Auto-react to messages in channels
 * Handles multiple users with separate emoji sets
 * @param {object} conn - WhatsApp connection
 * @param {string} userId - Optional user ID for custom emojis
 */
async function autoReact(conn, userId = null) {
    conn.ev.on("messages.upsert", async (msgUpsert) => {
        const messages = msgUpsert.messages;

        for (const m of messages) {
            if (!m.key.fromMe) {

                // Only react in channels
                if (!m.key.remoteJid.endsWith("-broadcast")) continue;

                // Default emojis from config
                let emojisToUse = config.CHANNEL_REACT_EMOJI.split(",");

                // Use user-specific emojis if set
                if (userId && userEmojis[userId]) {
                    emojisToUse = userEmojis[userId];
                }

                // Pick a single emoji for this message
                const emoji = emojisToUse.length === 1 ? emojisToUse[0] : pickRandom(emojisToUse);

                try {
                    await conn.sendMessage(m.key.remoteJid, {
                        react: { text: emoji, key: m.key }
                    });

                    // Optionally react to commands
                    if (config.CHANNEL_REACT === "true" && m.message?.conversation?.startsWith(".")) {
                        const cmdEmoji = emojisToUse.length === 1 ? emojisToUse[0] : pickRandom(emojisToUse);
                        await conn.sendMessage(m.key.remoteJid, {
                            react: { text: cmdEmoji, key: m.key }
                        });
                    }
                } catch (err) {
                    console.error("🔴 Channel React Error:", err);
                }
            }
        }
    });
}

/**
 * Set user-specific emojis
 * @param {string} userId
 * @param {string[]} emojis
 */
function setUserEmojis(userId, emojis) {
    userEmojis[userId] = emojis;
}

/**
 * Simple GET request wrapper
 * @param {string} url
 * @param {object} options
 * @returns {Promise<any>}
 */
async function fetchData(url, options = {}) {
    try {
        const res = await axios.get(url, options);
        return res.data;
    } catch (err) {
        console.error("📂 Fetch error:", err.message);
        return null;
    }
}

module.exports = { autoReact, setUserEmojis, fetchData };