const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "../config.json");
const config = require("../config");
const { cmd } = require("../command");

// --- AUTO REACT ON MESSAGE ---
cmd({
  on: "body"
}, async (client, message) => {
  if (config.CUSTOM_REACT !== "true") return;

  try {
    const jid = message.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");

    // Mode filter
    if (config.CUSTOM_REACT_MODE === "group" && !isGroup) return;
    if (config.CUSTOM_REACT_MODE === "private" && isGroup) return;

    // Ensure there are emojis
    if (!config.CUSTOM_REACT_EMOJIS) return;
    const emojis = config.CUSTOM_REACT_EMOJIS.split(",");
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    await client.sendMessage(jid, {
      react: {
        text: emoji,
        key: message.key
      }
    });

  } catch (e) {
    console.log("🔴 Auto React Error:", e);
  }
});

// --- OWNER COMMAND TO MANAGE CUSTOM REACT ---
cmd({
  pattern: "custom-react",
  alias: ["customreact"],
  react: "🔥",
  desc: "Enable or disable auto-react feature",
  category: "settings",
  filename: __filename
}, async (client, message, match, { isOwner, reply }) => {

  if (!isOwner) return reply("*📛 Only the owner can use this command!*");

  // Show status if no match
  if (!match) {
    return reply(`*🌟 CUSTOM-REACT SETTINGS*

Status : ${config.CUSTOM_REACT}
Mode   : ${config.CUSTOM_REACT_MODE}
Emojis : ${config.CUSTOM_REACT_EMOJIS}

Commands:
.custom-react on
.custom-react off
.custom-react group
.custom-react private
.custom-react all
.custom-react emoji 😂
.custom-react emoji 😂,🔥,💀
`);
  }

  const input = match.toLowerCase().trim();

  // Helper to save changes to config.json
  const saveConfig = () => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  };

  if (input === "on") {
    config.CUSTOM_REACT = "true";
    saveConfig();
    return reply("*✅ Auto React Enabled*");
  }

  if (input === "off") {
    config.CUSTOM_REACT = "false";
    saveConfig();
    return reply("*❌ Auto React Disabled*");
  }

  if (["group","private","all"].includes(input)) {
    config.CUSTOM_REACT_MODE = input;
    saveConfig();
    const modeText = input === "all" ? "ALL chats" : input === "group" ? "GROUP chats only" : "PRIVATE chats only";
    return reply(`*🌍 Auto React set to ${modeText}*`);
  }

  // SET EMOJIS
  if (input.startsWith("emoji")) {
    const emojis = match.split(" ").slice(1).join(" ").trim();
    if (!emojis) return reply("*🫟 Example: `.custom-react emoji 😂,🔥,💀`*");

    config.CUSTOM_REACT_EMOJIS = emojis;
    saveConfig();
    return reply(`*✅ Custom React Emojis Updated to: ${emojis}*`);
  }

  reply("*❌ Unknown subcommand!* Use `.custom-react` to see available commands.");
});