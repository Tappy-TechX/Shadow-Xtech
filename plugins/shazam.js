const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

// ⚠️ Put your keys here (better: use config/env)
const ACCESS_KEY = "c6b73f307c6cc612ff825f5eb55b0c76";
const ACCESS_SECRET = "V8nn0YB64esfYk4E4yfscfVabQBSNCcJvPHaPDHk";
const HOST = "identify-eu-west-1.acrcloud.com"; // change if your region differs

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join("\n");
}

function sign(signString, secret) {
    return crypto.createHmac('sha1', secret)
        .update(Buffer.from(signString, 'utf-8'))
        .digest().toString('base64');
}

cmd({
    pattern: "shazam",
    alias: ["musicid", "findsong"],
    desc: "Identify songs using ACRCloud",
    category: "music",
    filename: __filename
},
async (conn, mek, m, { reply }) => {

    try {

        const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage;

        if (!quoted || !quoted.audioMessage && !quoted.videoMessage) {
            return reply("🎧 Reply to an audio/voice note to identify song");
        }

        reply("🎵 Identifying song...");

        const filePath = await conn.downloadAndSaveMediaMessage(m.quoted || m);

        const timestamp = Math.floor(Date.now() / 1000);

        const dataType = "audio";
        const signatureVersion = "1";
        const httpMethod = "POST";
        const httpUri = "/v1/identify";

        const stringToSign = buildStringToSign(
            httpMethod,
            httpUri,
            ACCESS_KEY,
            dataType,
            signatureVersion,
            timestamp
        );

        const signature = sign(stringToSign, ACCESS_SECRET);

        const form = new FormData();
        form.append("sample", fs.createReadStream(filePath));
        form.append("access_key", ACCESS_KEY);
        form.append("data_type", dataType);
        form.append("signature_version", signatureVersion);
        form.append("signature", signature);
        form.append("timestamp", timestamp);

        const res = await axios.post(`https://${HOST}/v1/identify`, form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(filePath);

        const music = res.data?.metadata?.music?.[0];

        if (!music) return reply("❌ No song found");

        reply(
`🎵 SONG FOUND!

🎶 Title: ${music.title}
👤 Artist: ${music.artists?.map(a => a.name).join(", ")}
💿 Album: ${music.album?.name || "Unknown"}
📅 Year: ${music.release_date || "Unknown"}`
        );

    } catch (err) {
        console.log(err.response?.data || err.message);
        reply("⚠️ Error identifying song");
    }
});