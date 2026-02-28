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
    JSON.stringify({ enabled: true, scope: "both" }, null, 2)
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
const COOLDOWN_TIME = 4000; // 4s anti-spam

// ===============================
// 🤖 AUTO CHATBOT HANDLER
// ===============================
cmd(
  {
    on: "body",
  },
  async (conn, mek, m, { body, from, isOwner, isGroup }) => {
    try {
      if (!body) return;

      const settings = loadSettings();
      const memory = loadMemory();
      const text = body.trim().toLowerCase();

      // ===============================
      // 🔐 OWNER-ONLY CHATBOT CONTROL
      // ===============================
      if (text.startsWith("chatbot")) {
        if (!isOwner)
          return m.reply("🚫 Only bot owner can control chatbot.");

        const args = text.split(" ").slice(1);
        const action = args[0];
        const scope = args[1] || "both"; // group, private, or both

        // Show usage help
        if (!action || action === "help") {
          return m.reply(
            `🤖 Chatbot Command Usage:\n\n` +
              `• chatbot on [group/private/both] - Enable chatbot\n` +
              `• chatbot off [group/private/both] - Disable chatbot\n` +
              `• chatbot help - Show this help message\n\n` +
              `Scope options:\n` +
              `- group : Enable/disable in group chats only\n` +
              `- private : Enable/disable in private chats only\n` +
              `- both : Enable/disable in both group & private chats`
          );
        }

        if (["on", "off"].includes(action)) {
          settings.enabled = action === "on";
          settings.scope = ["group", "private", "both"].includes(scope)
            ? scope
            : "both";
          saveSettings(settings);
          return m.reply(
            `🤖 Chatbot ${action === "on" ? "Enabled" : "Disabled"} for ${settings.scope}`
          );
        }

        return m.reply(
          "❌ Invalid command. Type `chatbot help` for instructions."
        );
      }

      // ===============================
      // ❌ STOP CONDITIONS
      // ===============================
      if (!settings.enabled) return; // chatbot off
      if (mek.key.fromMe) return; // ignore bot's own messages

      // Respect scope
      if (
        (settings.scope === "group" && !isGroup) ||
        (settings.scope === "private" && isGroup)
      )
        return;

      // ===============================
      // ⏱️ COOLDOWN
      // ===============================
      const now = Date.now();
      if (cooldown.has(from)) {
        const expire = cooldown.get(from) + COOLDOWN_TIME;
        if (now < expire) return;
      }
      cooldown.set(from, now);

      // ===============================
      // 🧠 MEMORY HANDLING
      // ===============================
      if (!memory[from]) memory[from] = [];
      memory[from].push({ role: "user", content: body });
      memory[from] = memory[from].slice(-15); // keep last 15 messages

      // ===============================
      // 🤖 AI REQUEST
      // ===============================
      await conn.sendPresenceUpdate("composing", from);

      const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(
        body
      )}`;
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