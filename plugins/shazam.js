const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const AUDD_API_KEY = '9c76cbc93b23b3cf8732264977ad470e';

cmd({
    pattern: "shazam",
    alias: ["musicid", "findsong"],
    desc: "Identify songs using AudD API",
    category: "music",
    filename: __filename
},
async (conn, mek, m, { reply, q }) => {

    try {

        // =========================
        // 1. Reply to audio/video
        // =========================
        const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage;

        if (quoted && (quoted.audioMessage || quoted.videoMessage)) {

            reply("🎧 Identifying song... please wait");

            const filePath = await conn.downloadAndSaveMediaMessage(m.quoted || m);

            const form = new FormData();
            form.append("file", fs.createReadStream(filePath));
            form.append("api_token", AUDD_API_KEY);
            form.append("return", "apple_music,spotify");

            const res = await axios.post("https://api.audd.io/", form, {
                headers: form.getHeaders()
            });

            fs.unlinkSync(filePath);

            const data = res.data.result;

            if (!data) return reply("❌ No song found");

            return reply(
`🎵 Song Found!

🎶 Title: ${data.title}
👤 Artist: ${data.artist}
💿 Album: ${data.album || "Unknown"}
📅 Release: ${data.release_date || "Unknown"}

🔗 Spotify: ${data.spotify?.external_urls?.spotify || "N/A"}
🍎 Apple Music: ${data.apple_music?.url || "N/A"}`
            );
        }

        // =========================
        // 2. Text search fallback
        // =========================
        if (!q) return reply("❗ Reply to a voice note or type a song name");

        reply("🔍 Searching song...");

        const response = await axios.post("https://api.audd.io/", {
            api_token: AUDD_API_KEY,
            q: q
        });

        const result = response.data.result;

        if (!result) return reply("❌ No match found");

        return reply(
`🎵 Song Found!

🎶 Title: ${result.title}
👤 Artist: ${result.artist}
💿 Album: ${result.album || "Unknown"}

🔗 Spotify: ${result.spotify?.external_urls?.spotify || "N/A"}`
        );

    } catch (err) {
        console.log(err);
        reply("⚠️ Error identifying song");
    }
});