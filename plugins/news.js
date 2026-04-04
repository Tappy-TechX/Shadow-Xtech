const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "🗞️", // initial reaction
    filename: __filename
},
async (conn, mek, m, { from, reply, react }) => {
    try {
        // Show loading reaction
        await react("♻️");

        const apiKey = "0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles;

        if (!articles.length) {
            await react("❌"); // error reaction
            return reply("*No news articles found.*");
        }

        // Send each article as a separate message with image and title
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
📰 *${article.title}*
⚠️ _${article.description || "No description"}_
🔗 _${article.url}_

> © Powered By Shadow-Xtech
            `;

            if (article.urlToImage) {
                await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message });
            } else {
                await conn.sendMessage(from, { text: message });
            }
        };

        // Success reaction after sending all articles
        await react("✅");

    } catch (e) {
        console.error("Error fetching news:", e);
        await react("❌"); // error reaction
        reply("*Could not fetch news. Please try again later.*");
    }
});