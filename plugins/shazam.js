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

        // ==============================
        // FIXED QUOTED HANDLING
        // ==============================
        const msgQuoted = quoted || m.quoted || m;
        const mime = msgQuoted?.mimetype || msgQuoted?.msg?.mimetype || "";

        const isAudio =
            mime.includes("audio") ||
            mime.includes("ogg") ||
            mime.includes("voice");

        // ==============================
        // 1. AUDIO SHAZAM MODE
        // ==============================
        if (msgQuoted && isAudio) {

            await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

            const audioBuffer = await msgQuoted.download();

            if (!audioBuffer) {
                return reply("❌ Unable to read audio file.");
            }

            const tempPath = `./temp_song_${Date.now()}.mp3`;
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

            const {
                title,
                artist,
                album,
                release_date,
                label,
                spotify,
                apple_music
            } = result;

            const thumbnail =
                spotify?.album?.images?.[0]?.url ||
                apple_music?.artwork?.url ||
                null;

            const msg = `
🎵 *Song Found*

🎧 Title  : ${title}
👤 Artist : ${artist}
💽 Album  : ${album || 'N/A'}
📅 Year   : ${release_date || 'N/A'}
🏷️ Label  : ${label || 'N/A'}

${spotify?.external_urls?.spotify ? `🔗 ${spotify.external_urls.spotify}` : ''}
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

        // ==============================
        // 2. SONG NAME SEARCH MODE
        // ==============================
        if (q) {

            await conn.sendMessage(from, { react: { text: "🔎", key: mek.key } });

            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=1`;
            const res = await axios.get(url);

            const data = res.data.results?.[0];

            if (!data) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("*🔴 No song found for that name.*");
            }

            const msg = `
🎵 *Song Search Result*

🎧 Title  : ${data.trackName}
👤 Artist : ${data.artistName}
💽 Album  : ${data.collectionName}
📅 Year   : ${data.releaseDate?.split("T")[0] || "N/A"}
🔗 Preview: ${data.previewUrl || "N/A"}
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

        // ==============================
        // 3. NO INPUT
        // ==============================
        return reply("*🎧 Reply to an audio OR type a song name.*");

    } catch (err) {
        console.error("SHZAM ERROR:", err);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply(`*🔴 Error: ${err.message}*`);
    }
});