const config = require('../config');
const { cmd } = require('../command');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const fetch = require('node-fetch'); // Needed for thumbnail fetch

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: ".yts <query>",
    react: "🔎",
    desc: "Search YouTube videos and get details, then download audio/video.",
    category: "search",
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a search term!*");

        const results = await ytSearch(q);

        if (!results || !results.videos.length) {
            return reply("*No results found!*");
        }

        // Prepare top 5 results
        const topVideos = results.videos.slice(0, 5);

        // Build search message with download options inline
        let text = `🔎 *YouTube Search Results for:* "${q}"\n\n`;

        topVideos.forEach((video, index) => {
            text += `*${index + 1}. ${video.title}*\n`;
            text += `⏱️ Duration: ${video.timestamp}\n`;
            text += `📺 Channel: ${video.author.name}\n`;
            text += `🔗 Link: ${video.url}\n`;
            text += `Reply with *${index + 1}1* → Audio 🎵\n`;
            text += `Reply with *${index + 1}2* → Document 📄\n`;
            text += `Reply with *${index + 1}3* → Video 📹\n\n`;
        });

        await conn.sendMessage(from, { text }, { quoted: mek });

        // Wait for user reply
        const filter = (msg) => msg.key.fromMe === false && msg.key.remoteJid === from;

        conn.on("message.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || !filter(msg)) return;

            let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text) return;

            // Example: 11 → first video Audio, 12 → first video Document, 13 → first video Video
            const match = text.match(/^(\d+)([1-3])$/);
            if (!match) return;

            const videoIndex = parseInt(match[1]) - 1;
            const type = match[2];

            if (videoIndex < 0 || videoIndex >= topVideos.length) return;

            const video = topVideos[videoIndex];
            const url = video.url;

            try {
                let filename;
                let stream;

                switch (type) {
                    case "1": // Audio
                        filename = `${video.title}.mp3`;
                        stream = ytdl(url, { filter: 'audioonly' });
                        await new Promise((resolve, reject) => {
                            const file = fs.createWriteStream(filename);
                            stream.pipe(file);
                            file.on('finish', resolve);
                            file.on('error', reject);
                        });
                        await conn.sendMessage(from, { audio: fs.readFileSync(filename), mimetype: 'audio/mpeg', ptt: false });
                        fs.unlinkSync(filename);
                        break;

                    case "2": // Document
                        filename = `${video.title}.mp4`;
                        stream = ytdl(url, { quality: 'highest' });
                        await new Promise((resolve, reject) => {
                            const file = fs.createWriteStream(filename);
                            stream.pipe(file);
                            file.on('finish', resolve);
                            file.on('error', reject);
                        });
                        await conn.sendMessage(from, { document: fs.readFileSync(filename), mimetype: 'video/mp4', fileName: filename });
                        fs.unlinkSync(filename);
                        break;

                    case "3": // Video with thumbnail
                        filename = `${video.title}.mp4`;
                        stream = ytdl(url, { quality: 'highest' });
                        await new Promise((resolve, reject) => {
                            const file = fs.createWriteStream(filename);
                            stream.pipe(file);
                            file.on('finish', resolve);
                            file.on('error', reject);
                        });

                        const thumb = await (await fetch(video.thumbnail)).buffer();

                        await conn.sendMessage(from, { video: fs.readFileSync(filename), caption: video.title, jpegThumbnail: thumb });
                        fs.unlinkSync(filename);
                        break;

                    default:
                        return reply("*Invalid option! Use 1, 2, or 3.*");
                }
            } catch (err) {
                console.log(err);
                reply("*Failed to download video/audio!*")
            }
        });

    } catch (error) {
        console.log(error);
        reply("*An error occurred while searching!*");
    }
});