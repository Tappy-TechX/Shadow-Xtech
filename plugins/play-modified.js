const fetch = require('node-fetch');    
const yts = require('yt-search');    
const { cmd } = require('../command');    

cmd({    
    pattern: "play2",    
    alias: ["song", "play"],    
    desc: "Download audio from YouTube",    
    category: "downloader",    
    react: "🎵",    
    filename: __filename    
},    
async (conn, mek, m, { from, q, reply }) => {    
    try {    
        if (!q) {    
            return reply(`🎵 *DML Music Engine* 🎵

⚠️ You didn't provide a song name or YouTube link.
Send a query like:
• .play2 [song name]
• .play2 [YouTube link]

Let's get your music going! 🚀`);    
        }    
    
        // React loading    
        await conn.sendMessage(from, {    
            react: { text: '⌛', key: mek.key }    
        });    
    
        const isYoutubeLink =    
            /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)?)([a-zA-Z0-9_-]{11})/i.test(q);    
    
        let videoUrl = q;    
        let title = 'Unknown Song';    
        let thumbnail = '';    
        let duration = '';    
    
        // Search YouTube if not a link    
        if (!isYoutubeLink) {    
            const search = await yts(q);    
    
            if (!search?.videos?.length) {    
                await conn.sendMessage(from, {    
                    react: { text: '❌', key: mek.key }    
                });    
    
                return reply(`🔎 No results found for "${q}".  
Try using different keywords or include the artist name.`);    
            }    
    
            const video = search.videos[0];    
            videoUrl = video.url;    
            title = video.title;    
            thumbnail = video.thumbnail;    
            duration = video.timestamp;    
        }     
        // If the query is a YouTube link    
        else {    
            const id = q.match(/([a-zA-Z0-9_-]{11})/i)?.[1];    
            const search = await yts({ videoId: id });    
    
            if (search) {    
                title = search.title || title;    
                thumbnail = search.thumbnail || '';    
                duration = search.timestamp || '';    
                videoUrl = search.url || q;    
            }    
        }    
    
        // Fetch audio via API    
        const apiUrl = `https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(videoUrl)}&quality=128`;    
    
        let data;    
        try {    
            const res = await fetch(apiUrl);    
            const text = await res.text();    
            data = JSON.parse(text);    
        } catch (e) {    
            throw new Error("Unable to fetch the audio. Please try again later.");    
        }    
    
        const result = data.result || data.results || data;    
        const audioUrl =    
            result?.download_url ||    
            result?.downloadUrl ||    
            result?.url ||    
            result?.audio ||    
            result?.link;    
    
        title = result?.title || result?.name || title;    
        thumbnail = result?.thumbnail || result?.image || thumbnail;    
    
        if (!audioUrl) {    
            await conn.sendMessage(from, {    
                react: { text: '❌', key: mek.key }    
            });    
    
            return reply(`❌ Unable to download "${title}".  
It might be unavailable or the API couldn't fetch it.`);    
        }    
    
        const safeTitle = title.replace(/[<>:"/\\|?*]/g, "_").trim();    
    
        // React success    
        await conn.sendMessage(from, {    
            react: { text: '✅', key: mek.key }    
        });    
    
        // Send audio    
        await conn.sendMessage(from, {    
            audio: { url: audioUrl },    
            mimetype: 'audio/mpeg',    
            fileName: `${safeTitle}.mp3`,    
            ptt: false,    
            contextInfo: thumbnail ? {    
                externalAdReply: {    
                    title: safeTitle.substring(0, 40),    
                    body: duration ? `Duration: ${duration}` : "DML Music",    
                    thumbnailUrl: thumbnail,    
                    sourceUrl: videoUrl,    
                    mediaType: 1,    
                    renderLargerThumbnail: true    
                }    
            } : {}    
        }, { quoted: mek });    
    
        // Send document with details    
        await conn.sendMessage(from, {    
            document: { url: audioUrl },    
            mimetype: 'audio/mpeg',    
            fileName: `${safeTitle}.mp3`,    
            caption: `🎶 *Now Playing:* ${safeTitle}
${duration ? `⏱️ Duration: ${duration}\n` : ''}✅ Download successful
📀 Format: MP3
🎚️ Quality: 128kbps

Enjoy your music! 🎧`    
        }, { quoted: mek });    
    
    } catch (err) {    
        console.error("Play2 Error:", err);    
        await conn.sendMessage(from, {    
            react: { text: '❌', key: mek.key }    
        });    
        reply(`🚨 Something went wrong while processing your request.  
Error: ${err.message}`);    
    }    
});