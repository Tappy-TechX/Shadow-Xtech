const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or video name.");
        
        const yt = await ytsearch(q); // Search for video in parallel
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        // Start the API fetch concurrently
        let [videoRes] = await Promise.all([
            fetch(apiUrl).then((res) => res.json())  // Fetch the video data
        ]);
        
        if (videoRes.status !== 200 || !videoRes.success || !videoRes.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *Shadow-Xtech Video Downloader*
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}
> Powered by Shadow-Xtech 🩷`;

        // Send video directly with caption
        await conn.sendMessage(
            from, 
            { 
                video: { url: videoRes.result.download_url }, 
                caption: ytmsg,
                mimetype: "video/mp4"
            }, 
            { quoted: mek }
        );
    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});

// MP3 song download - Optimized for faster response

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
cmd({
    pattern: "song",
    alias: ["play", "mp3"],
    react: "🎧",
    desc: "Download YouTube song",
    category: "main",
    use: '.song <query>',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        // Classier reply when no query is provided
        if (!q) {
            return reply("🎶 **Awaiting your selection!** Please provide the song title or a YouTube link, and I shall fetch your desired melody. 🎵");
        }

        // Classier reply indicating the search process has started
        await reply("🔍 **Curating your audio experience...** Please bear with me as I locate the perfect track. 🎼");

        // Fetch search results from YouTube
        const yt = await ytsearch(q);

        // Classier reply if no results are found
        if (!yt || !yt.results || yt.results.length === 0) {
            return reply("❌ **Melody not found.** I regret to inform you that the requested track could not be located. Perhaps a different query would yield results? 😔");
        }

        const song = yt.results[0];

        // Construct the API URL for downloading the song.
        const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(song.title)}`;

        // Classier reply when the song is found and preparation begins
        await reply(`✨ **Track located!** Preparing to download "${song.title}" for your enjoyment. This process may require a brief moment. 🚀`);

        // Fetch song data from the API.
        let [songRes] = await Promise.all([
            fetch(apiUrl).then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
        ]);

        // Classier reply if the download URL is not available
        if (!songRes?.result?.downloadUrl) {
            console.error("API response missing downloadUrl:", songRes);
            return reply("⚠️ **A slight interruption occurred.** The download link seems to have encountered an issue. Please attempt your request again shortly. 🤷‍♀️");
        }

        // Send the audio message with the specified context information.
        await conn.sendMessage(from, {
            audio: { url: songRes.result.downloadUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${song.title}.mp3`, 
        }, { // Start of options object
            quoted: mek, 
            contextInfo: {
                // Enhanced "Fancy Box" details as provided in the latest prompt
                externalAdReply: {
                    title: `🎶 ${song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title} 🎵`, // Added emojis
                    body: `Artist: ${song.author}\nViews: ${song.views}\nDuration: ${song.timestamp}\n\nTap to discover more tunes!`, // More song info + call to action
                    mediaType: 1, 
                    // Using a higher quality thumbnail if available.
                    thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
                    sourceUrl: song.url, 
                    renderLargerThumbnail: true, 
                    showAdAttribution: false 
                }
            },
            // Added context information as requested by the user
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363369453603973@newsletter',
              newsletterName: "ֆཏɑɖօա-𝕏Ե𝖾𝖼ཏ", 
              serverMessageId: 143 
            }
        }); 
        // Classier reply upon successful sending of the song
        await reply(`✅ **Your song is ready!** May the rhythm and melody bring you immense pleasure. 🎧\n\n_For exclusive updates, consider joining our WhatsApp Channel! ${whatsappChannelLink}_`);

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error in song command:", error);
        // Classier reply for any errors that occur during the process
        reply("💔 **An unforeseen error has occurred.** My sincerest apologies, the music playback has been interrupted. Kindly try again at your earliest convenience. 😥");
    }
});
