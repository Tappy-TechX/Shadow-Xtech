const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { cmd } = require('../command');
const config = require('../config');

const AUDD_API_KEY = '9c76cbc93b23b3cf8732264977ad470e';

cmd({
    pattern: "shazam",
    alias: ["musicid", "findsong"],
    use: '.shazam (reply audio OR song name)',
    desc: "Identify music from audio or search by name",
    category: "media",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {

        const mime = quoted?.mimetype || "";

        // =========================
        // AUDIO SHAZAM
        // =========================
        if (quoted && mime.includes("audio")) {

            await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

            const audioBuffer = await quoted.download();
            const tempPath = './temp_song.mp3';
            fs.writeFileSync(tempPath, audioBuffer);

            const form = new FormData();
            form.append('api_token', AUDD_API_KEY);
            form.append('file', fs.createReadStream(tempPath));
            form.append('return', 'apple_music,spotify');

            const res = await axios.post('https://api.audd.io/', form, {
                headers: form.getHeaders()
            });

            fs.unlinkSync(tempPath);

            const result = res.data.result;

            if (!result) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("*🔴 No match found for this audio.*");
            }

            const title = result.title || "Unknown Title";
            const artist = result.artist || "Unknown Artist";
            const album = result.album || "N/A";
            const year = result.release_date?.split("-")[0] || "N/A";
            const label = result.label || "N/A";

            const songName = `${title} by ${artist}`;

            const thumbnail =
                result.spotify?.album?.images?.[0]?.url ||
                result.apple_music?.artwork?.url ||
                null;

            const msg = `
🎵 *Shazam Result*

🎧 ${songName}
💽 Album: ${album}
📅 Year : ${year}
🏷️ Label: ${label}

🔎 Source: Shazam (Audd.io)
            `.trim();

            if (thumbnail) {
                await conn.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: msg
                });
            } else {
                reply(msg);
            }

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            return;
        }

        // =========================
        // SONG NAME SEARCH
        // =========================
        if (q) {

            await conn.sendMessage(from, { react: { text: "🔎", key: mek.key } });

            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=1`;
            const res = await axios.get(url);

            const data = res.data.results?.[0];

            if (!data) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("*🔴 No song found for that name.*");
            }

            const songName = `${data.trackName} by ${data.artistName}`;

            const msg = `
🎵 *Song Result*

🎧 ${songName}
💽 Album: ${data.collectionName}
📅 Year : ${data.releaseDate?.split("T")[0] || "N/A"}
▶️ Preview Available

🔎 Source: iTunes Search
            `.trim();

            if (data.artworkUrl100) {
                await conn.sendMessage(from, {
                    image: { url: data.artworkUrl100 },
                    caption: msg
                });
            } else {
                reply(msg);
            }

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            return;
        }

        // =========================
        // NO INPUT
        // =========================
        return reply("*🎧 Reply to an audio OR type a song name.*");

    } catch (e) {
        console.error("Shazam Command Error:", e);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply(`*🔴 Error: ${e.message}*`);
    }
});