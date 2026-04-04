const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { cmd } = require('../command');
const config = require('../config');

const AUDD_API_KEY = '9c76cbc93b23b3cf8732264977ad470e'; // Replace with your key

cmd({
    pattern: "shazam",
    alias: ["musicid", "findsong"],
    use: '.shazam (reply to audio)',
    desc: "Identify music from audio using Shazam API",
    category: "media",
    react: "🎧",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const mime = (quoted?.mimetype || "");
        if (!quoted || !mime.includes("audio")) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🎵 Please reply to an audio or voice note.*");
        }

        // React while processing
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

        const { title, artist, album, release_date, label, spotify, apple_music } = result;

        // Get thumbnail
        const thumbnail = spotify?.album?.images?.[0]?.url || apple_music?.artwork?.url || null;

        const msg = `
┏━━━ ･｡ﾟ☆: *.☽ .* :☆ﾟ. ━━━┓
    🎵 *Song Recognized* 🎵
┗━━━ ･｡ﾟ☆: *.☽ .* :☆ﾟ. ━━━┛

🎧 *Title   : ${title}*
👤 *Artist  : ${artist}*
💽 *Album   : ${album || 'N/A'}*
📅 *Release : ${release_date || 'N/A'}*
🏷️ *Label   : ${label || 'N/A'}*

${spotify?.external_urls?.spotify ? `🔗 ${spotify.external_urls.spotify}` : ''}
        `.trim();

        // Send the message with thumbnail if available
        if (thumbnail) {
            await conn.sendMessage(from, { 
                image: { url: thumbnail }, 
                caption: msg 
            });
        } else {
            reply(msg);
        }

        // Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Shazam Command Error:", e);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply(`*🔴 An error occurred: ${e.message}*`);
    }
});