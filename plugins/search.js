const { cmd } = require('../command');
const axios = require('axios');
const {
  generateWAMessageContent,
  generateWAMessageFromContent
} = require('@whiskeysockets/baileys');

cmd({
  pattern: "yts",
  desc: "Search YouTube videos",
  category: "search",
  use: ".yts <query>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply, react }) => {
  try {
    if (!q) return reply("❗ Please provide a search query");

    // 🔎 Searching reaction
    await react("🔎");

    const apiUrl = `https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl, { timeout: 60000 });

    const results = res.data?.videos;

    if (!Array.isArray(results) || results.length === 0) {
      await react("❌");
      return reply("❌ No results found.");
    }

    const videos = results.slice(0, 5);

    const cards = await Promise.all(
      videos.map(async (vid) => ({
        header: {
          title: `🎬 *${vid.name}*`,
          hasMediaAttachment: true,
          imageMessage: (
            await generateWAMessageContent(
              { image: { url: vid.thumbnail } },
              { upload: conn.waUploadToServer }
            )
          ).imageMessage,
        },
        body: {
          text: `📺 Duration: ${vid.duration}
👁️ Views: ${vid.views}${vid.published ? `\n📅 Published: ${vid.published}` : ""}`,
        },
        footer: {
          text: "> *YouTube Search*",
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "Copy Link",
                copy_code: vid.url,
              }),
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "Watch on YouTube",
                url: vid.url,
              }),
            },
          ],
        },
      }))
    );

    const message = generateWAMessageFromContent(
      from,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: `🔍 YouTube Results for: *${q}*`,
              },
              footer: {
                text: `📂 Showing ${videos.length} results`,
              },
              carouselMessage: {
                cards,
              },
            },
          },
        },
      },
      { quoted: mek }
    );

    await conn.relayMessage(from, message.message, {
      messageId: message.key.id,
    });

    await react("✅");

  } catch (error) {
    console.error("YTS Error:", error);
    await react("❌");
    return reply("❌ Error fetching results. Try again later.");
  }
});