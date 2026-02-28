const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// ===============================
// 📂 FILE PATHS
// ===============================
const settingsPath = path.join(__dirname, "../lib/chatbotSettings.json");
const memoryPath = path.join(__dirname, "../lib/chatbotMemory.json");

// Auto-create files if missing
if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(
    settingsPath,
    JSON.stringify({ enabled: true }, null, 2)
  );
}

if (!fs.existsSync(memoryPath)) {
  fs.writeFileSync(memoryPath, JSON.stringify({}));
}

// ===============================
// 🧠 MEMORY SYSTEM
// ===============================
function loadMemory() {
  return JSON.parse(fs.readFileSync(memoryPath));
}

function saveMemory(data) {
  fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2));
}

function loadSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(data) {
  fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
}

// ===============================
// ⏱️ COOLDOWN SYSTEM
// ===============================
const cooldown = new Map();
const COOLDOWN_TIME = 4000; // 4 seconds

// ===============================
// 🤖 CHATBOT TOGGLE COMMAND
// ===============================
cmd(
  {
    pattern: "chatbot",
    desc: "Enable or Disable Chatbot",
    category: "owner",
    filename: __filename
  },
  async (conn, mek, m, { args, isOwner }) => {
    try {
      if (!isOwner)
        return m.reply("🚫 Only bot owner can use this command.");

      if (!args[0])
        return m.reply(
          "🤖 Usage:\n\n• chatbot on\n• chatbot off"
        );

      const settings = loadSettings();

      if (args[0].toLowerCase() === "on") {
        settings.enabled = true;
        saveSettings(settings);
        return m.reply("🤖 Chatbot has been Enabled ✅");
      }

      if (args[0].toLowerCase() === "off") {
        settings.enabled = false;
        saveSettings(settings);
        return m.reply("🤖 Chatbot has been Disabled ❌");
      }

      return m.reply("❌ Invalid option. Use `chatbot on` or `chatbot off`.");
    } catch (err) {
      console.error("CHATBOT TOGGLE ERROR:", err);
    }
  }
);

// ===============================
// 🤖 AUTO CHATBOT LISTENER
// ===============================
cmd(
  {
    on: "body",
  },
  async (conn, mek, m, { body, from }) => {
    try {
      if (!body) return;

      const settings = loadSettings();
      if (!settings.enabled) return;
      if (mek.key.fromMe) return;

      const text = body.trim();

      // ⏱️ Cooldown per chat
      const now = Date.now();
      if (cooldown.has(from)) {
        const expire = cooldown.get(from) + COOLDOWN_TIME;
        if (now < expire) return;
      }
      cooldown.set(from, now);

      const memory = loadMemory();

      if (!memory[from]) memory[from] = [];

      memory[from].push({ role: "user", content: text });
      memory[from] = memory[from].slice(-15);

      await conn.sendPresenceUpdate("composing", from);

      const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);
      const res = response.data;

      if (!res || !res.status || !res.result) return;

      const replyText = res.result;

      memory[from].push({ role: "assistant", content: replyText });
      saveMemory(memory);

      await conn.sendMessage(
        from,
        { text: `🤖 ${replyText}` },
        { quoted: mek }
      );

    } catch (err) {
      console.error("CHATBOT ERROR:", err);
    }
  }
);
