const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command");

// Path to persistent settings
const settingsPath = path.join(__dirname, "../lib/autoReactSettings.json");

// Default settings from config.js
let settings = {
  autoReactEnabled: config.channelReact.enabled, // base default
  autoEmojis: config.channelReact.emojis,
};

// Load saved settings if exists
if (fs.existsSync(settingsPath)) {
  try {
    const raw = fs.readFileSync(settingsPath, "utf-8");
    settings = { ...settings, ...JSON.parse(raw) };
    console.log("✅ Auto-react settings loaded from JSON!");
  } catch (e) {
    console.error("❌ Failed to load auto-react settings, using defaults", e);
  }
}

// Save settings helper
const saveSettings = () => {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
};

// Track messages already reacted to
const reactedMessages = new Set();

// --------------Toggle Auto React (ON/OFF)-------------
cmd(
  {
    pattern: "channelreact",
    desc: "Toggle auto channel reaction on/off",
    category: "owner",
    react: "⚙️",
    use: ".channelreact on/off",
    filename: __filename,
  },
  async (conn, mek, m, { isCreator, reply, q }) => {
    if (!isCreator) return reply("❌ Owner only command");
    if (!q) return reply("Usage: .channelreact on/off");

    const option = q.toLowerCase();
    if (option === "on") {
      settings.autoReactEnabled = true;
      saveSettings();
      return reply("✅ Auto channel reaction ENABLED (manual override)");
    }
    if (option === "off") {
      settings.autoReactEnabled = false;
      saveSettings();
      return reply("⛔ Auto channel reaction DISABLED (manual override)");
    }
    return reply("❌ Invalid option. Use: on or off");
  }
);

// -------------Automatic Channel Reaction-------------
cmd({ on: "messages.upsert" }, async (conn, m) => {
  try {
    if (settings.autoReactEnabled === false) return; // manual off stops reactions

    if (!m.messages) return;
    const msg = m.messages[0];

    // Only react to channels the bot follows
    if (!msg.key.remoteJid.endsWith("@newsletter")) return;

    // Skip if message already reacted
    if (reactedMessages.has(msg.key.id)) return;
    reactedMessages.add(msg.key.id);

    // Choose a random emoji
    const randomEmoji =
      settings.autoEmojis[Math.floor(Math.random() * settings.autoEmojis.length)];

    // React with random emoji
    await conn.sendMessage(msg.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: msg.key,
      },
    });

    console.log(`✅ Auto-reacted to ${msg.key.id} with ${randomEmoji}`);
  } catch (e) {
    console.error("❌ Failed auto-react:", e);
  }
});

// ------Ensure auto-react runs if config enables it------
if (config.channelReact.enabled) {
  settings.autoReactEnabled = true;
  saveSettings();
}