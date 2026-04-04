const fetch = require('node-fetch');
const yts = require('yt-search');
const { cmd } = require('../command');

// Store pending requests
const pending = new Map();

cmd({
    pattern: "play2",
    alias: ["song", "play"],
    desc: "Download audio from YouTube",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) {
            return reply(`🎵 *DML Music Engine* 🎵

⚠️ Provide a song name or YouTube link.
Example:
• .play2 Faded Alan Walker
• .play2 https://youtu.be/xxxx

Reply with 1 = Audio
Reply with 2 = Document`);
        }

        await conn.sendMessage(from, {
            react: { text: '⌛', key: mek.key }
        });

        const isYoutubeLink =
            /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)?)([a-zA-Z0-9_-]{11})/i.test(q);

        let videoUrl = q;
        let title = 'Unknown Song';
        let thumbnail = '';
        let duration = '';

        // SEARCH
        if (!isYoutubeLink) {
            const search = await yts(q);

            if (!search?.videos?.length) {
                return reply(`❌ No results found for "${q}"`);
            }

            const video = search.videos[0];
            videoUrl = video.url;
            title = video.title;
            thumbnail = video.thumbnail;
            duration = video.timestamp;
        } else {
            const id = q.match(/([a-zA-Z0-9_-]{11})/i)?.[1];
            const search = await yts({ videoId: id });

            if (search) {
                title = search.title || title;
                thumbnail = search.thumbnail || '';
                duration = search.timestamp || '';
                videoUrl = search.url || q;
            }
        }

        const apiUrl = `https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(videoUrl)}&quality=128`;

        let data;
        try {
            const res = await fetch(apiUrl);
            data = await res.json();
        } catch {
            throw new Error("API fetch failed");
        }

        const result = data.result || data.results || data;

        const audioUrl =
            result?.download_url ||
            result?.downloadUrl ||
            result?.url ||
            result?.audio ||
            result?.link;

        if (!audioUrl) {
            return reply("❌ Failed to get audio.");
        }

        title = result?.title || result?.name || title;
        thumbnail = result?.thumbnail || result?.image || thumbnail;

        const safeTitle = title.replace(/[<>:"/\\|?*]/g, "_").trim();

        // SAVE USER CHOICE STATE
        pending.set(sender, {
            audioUrl,
            title: safeTitle,
            thumbnail,
            duration,
            videoUrl
        });

        await conn.sendMessage(from, {
            image: { url: thumbnail || "https://i.imgur.com/7d7I6dI.png" },
            caption: `🎶 *${safeTitle}*

⏱️ Duration: ${duration || "Unknown"}

Reply with:
1️⃣ Send as Audio
2️⃣ Send as Document`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '🎧', key: mek.key }
        });

    } catch (err) {
        console.error("Play2 Error:", err);
        reply(`❌ Error: ${err.message}`);
    }
});


// ==============================
// HANDLE USER REPLY (1 or 2)
// ==============================
cmd({
    on: "body"
},
async (conn, m, mek, { body, from, sender }) => {
    try {
        if (!pending.has(sender)) return;

        const choice = body.trim();

        if (choice !== "1" && choice !== "2") return;

        const data = pending.get(sender);
        pending.delete(sender);

        const { audioUrl, title, thumbnail, duration, videoUrl } = data;

        await conn.sendMessage(from, {
            react: { text: '⬇️', key: mek.key }
        });

        // AUDIO
        if (choice === "1") {
            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: title.substring(0, 40),
                        body: duration ? `Duration: ${duration}` : "DML Music",
                        thumbnailUrl: thumbnail,
                        sourceUrl: videoUrl,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        }

        // DOCUMENT
        if (choice === "2") {
            await conn.sendMessage(from, {
                document: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                caption: `🎶 *${title}*
⏱️ ${duration || "Unknown"}

✅ Download complete`
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

    } catch (err) {
        console.error("Reply Handler Error:", err);
    }
});