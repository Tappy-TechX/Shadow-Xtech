const { cmd } = require('../command');
const fetch = require('node-fetch');

function clean(text) {
    return text.replace(/[^\w\s]/gi, '');
}

cmd({
    pattern: "play2",
    alias: ["song"],
    desc: "Download audio using API",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*🔎 Please provide a song name*");

        const res = await fetch(`https://api.nexray.web.id/downloader/ytplay?query=${encodeURIComponent(q)}`);
        const data = await res.json();

        if (!data || !data.result) {
            return reply("*🔴 No results found!*");
        }

        const video = data.result;

        // Preview message
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *Title:* ${video.title}
👤 *Author:* ${video.author}
⏱ *Duration:* ${video.duration}

*Reply:*
1️⃣ Audio
2️⃣ Document`
        }, { quoted: mek });

        global.audioSession = global.audioSession || {};
        global.audioSession[from] = video;

    } catch (e) {
        console.log(e);
        reply("*🔴 Error! Try again later*");
    }
});


// Reply handler
cmd({
    on: "body"
},
async (conn, mek, m, { from, body, reply }) => {
    try {
        if (!global.audioSession || !global.audioSession[from]) return;

        const choice = body.trim();
        const video = global.audioSession[from];

        delete global.audioSession[from];

        // 🎧 AUDIO
        if (choice === "1") {
            await conn.sendMessage(from, {
                audio: { url: video.audio },
                mimetype: "audio/mpeg"
            }, { quoted: mek });
        }

        // 📄 DOCUMENT
        else if (choice === "2") {
            await conn.sendMessage(from, {
                document: { url: video.audio },
                mimetype: "audio/mpeg",
                fileName: `${clean(video.title)}.mp3`
            }, { quoted: mek });
        }

        else {
            reply("*📌 Reply with 1 or 2*");
        }

    } catch (e) {
        console.log(e);
        reply("*🔴 Error downloading song!*");
    }
});