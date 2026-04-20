const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
  pattern: "video",
  alias: ["ytvideo", "mp4"],
  desc: "Download YouTube video via search or link",
  category: "download",
  react: "🎬",
  filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {

  try {
    if (!q) return reply("Provide a YouTube link or name.\nExample:\nvideo Not Like Us");

    await conn.sendMessage(from, {
      react: { text: "🎬", key: mek.key }
    });

    if (q.length > 100) {
      return reply("Video name too long! Max 100 chars.");
    }

    // Search video
    const searchResult = (await yts(q)).videos[0];

    if (!searchResult) {
      return reply("Couldn't find that video. Try another!");
    }

    const video = searchResult;

    await conn.sendMessage(from, {
      text: `_Downloading: ${video.title}_`
    }, { quoted: mek });

    const apiUrl = `https://www.apiskeith.vercel.app/download/video?url=${encodeURIComponent(video.url)}`;

    let response;

    try {
      response = await axios.get(apiUrl, {
        timeout: 300000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message.includes("socket hang up")) {
        response = await axios.get(apiUrl, {
          timeout: 300000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });
      } else {
        throw err;
      }
    }

    const apiData = response.data;

    if (!apiData || !apiData.status) {
      throw new Error("API failed to fetch video!");
    }

    const caption = `Title: ${video.title}\nDuration: ${video.timestamp}`;
    const vid = apiData.result;

    // Send video
    try {
      await conn.sendMessage(from, {
        document: { url: vid },
        mimetype: "video/mp4",
        fileName: `${video.title.replace(/[^\w\s]/gi, '').substring(0, 80)}.mp4`,
        caption
      }, { quoted: mek });

    } catch (err) {
      await conn.sendMessage(from, {
        video: { url: apiData.result.download_url || vid },
        mimetype: "video/mp4",
        caption: `${caption}\n(Sent as video)`
      }, { quoted: mek });
    }

    await conn.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });

  } catch (error) {

    let msg = error.message;

    if (msg.includes("timeout")) msg = "Download timeout. Video may be too large.";
    if (msg.includes("API failed")) msg = "API error. Try again later.";
    if (msg.includes("socket hang up")) msg = "Connection lost. Please retry.";

    await conn.sendMessage(from, {
      react: { text: "⚠️", key: mek.key }
    });

    return reply(msg);
  }

});