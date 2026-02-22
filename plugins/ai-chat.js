const { cmd } = require('../command');
const axios = require('axios');

// Quoted Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🔞 Explicit | Content ⭐",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\nEND:VCARD"
    }
  }
};

// Axios instance (faster & controlled)
const api = axios.create({
  timeout: 10000, // 10s timeout
  headers: { 'User-Agent': 'Shadow-Xtech' }
});

// Reusable AI Fetcher
async function fetchAI(url, field) {
  const { data } = await api.get(url);
  return data?.[field] || null;
}

// Common sender
function getContext(sender) {
  return {
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363369453603973@newsletter",
      newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
      serverMessageId: 143
    },
    externalAdReply: {
      title: "💻 Shadow-Xtech AI System",
      body: "Fast & Advanced AI Engine",
      thumbnailUrl: "https://files.catbox.moe/xbxftg.jpeg",
      sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
      mediaType: 1,
      renderLargerThumbnail: false,
      showAdAttribution: true
    }
  };
}

// ===================== AI COMMAND =====================

cmd({
  pattern: "ai",
  alias: ["bot", "dj", "blacktappy", "gpt", "gpt4", "bing"],
  desc: "Chat with AI",
  category: "ai",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, react }) => {

  if (!q) return conn.sendMessage(from, { text: "Provide a message.\nExample: .ai Hello" });

  try {
    await react("⏳");

    const response = await fetchAI(
      `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`,
      "message"
    );

    if (!response) throw new Error("No response");

    await conn.sendMessage(from, {
      text: `🤖 *AI Response:*\n\n${response}`,
      contextInfo: getContext(sender)
    }, { quoted: quotedContact });

    await react("✅");

  } catch (err) {
    console.error(err);
    await react("❌");
    conn.sendMessage(from, { text: "AI failed to respond. Try again later." });
  }
});

// ===================== OPENAI =====================

cmd({
  pattern: "openai",
  alias: ["chatgpt", "gpt3", "open-gpt"],
  desc: "Chat with OpenAI",
  category: "ai",
  react: "🧠",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, react }) => {

  if (!q) return conn.sendMessage(from, { text: "Provide a message.\nExample: .openai Hello" });

  try {
    await react("⏳");

    const response = await fetchAI(
      `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`,
      "result"
    );

    if (!response) throw new Error("No response");

    await conn.sendMessage(from, {
      text: `🧠 *OpenAI Response:*\n\n${response}`,
      contextInfo: getContext(sender)
    }, { quoted: quotedContact });

    await react("✅");

  } catch (err) {
    console.error(err);
    await react("❌");
    conn.sendMessage(from, { text: "OpenAI failed to respond." });
  }
});

// ===================== DEEPSEEK =====================

cmd({
  pattern: "deepseek",
  alias: ["deep", "seekai"],
  desc: "Chat with DeepSeek",
  category: "ai",
  react: "🧠",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, react }) => {

  if (!q) return conn.sendMessage(from, { text: "Provide a message.\nExample: .deepseek Hello" });

  try {
    await react("⏳");

    const response = await fetchAI(
      `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`,
      "answer"
    );

    if (!response) throw new Error("No response");

    await conn.sendMessage(from, {
      text: `🧠 *DeepSeek Response:*\n\n${response}`,
      contextInfo: getContext(sender)
    }, { quoted: quotedContact });

    await react("✅");

  } catch (err) {
    console.error(err);
    await react("❌");
    conn.sendMessage(from, { text: "DeepSeek failed to respond." });
  }
});