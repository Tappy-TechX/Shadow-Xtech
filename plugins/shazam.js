const { cmd } = require('../command')
const { fetchJson } = require('../lib')

cmd({
    pattern: "shazam",
    alias: ["whatmusic"],
    desc: "Identify music from a YouTube URL",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes('http')) return reply("⚠️ Provide a YouTube URL!");

    try {
        reply("🔍 *Searching...*");
        // Ensure the URL is correctly encoded for the API
        const apiUrl = `https://api-faa.my.id/faa/whatmusic?url=${encodeURIComponent(q.trim())}`;
        const data = await fetchJson(apiUrl);

        if (!data.status) return reply("❌ Music not found.");

        const res = data.result;
        let txt = `🎵 *MUSIC IDENTIFIED*\n\n`
            + `📌 *Title:* ${res.title}\n`
            + `👤 *Channel:* ${res.channel}\n`
            + `🕒 *Duration:* ${res.duration}\n`
            + `🔗 *Link:* ${res.url}`;

        await conn.sendMessage(from, { image: { url: res.thumbnail }, caption: txt }, { quoted: mek });
    } catch (e) {
        reply("❌ Request failed. Try again later.");
    }
})
