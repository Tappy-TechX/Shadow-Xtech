const { cmd } = require("../command"); // using cmd instead of gmd
const axios = require("axios");
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("@whiskeysockets/baileys");

cmd(
  {
    pattern: "yts",
    aliases: ["yt-search"],
    category: "search",
    react: "🔍",
    description: "Perform YouTube search",
  },
  async (from, Gifted, conText) => {
    const { q, mek, reply, react, botFooter } = conText;

    if (!q) {
      await react("❌");
      return reply("Please provide a search query");
    }

    try {
      const apiUrl = `https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`;
      const res = await axios.get(apiUrl, { timeout: 100000 });
      const results = res.data?.videos;

      if (!Array.isArray(results) || results.length === 0)
        return reply("No results found!");

      const videos = results.slice(0, 5);
      const cards = await Promise.all(
        videos.map(async (vid) => ({
          header: {
            title: `🎬 *${vid.name}*`,
            hasMediaAttachment: true,
            imageMessage: (
              await generateWAMessageContent(
                { image: { url: vid.thumbnail } },
                { upload: Gifted.waUploadToServer }
              )
            ).imageMessage,
          },
          body: {
            text: `📺 Duration: ${vid.duration}\n👁️ Views: ${vid.views}${
              vid.published ? `\n📅 Published: ${vid.published}` : ""
            }`,
          },
          footer: { text: `> *${botFooter}*` },
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
                body: { text: `🔍 YouTube Results for: *${q}*` },
                footer: {
                  text: `📂 Displaying first *${videos.length}* videos`,
                },
                carouselMessage: { cards },
              },
            },
          },
        },
        { quoted: mek }
      );

      await Gifted.relayMessage(from, message.message, {
        messageId: message.key.id,
      });

      await react("✅");
    } catch (error) {
      console.error("Error during search process:", error);
      await react("❌");
      return reply("Oops! Something went wrong. Please try again.");
    }
  }
);