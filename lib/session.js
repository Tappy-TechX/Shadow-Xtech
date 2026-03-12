const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const axios = require('axios');

const sessionDir = path.join(__dirname, '..', 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function loadSession(SESSION_ID) {
    if (!SESSION_ID || typeof SESSION_ID !== 'string') {
        throw new Error('🌐 SESSION_ID is missing or invalid');
    }

    // Remove existing creds
    if (fs.existsSync(credsPath)) fs.unlinkSync(credsPath);

    const PREFIX = 'Gifted~';

    if (!SESSION_ID.startsWith(PREFIX)) {
        throw new Error(`🔴 Invalid session format. Expected to start with "${PREFIX}"`);
    }

    const payload = SESSION_ID.slice(PREFIX.length);

    // Detect short vs long session
    if (payload.length < 50) {
        // Short Session — fetch full session from server
        const serverUrl = `https://session.giftedtech.co.ke/session/${payload}`;
        const response = await axios.get(serverUrl, { timeout: 10000 });
        const fullSession = response.data;

        // fullSession is itself a long session string — recurse
        return loadSession(fullSession.trim());
    } else {
        // Long Session — decode zlib/base64 inline
        const compressedData = Buffer.from(payload, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, 'utf8');
        console.log('✅ Session loaded successfully');
    }
}

module.exports = { loadSession };