const { cmd } = require('../command');
const config = require('../config');
const axios = require("axios");
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("gifted-baileys");

cmd({
  pattern: "news",
  desc: "Get latest news headlines (interactive)",
  category: "news",
  react: "🗞️",
  filename: __filename,
},
async (conn, mek, m, {
  from,
  reply
}) => {

  // ⏳ Loading reaction
  await conn.sendMessage(from, {
    react: { text: "⏳", key: mek.key }
  });

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";

    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`,
      { timeout: 100000 }
    );

    const articles = res.data?.articles;

    if (!Array.isArray(articles) || articles.length === 0) {
      await conn.sendMessage(from, {
        react: { text: "❌", key: mek.key }
      });
      return reply("No news found.");
    }

    const cards = await Promise.all(
      articles.slice(0, 5).map(async (article) => ({
        header: {
          title: `📰 *${article.title}*`,
          hasMediaAttachment: true,
          imageMessage: article.urlToImage
            ? (
                await generateWAMessageContent(
                  { image: { url: article.urlToImage } },
                  { upload: conn.waUploadToServer }
                )
              ).imageMessage
            : undefined,
        },
        body: {
          text: `📌 ${article.description || "No description available"}${
            article.publishedAt
              ? `\n📅 ${new Date(article.publishedAt).toLocaleString()}`
              : ""
          }`,
        },
        footer: {
          text: `> *${config.BOT_NAME || "BOT"}*`,
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "Read Full Article",
                url: article.url,
              }),
            },
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "Copy Link",
                copy_code: article.url,
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
                text: `🗞️ Latest News Headlines`,
              },
              footer: {
                text: `📂 Showing ${cards.length} articles`,
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

    // ✅ Success reaction
    await conn.sendMessage(from, {
      react: { text: "🗞️", key: mek.key }
    });

  } catch (error) {
    console.error("NEWS Error:", error);

    await conn.sendMessage(from, {
      react: { text: "❌", key: mek.key }
    });

    return reply("Oops! Failed to fetch news.");
  }
});