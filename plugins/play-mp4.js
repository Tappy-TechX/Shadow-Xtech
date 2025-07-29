const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

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
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        let [videoRes] = await Promise.all([
            fetch(apiUrl).then((res) => res.json())
        ]);
        
        if (videoRes.status !== 200 || !videoRes.success || !videoRes.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `
⎾⦿=======================================⏌
  ⚙️ SHADOW INTERCEPT — YT NODE CAPTURE
⎿==========================================⏋

  📡 STREAM TYPE     : YouTube/DataGrid
  🌐 DATA TRACE      : ${yts.url}
  🧾 SIGNAL STATUS   : 🟢 LINK VERIFIED

 ⧉ PACKET FEED
    🎬 TITLE          : ${yts.title}
    ⏳ LENGTH         : ${yts.timestamp}
    👀 VIEWS          : ${yts.views}
    👤 UPLOADER       : ${yts.author.name}

 🧬 UPLINK_ID        : shadow.yt.grid://ΨX7K1

⎾==========================================⏌
  ✅ MEDIA READY — TRANSMIT TO CLIENT
⎿==========================================⏋
`;

        await conn.sendMessage(
            from, 
            {
                video: { url: videoRes.result.download_url },
                caption: ytmsg,
                mimetype: "video/mp4",
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369453603973@newsletter',
                        newsletterName: 'ֆཏɑɖօա-𝕏Ե𝖾𝖼ཏ',
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🎥 YT Video Downloaded via SHADOW-XTECH",
                        body: "Fast. Clean. No Watermark.",
                        thumbnailUrl: yts.thumbnail,
                        sourceUrl: whatsappChannelLink,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
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
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply(`🎶 *Enter Track Name Or Link!* *Example:" *.song calm down*`);

        await reply(`🎧 *Scanning Music Grid...*🔍 *Query: "${q}"*`);

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply(`❌ *Track Not Found!* *Try A Different Song.*`);

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

        await reply(`⏳ *Downloading: ${song.title}* *🔄 Please wait a moment...*`);

        const songRes = await fetch(apiUrl).then(res => res.json());
        if (!songRes?.result?.downloadUrl) return reply(`🚫 *Download Failed!*\nTry again later.`);

        await conn.sendMessage(from, {
            audio: { url: songRes.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${song.title.length > 25 ? song.title.slice(0, 22) + "..." : song.title}`,
                    body: `🎙 ${song.author} • ⏱ ${song.timestamp} • 👁 ${song.views}`,
                    thumbnailUrl: song.thumbnail.replace("default.jpg", "hqdefault.jpg"),
                    sourceUrl: song.url,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }, { quoted: mek });

        await reply(`📥 *Media Downloaded Successful!* *🎧 Enjoy the frequency drop.*\n🔗 Join updates: https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10`);
        
    } catch (error) {
        console.error(error);
        reply(`💥 *SONIC ERROR!*\nSomething glitched. Retry shortly.`);
    }
});

cmd({
    pattern: "play3",
    alias: ["ytmp3", "music"],
    react: "🎵",
    desc: "Play song from YouTube",
    category: "main",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    if (!q) return reply(`🎵✨ *Hey buddy!* What song are you vibing to today?\nJust type the name and I’ll fetch the magic for you!`);

    try {
        const search = await yts(q);
        const link = search.all[0].url;

        const apis = [
            `https://xploader-api.vercel.app/ytmp3?url=${link}`,
            `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
            `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
            `https://api.dreaded.site/api/ytdl/audio?url=${link}`
        ];

        for (const api of apis) {
            try {
                const data = await fetchJson(api);

                if (data.status === 200 || data.success) {
                    const videoUrl = data.result?.downloadUrl || data.url;
                    const title = search.all[0].title.replace(/[^a-zA-Z0-9 ]/g, "");
                    const outputFileName = `${title}.mp3`;
                    const outputPath = path.join(__dirname, outputFileName);

                    const response = await axios({
                        url: videoUrl,
                        method: "GET",
                        responseType: "stream"
                    });

                    if (response.status !== 200) {
                        await reply("⚠️ *This API didn’t vibe well.* Trying the next one...");
                        continue;
                    }

                    ffmpeg(response.data)
                        .toFormat("mp3")
                        .save(outputPath)
                        .on("end", async () => {
                            await conn.sendMessage(from, {
                                document: { url: outputPath },
                                mimetype: "audio/mp3",
                                caption: `🎧 *Track Loaded Successfully!*\n\n🎶 _Here's your song served fresh from the cloud_ ☁️\n\n💌 *Shadow-Xtech* at your service!`,
                                fileName: outputFileName,
                            }, { quoted: mek });

                            fs.unlinkSync(outputPath);
                        })
                        .on("error", (err) => {
                            reply(`💥 *Audio tuning failed!*\n\n🔧 Error: *${err.message}*`);
                        });

                    return;
                }
            } catch (e) {
                continue;
            }
        }

        reply(`😢 *Yikes!* None of my magical APIs delivered a tune this time.\nPlease try again later or tweak the song title.`);
    } catch (error) {
        reply(`💔 *Oopsie!* Couldn't complete the download.\n\n🔧 *Error:* ${error.message}`);
    }
});