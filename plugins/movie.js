const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    desc: "Fetch movie details and send a downloadable trailer (or poster if no trailer).",
    category: "utility",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, args, react }) => {
    try {
        await react("♻️"); // Loading

        const movieName = args.join(' ') || m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        if (!movieName) return reply("📽️ Please provide the name of the movie.\nExample: .movie Iron Man");

        // --- OMDb API (free key) ---
        const omdbApiKey = "3f33b64e";
        const movieRes = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${omdbApiKey}&plot=full`);
        const movie = movieRes.data;

        if (!movie || movie.Response === "False") {
            await react("❌");
            return reply("🚫 Movie not found.");
        }

        // --- YouTube API (trailer search) ---
        const youtubeApiKey = "AIzaSyC5q5-OjpWQuKPTiDMJuP8bSlWtj1SIg_M";
        const ytSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movie.Title + " trailer")}&key=${youtubeApiKey}&type=video&maxResults=1`;
        const ytRes = await axios.get(ytSearchUrl);
        const videoId = ytRes.data.items[0]?.id?.videoId;

        // --- Build full movie info caption ---
        const caption = `
🎬 *${movie.Title}* (${movie.Year}) ${movie.Rated || ''}

⭐ *IMDb:* ${movie.imdbRating || 'N/A'} 
💰 *Box Office:* ${movie.BoxOffice || 'N/A'}
📅 *Released:* ${movie.Released || 'N/A'} 
⏳ *Runtime:* ${movie.Runtime || 'N/A'} 
🎭 *Genre:* ${movie.Genre || 'N/A'}

📝 *Plot:* ${movie.Plot || 'N/A'}

🎥 *Director:* ${movie.Director || 'N/A'} 
✍️ *Writer:* ${movie.Writer || 'N/A'} 
🌟 *Actors:* ${movie.Actors || 'N/A'}
🌍 *Country:* ${movie.Country || 'N/A'} 
🗣️ *Language:* ${movie.Language || 'N/A'} 
🏆 *Awards:* ${movie.Awards || 'N/A'}

${videoId ? `🎞️ Trailer: https://www.youtube.com/watch?v=${videoId}` : ''}

> © Powered By Shadow-Xtech
`.trim();

        if (videoId) {
            // --- Send trailer video (30s max) ---
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const tempFile = path.join(__dirname, `${videoId}_clip.mp4`);

            await new Promise((resolve, reject) => {
                ffmpeg(ytdl(videoUrl, { filter: 'audioandvideo', quality: 'highestvideo', highWaterMark: 1 << 25 }))
                    .setStartTime(0)
                    .duration(30) // 30 seconds max
                    .outputOptions(['-fs 16M']) // WhatsApp max file size ~16 MB
                    .output(tempFile)
                    .on('end', resolve)
                    .on('error', reject)
                    .run();
            });

            await conn.sendMessage(from, {
                video: { url: tempFile },
                caption: caption,
                mimetype: 'video/mp4'
            });

            fs.unlinkSync(tempFile); // Delete temp file
        } else {
            // --- Send poster if trailer unavailable ---
            await conn.sendMessage(from, {
                image: { url: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://files.catbox.moe/og4tsk.jpg' },
                caption: caption
            }, { quoted: mek });
        }

        await react("✅"); // Success
    } catch (e) {
        console.error('Movie command error:', e);
        await react("❌");
        reply(`❌ Error: ${e.message}`);
    }
});