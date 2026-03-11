const fs = require('fs'),
      zlib = require('zlib');
      path = require('path'), 
      axios = require('axios'),
      sessionDir = path.join(__dirname, 'sessions'),
      credsPath = path.join(sessionDir, 'creds.json'),
      createDirIfNotExist = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(sessionDir);

async function loadSession() {
    try {
        if (fs.existsSync(sessionPath)) {
            fs.unlinkSync(sessionPath);
            console.log("[♻️] Old Session Removed");
        }

        if (!config.SESSION_ID || typeof config.SESSION_ID !== 'string') {
            throw new Error("[🔴] SESSION_ID is missing or invalid");
        }

        const [header, b64data] = config.SESSION_ID.split('~');

        if (header !== "Gifted" || !b64data) {
            throw new Error("[🔴] Invalid session format. Expected 'Gifted~.....'");
        }

        const cleanB64 = b64data.replace('...', '');
        const compressedData = Buffer.from(cleanB64, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);

        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        fs.writeFileSync(credsPath, decompressedData, "utf8");
        console.log("[🟢] New Session Loaded Successful");

    } catch (e) {
        console.error("[🔴] Session Error:", e.message);
        throw e;
    }
}

module.exports = { loadSession }

