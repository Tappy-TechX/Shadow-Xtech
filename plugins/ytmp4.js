const { cmd } = require('../command');
const ytdlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "ytmp4",
  alias: ["video", "mp4"],
  desc: "Download YouTube video in MP4",
  category: "download",
  react: "🎬",
  filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {

  if (!q) return reply("*Send a YouTube link*");

  await conn.sendMessage(from, {
    react: { text: "⏳", key: mek.key }
  });

  try {
    const filePath = path.join(__dirname, `video_${Date.now()}.mp4`);

    await ytdlp(q, {
      format: 'mp4',
      output: filePath,
    });

    await conn.sendMessage(from, {
      video: fs.readFileSync(filePath),
      mimetype: "video/mp4",
      caption: "🎬 Here is your video"
    }, { quoted: mek });

    fs.unlinkSync(filePath);

    await conn.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });

  } catch (err) {
    console.log(err);

    await conn.sendMessage(from, {
      react: { text: "❌", key: mek.key }
    });

    reply("*Failed to download video. Try another link.*");
  }
});