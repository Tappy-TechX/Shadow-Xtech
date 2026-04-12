const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "rw",
  alias: ["randomwall", "random-wallpaper", "wallpaper"],
  react: "🌌",
  desc: "Download random wallpapers based on keywords.",
  category: "wallpapers",
  use: ".rw <keyword>",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    const query = args.join(" ") || "random";

    // ⏳ Loading reaction
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `https://pikabotzapi.vercel.app/random/randomwall/?apikey=anya-md&query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(apiUrl);
    
    if (data.status && data.imgUrl) {
      const caption = `🌌 *Random Wallpaper: ${query}*\n\n> *© Powered By Shadow-Xtech*`;

      await conn.sendMessage(from, { image: { url: data.imgUrl }, caption }, { quoted: m });

      // ✅ Success reaction
      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      // ❌ No wallpaper found
      await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
      reply(`*🔴 No wallpaper found for "${query}"*.`);
    }
  } catch (error) {
    console.error("📂 Wallpaper Error:", error);

    // ❌ Error reaction
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });

    reply("*🔴 An error occurred while fetching the wallpaper. Please try again.*");
  }
});