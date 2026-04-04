const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "ringtone",
    alias: ["tone", "ring"],
    react: "🎶",
    desc: "Search and download ringtones",
    category: "fun",
    use: ".ringtone <song name>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("*🎵 Please provide a song name*\n*Example: .ringtone blinding lights*");
        }

        await reply(`*🔍 Searching ringtone for "${query}"...*`);

        // Popcat Ringtone API
        const url = `https://api.popcat.xyz/ringtone?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data?.audio) {
            return reply("*🔴 No ringtones found for your query. Please try a different keyword.*");
        }

        const audioUrl = response.data.audio;

        await conn.sendMessage(
            from,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${query}.mp3`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("Ringtone Error:", error);
        reply(`*❌ Error: ${error.message || "Failed to fetch ringtone"}*`);
    }
});