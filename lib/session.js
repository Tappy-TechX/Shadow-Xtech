const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const axios = require('axios');

// 
const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

// 
const createDirIfNotExist = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// 
createDirIfNotExist(sessionDir);

/*
 */
async function loadSession(config) {
    try {
        // 
        if (fs.existsSync(credsPath)) {
            fs.unlinkSync(credsPath);
            console.log("♻️ Old Session Removed");
        }

        // 
        if (!config || !config.SESSION_ID || typeof config.SESSION_ID !== 'string') {
            throw new Error("SESSION_ID is missing or invalid in your config");
        }

        // 
        const parts = config.SESSION_ID.split('~');
        if (parts.length < 2 || parts[0] !== "Gifted") {
            throw new Error("Invalid session format. Must start with 'Gifted~'");
        }

        const b64data = parts[1];
        
        // 
        const cleanB64 = b64data.replace(/\./g, ''); 
        
        // 
        const compressedData = Buffer.from(cleanB64, 'base64');
        
        // 
        const decompressedData = zlib.gunzipSync(compressedData);

        // 
        fs.writeFileSync(credsPath, decompressedData, "utf8");
        
        console.log("🟢 New Session Loaded Successfully");
        return true;

    } catch (e) {
        console.error("🔴 Session Error:", e.message);
        // We throw the error so the main process knows the session failed to load
        throw e; 
    }
}

module.exports = { loadSession };
