const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "imagine",
  alias: ["img", "draw"],
  desc: "Generate AI images using Stability AI",
  category: "ai",
  filename: __filename
},
async (conn, mek, m, { reply, q }) => {
  try {
    if (!q) return reply("❌ Provide a prompt\nExample: .imagine a futuristic city at night");

    reply("🎨 Generating image... please wait");

    const API_KEY = "sk-05HU0gUsnzN7hYL5fEF1ureraNCWgTWSk8nv8Wkbl0o1y6Am"; // ⚠️ put your key here

    const res = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      null,
      {
        params: {
          prompt: q,
          output_format: "png"
        },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "image/*"
        },
        responseType: "arraybuffer"
      }
    );

    const buffer = Buffer.from(res.data, "binary");

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `✨ Prompt: ${q}`
    }, { quoted: m });

  } catch (e) {
    console.log(e.response?.data || e.message);
    reply("❌ Failed to generate image. Check API key or try again.");
  }
});