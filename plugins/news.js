const { cmd } = require('../command');
const config = require('../config');

const axios = require("axios");
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("gifted-baileys");

cmd({
  pattern: "news",
  alias: ["latest-news"],
  desc: "Get latest news headlines",
  category: "news",
  react: "🗞️",
  filename: __filename,
},
async (conn, mek, m, {
  from,
  q,
  reply
}) => {

  // ⏳ Loading reaction      
  await conn.sendMessage(from, {       
      react: { text: "⏳", key: mek.key }       
  });

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";

    // 🔍 Optional search query support
    const apiUrl = q
      ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    const res = await axios.get(apiUrl, { timeout: 100000 });
    const results = res.data?.articles;

    if (!Array.isArray(results) || results.length === 0) {
      await conn.sendMessage(from, {
        react: { text: "❌", key: mek.key }
      });
      return reply("No news found.");
    }

    const articles = results.slice(0, 5);

    const cards = await Promise.all(
      articles.map(async (article) => ({
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
          text: `📄 ${article.description || "No description available"}${
            article.publishedAt
              ? `\n📅 Published: ${new Date(article.publishedAt).toLocaleString()}`
              : ""
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
                copy_code: article.url,
              }),
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "Read Full Article",
                url: article.url,
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
                text: `🗞️ Latest News${q ? ` for: *${q}*` : ""}`,
              },
              footer: {
                text: `📂 Showing ${articles.length} articles`,
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
    console.error("News Error:", error);

    await conn.sendMessage(from, {
      react: { text: "❌", key: mek.key }
    });

    return reply("Oops! Could not fetch news.");
  }
});