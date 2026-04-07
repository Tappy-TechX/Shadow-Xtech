const { cmd } = require('../command');
const config = require('../config');

const axios = require("axios");
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("gifted-baileys");

cmd({
  pattern: "yts",
  alias: ["yt-search"],
  desc: "Search YouTube videos",
  category: "search",
  react: "🔍",
  filename: __filename,
},
async (conn, mek, m, {
  from,
  q,
  reply,
  react
}) => {

  if (!q) {
    await react("❌");
    return reply("Please provide a search query");
  }

  try {
    const apiUrl = `https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl, { timeout: 100000 });
    const results = res.data?.videos;

    if (!Array.isArray(results) || results.length === 0) {
      await react("❌");
      return reply("No results found.");
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
👁️ Views: ${vid.views}${
  vid.published ? `\n📅 Published: ${vid.published}` : ""
}`,
        },
        footer: {
          text: `> *${config.BOT_NAME || "BOT"}*`,
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
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              body: {
                text: `🔍 YouTube Results for: *${q}*`,
              },
              footer: {
                text: `📂 Showing ${videos.length} results`,
              },
              carouselMessage: { cards },
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
    return reply("Oops! Something went wrong.");
  }
});