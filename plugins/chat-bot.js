const { cmd } = require('../command');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

cmd({  
  pattern: "chatbot",  
  react: "📡",  
  desc: "Toggle Gemini chatbot ON/OFF",  
  category: "ai",  
  use: ".chatbot on / off"  
}, async (conn, m, { args, reply }) => {  
  
  // 💬 react to command  
  await conn.sendMessage(m.key.remoteJid, {  
    react: { text: "💬", key: m.key }  
  });  
  
  if (!args[0]) return reply("Use: .chatbot on / off");  
  
  if (args[0] === "on") {  
    config.CHATBOT_MODE = "true";  
  
    await conn.sendMessage(m.key.remoteJid, {  
      react: { text: "✔️", key: m.key }  
    });  
  
    return reply("🟢 Chatbot is now *ON*");  
  }  
  
  if (args[0] === "off") {  
    config.CHATBOT_MODE = "false";  
  
    await conn.sendMessage(m.key.remoteJid, {  
      react: { text: "✔️", key: m.key }  
    });  
  
    return reply("🔴 Chatbot is now *OFF*");  
  }  
  
  reply("Use: .chatbot on / off");  
});

// ⚠️ DIRECT API KEY
const GEMINI_API_KEY = "AIzaSyD4pVHrDfLYAj7ivxa6U5NenPu0bT-xVaQ";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

cmd({ on: "body" }, async (conn, m, { body }) => {
  try {

    // 🔴 must be ON
    if (config.CHATBOT_MODE !== "true") return;

    // ignore empty / bot messages
    if (!body || m.key.fromMe) return;

    // ignore commands
    if (body.startsWith(".")) return;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(body);
    const reply = result.response.text();

    await conn.sendMessage(
      m.key.remoteJid,
      { text: reply },
      { quoted: m }
    );

  } catch (err) {
    console.log("Gemini error:", err);
  }
});