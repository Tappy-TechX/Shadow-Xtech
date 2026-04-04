const axios = require('axios');      
const { cmd } = require('../command');      

cmd({      
    pattern: "movie",      
    desc: "Fetch detailed information about a movie using OMDb API.",      
    category: "utility",      
    react: "🎬",      
    filename: __filename      
},      
async (conn, mek, m, { from, reply, sender, args }) => {      
    try {      
        // ⏳ Loading reaction      
        await conn.sendMessage(from, {       
            react: { text: "⏳", key: mek.key }       
        });

        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();      
              
        if (!movieName) {      
            // ❌ Error reaction      
            await conn.sendMessage(from, {       
                react: { text: "❌", key: mek.key }       
            });
            return reply("📽️ Please provide the name of the movie.\nExample: .movie Iron Man");      
        }      
      
        // OMDb API Key      
        const omdbApiKey = "3f33b64e";      
        const movieRes = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${omdbApiKey}&plot=full`);      
        const movie = movieRes.data;      
      
        if (!movie || movie.Response === "False") {      
            // ❌ Error reaction      
            await conn.sendMessage(from, {       
                react: { text: "❌", key: mek.key }       
            });
            return reply("🚫 Movie not found. Please check the name and try again.");      
        }      
      
        // Extract Rotten Tomatoes rating      
        const rtRating = movie.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value || 'N/A';      
      
        const dec = `      
🎬 *${movie.Title}* (${movie.Year}) ${movie.Rated || ''}      

⭐ *IMDb:* ${movie.imdbRating || 'N/A'} | 🍅 *Rotten Tomatoes:* ${rtRating} | 💰 *Box Office:* ${movie.BoxOffice || 'N/A'}      

📅 *Released:* ${movie.Released}      
⏳ *Runtime:* ${movie.Runtime}      
🎭 *Genre:* ${movie.Genre}      

📝 *Plot:* ${movie.Plot}      

🎥 *Director:* ${movie.Director}      
✍️ *Writer:* ${movie.Writer}      
🌟 *Actors:* ${movie.Actors}      

🌍 *Country:* ${movie.Country}      
🗣️ *Language:* ${movie.Language}      
🏆 *Awards:* ${movie.Awards || 'None'}      

[View on IMDb](https://www.imdb.com/title/${movie.imdbID}/)      
`;      

        // ✅ Success reaction      
        await conn.sendMessage(from, {       
            react: { text: "✅", key: mek.key }       
        });

        await conn.sendMessage(      
            from,      
            {      
                image: {       
                    url: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://files.catbox.moe/4ggu0a.jpg'      
                },      
                caption: dec,      
                contextInfo: {      
                    mentionedJid: [sender],      
                    forwardingScore: 999,      
                    isForwarded: true,      
                    forwardedNewsletterMessageInfo: {      
                        newsletterJid: '120363369453603973@newsletter',      
                        newsletterName: '𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ',      
                        serverMessageId: 143      
                    }      
                }      
            },      
            { quoted: mek }      
        );      
      
    } catch (e) {      
        console.error('Movie command error:', e);      
        // ❌ Error reaction      
        await conn.sendMessage(from, {       
            react: { text: "❌", key: mek.key }       
        });
        reply(`❌ Error: ${e.message}`);      
    }      
});