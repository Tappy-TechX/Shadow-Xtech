const { cmd } = require('../command');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

function clean(text) {
    return text.replace(/[^\w\s]/gi, '');
}

cmd({
    pattern: "play",
    alias: ["song"],
    desc: "Download audio",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*🔎 Please provide a search query or song name*");

        const search = await ytSearch(q);
        const video = search.videos[0];

        if (!video) return reply("*🔴 There is no results found for the provided query!*");

        const url = `https://youtube.com/watch?v=${video.videoId}`;

        // Preview
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *Title: ${video.title}*
👤 *Author: ${video.author.name}*
⏱ *Duration: ${video.timestamp}*

*Reply:*
1️⃣ *Audio*
2️⃣ *Document*`
        }, { quoted: mek });

        global.audioSession = global.audioSession || {};
        global.audioSession[from] = { video, url };

    } catch (e) {
        reply("*🔴 Error! Try Again later*");
    }
});


// Reply handler (audio only)
cmd({
    on: "body"
},
async (conn, mek, m, { from, body, reply }) => {
    try {
        if (!global.audioSession || !global.audioSession[from]) return;

        const choice = body.trim();
        const { video, url } = global.audioSession[from];

        delete global.audioSession[from];

        // 🎧 AUDIO
        if (choice === "1") {
            const stream = ytdl(url, { filter: "audioonly" });

            await conn.sendMessage(from, {
                audio: stream,
                mimetype: "audio/mpeg"
            }, { quoted: mek });
        }

        // 📄 DOCUMENT
        else if (choice === "2") {
            const stream = ytdl(url, { filter: "audioonly" });

            await conn.sendMessage(from, {
                document: stream,
                mimetype: "audio/mpeg",
                fileName: `${clean(video.title)}.mp3`
            }, { quoted: mek });
        }

        else {
            reply("*📌 Reply with 1 or 2");
        }

    } catch (e) {
        reply("*🔴 Error downloading song! Try again later*");
    }
});
// Video Command 
const { cmd } = require('../command');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

cmd({
    pattern: "video",
    alias: ["ytmp4"],
    desc: "Download video",
    category: "downloader",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*🔎 Please provide a search query or video name*");

        const search = await ytSearch(q);
        const video = search.videos[0];

        if (!video) return reply("*🔴 There is no results found for the provided query!*");

        if (video.seconds > 1800) {
            return reply("*📌 Video is too long! Please try again with a shorter version*");
        }

        const url = `https://youtube.com/watch?v=${video.videoId}`;

        // Preview
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎬 *Video: ${video.title}*
👤 *Author: ${video.author.name}*
⏱ *Duration: ${video.timestamp}*

*⬇️ Downloading video...*`
        }, { quoted: mek });

        const stream = ytdl(url, {
            filter: "audioandvideo",
            quality: "18"
        });

        await conn.sendMessage(from, {
            video: stream,
            mimetype: "video/mp4",
            caption: `🎬 ${video.title}`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("*🔴 Error downloading video! Try again later*");
    }
});