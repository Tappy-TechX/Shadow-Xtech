const axios = require('axios');
const { cmd } = require("../command");

cmd({
  pattern: "lyrics",
  alias: ["lyric", "songlyrics", "lyr"],
  react: '🎵',
  desc: "Get lyrics of songs (top 5)",
  category: "music",
  use: ".lyrics <song name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, text: q }) => {
  try {

    if (!q) return reply("🎵 Usage: .lyrics <song name>\nExample: .lyrics Blinding Lights");

    await reply("⏳ Searching top 5 lyrics...");

    // STEP 1: Search songs
    const searchRes = await axios.get(
      `https://api.lyrics.ovh/suggest/${encodeURIComponent(q)}`
    );

    const songs = searchRes.data.data.slice(0, 5);
    if (!songs.length) return reply(`❌ No results found for "${q}"`);

    // STEP 2: Loop through top 5
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];

      try {
        const lyricsRes = await axios.get(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`
        );

        let lyrics = lyricsRes.data.lyrics || "Lyrics not found.";

        if (lyrics.length > 2000) {
          lyrics = lyrics.slice(0, 1997) + "...";
        }

        const caption =
          `🎵 *${song.title}*\n` +
          `👤 *Artist:* ${song.artist.name}\n\n` +
          `📝 *Lyrics:*\n${lyrics}\n\n` +
          `> *popkid*`;

        await conn.sendMessage(from, { text: caption }, { quoted: mek });

      } catch {
        await conn.sendMessage(from, {
          text: `❌ Couldn't fetch lyrics for ${song.title} - ${song.artist.name}`
        }, { quoted: mek });
      }
    }

  } catch (error) {
    console.error("lyrics error:", error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});