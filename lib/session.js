const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const axios = require('axios');

// Determine the session directory relative to where this module is executed (assuming __dirname is inside ./lib/)
const sessionDir = path.join(__dirname, '..', 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

/**
 * Loads the WhatsApp session from a custom session string.
 * @param {string} SESSION_ID - The session string, expected to start with 'Gifted~'.
 * @returns {Promise<void>}
 */
async function loadSession(SESSION_ID) {
    if (!SESSION_ID || typeof SESSION_ID !== 'string') {
        throw new Error('🌐 SESSION_ID is missing or invalid in config.');
    }

    const PREFIX = 'Gifted~';

    if (!SESSION_ID.startsWith(PREFIX)) {
        throw new Error(`🔴 Invalid session format. Expected to start with "${PREFIX}"`);
    }

    const payload = SESSION_ID.slice(PREFIX.length);

    // Detect short vs long session
    if (payload.length < 50) {
        // Short Session — fetch full session from server
        console.log("♻️ Attempting to fetch full session from remote server...");
        const serverUrl = `https://session.giftedtech.co.ke/session/${payload}`;
        
        try {
            const response = await axios.get(serverUrl, { timeout: 15000 }); // Increased timeout for network operations
            
            if (!response.data || typeof response.data !== 'string') {
                 throw new Error("🔴 Received invalid or empty response data from session server.");
            }
            
            const fullSession = response.data.trim();

            // fullSession is itself a long session string — recurse to decode and save
            console.log("📂 Full session received. Decoding and saving...");
            await loadSession(fullSession);
            
        } catch (error) {
            console.error("🔴 Error fetching session from remote server:", error.message || error);
            throw new Error(`🔴 Failed to load session from short ID: ${error.message || 'Network Error'}`);
        }
    } else {
        // Long Session — decode zlib/base64 inline and save to creds.json
        try {
            const compressedData = Buffer.from(payload, 'base64');
            const decompressedData = zlib.gunzipSync(compressedData);
            fs.writeFileSync(credsPath, decompressedData, 'utf8');
            console.log('✅ Session loaded successfully and saved to session/creds.json');
        } catch (error) {
            console.error("🔴 Error decoding long session payload:", error);
            throw new Error(`🔴 Failed to decode long session payload: ${error.message}`);
        }
    }
}

module.exports = { loadSession };
