const { cmd } = require('../command');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

// =====================
// CHATBOT STATE
// =====================
let chatbotEnabled = config.CHATBOT_MODE === "true" || false;

// =====================
// 🔑 GEMINI API KEY (PUT YOUR KEY HERE)
// =====================
const GEMINI_API_KEY = "AIzaSyD4pVHrDfLYAj7ivxa6U5NenPu0bT-xVaQ";

// =====================
// INIT GEMINI AI
// =====================
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// =====================
// TOGGLE COMMAND
// =====================
cmd({
  pattern: "chatbot",
  react: "🤖",
  desc: "Enable or disable Gemini chatbot",
  category: "ai",
  use: ".chatbot on / off"
}, async (conn, m, { args, reply }) => {
  const action = (args[0] || "").toLowerCase();

  if (action === "on") {
    chatbotEnabled = true;
    return reply("✅ Chatbot has been *ENABLED*");
  }

  if (action === "off") {
    chatbotEnabled = false;
    return reply("❌ Chatbot has been *DISABLED*");
  }

  return reply("⚙️ Usage:\n.chatbot on\n.chatbot off");
});

// =====================
// AUTO REPLY HANDLER
// =====================
cmd({
  on: "body"
}, async (conn, m) => {
  try {

    // ❌ Ignore bot messages
    if (m.fromMe) return;

    // ❌ Ignore status messages
    if (m.isStatus) return;

    // ❌ Ignore if OFF
    if (!chatbotEnabled) return;

    const text =
      m.body ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      "";

    // ❌ Ignore empty / commands
    if (!text || text.startsWith(".")) return;

    // ❌ Reduce spam
    if (text.length < 2) return;

    // 🤖 Gemini request
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text }]
        }
      ]
    });

    const response =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ I couldn't generate a response right now.";

    await conn.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });

  } catch (err) {
    console.log("Gemini chatbot error:", err);
  }
});