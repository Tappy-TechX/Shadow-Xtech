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
        if (!q) return reply("🎶 **Oops! No tune in mind?** Please tell me the song name or drop a YouTube link so I can fetch your rhythm! 🎵");

        await reply("🔍 **Curating your audio experience...** Please bear with me as I locate the perfect track. 🎼");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ **Melody not found.** I regret to inform you that the requested track could not be located. Perhaps a different query would yield results? 😔");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

        await reply(`✨ **Track located!** Preparing to download "${song.title}" for your enjoyment. This process may require a brief moment. 🚀`);

        // Fetch song data concurrently
        let [songRes] = await Promise.all([
            fetch(apiUrl).then((res) => res.json())
        ]);

        if (!songRes?.result?.downloadUrl) return reply("⚠️ **A slight interruption occurred.** The download link seems to have encountered an issue. Please attempt your request again shortly. 🤷‍♀️");

        await conn.sendMessage(from, {
            audio: { url: songRes.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    // Enhanced "Fancy Box" details
                    title: `🎶 ${song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title} 🎵`, // Added emojis
                    body: `Artist: ${song.author}\nViews: ${song.views}\nDuration: ${song.timestamp}\n\nTap to discover more tunes!`, // More song info + call to action
                    mediaType: 1, // 1 for image, 2 for video (though we're sending audio, this is for the preview)
                    thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'), // Higher quality thumbnail
                    sourceUrl: song.url, // Link directly to the YouTube video of the song
                    renderLargerThumbnail: true, // Make the thumbnail prominent
                    showAdAttribution: false // Often makes the "Ad" label disappear, which can look cleaner
                }
            }
        }, { quoted: mek });

        await reply("✅ **Your song is ready!** May the rhythm and melody bring you immense pleasure. 🎧\n\n_For exclusive updates, consider joining our WhatsApp Channel! https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10");

    } catch (error) {
        console.error(error);
        reply("💔 **An unforeseen error has occurred.** My sincerest apologies, the music playback has been interrupted. Kindly try again at your earliest convenience. 😥");
    }
});
