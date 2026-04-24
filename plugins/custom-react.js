const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "customreact",
  alias: ["custom-react"],
  react: "⚙️",
  desc: "Enable/disable custom reactions and manage emojis",
  category: "settings",
  filename: __filename,
},
async (conn, m, text, { args }) => {

  const status = config.CUSTOM_REACT === "true" ? "🟢 Enabled" : "🔴 Disabled";
  const emojis = config.CUSTOM_REACT_EMOJIS || "🥲,😂,👍🏻,🙂,😔";

  // SHOW STATUS IF NO ARGUMENT
  if (!args[0]) {
    return m.reply(
      `⚙️ *Custom Reaction Settings*\n\n` +
      `📊 Status: ${status}\n` +
      `😊 Emojis: ${emojis}\n\n` +
      `📌 Commands:\n` +
      `• customreact on\n` +
      `• customreact off\n` +
      `• customreact set emoji1,emoji2,emoji3`
    );
  }

  const action = args[0].toLowerCase();

  // ENABLE
  if (action === "on") {
    config.CUSTOM_REACT = "true";

    return m.reply(
      `✅ *Custom Reactions Enabled*\n\n` +
      `📊 Status: 🟢 Enabled\n` +
      `😊 Emojis: ${config.CUSTOM_REACT_EMOJIS}`
    );
  }

  // DISABLE
  if (action === "off") {
    config.CUSTOM_REACT = "false";

    return m.reply(
      `❌ *Custom Reactions Disabled*\n\n` +
      `📊 Status: 🔴 Disabled\n` +
      `ℹ️ Bot will no longer auto-react to messages.`
    );
  }

  // SET EMOJIS
  if (action === "set") {
    const emojisInput = args.slice(1).join(" ");

    if (!emojisInput) {
      return m.reply(
        `❌ *Missing Emojis*\n\n` +
        `Example:\n` +
        `customreact set 😂,🔥,💀,❤️`
      );
    }

    config.CUSTOM_REACT_EMOJIS = emojisInput;

    return m.reply(
      `✅ *Custom Emojis Updated*\n\n` +
      `😊 New Emojis: ${emojisInput}\n` +
      `📊 Status: ${config.CUSTOM_REACT === "true" ? "🟢 Enabled" : "🔴 Disabled"}`
    );
  }

  return m.reply(
    `❌ *Invalid Option*\n\n` +
    `Use:\n` +
    `• customreact on\n` +
    `• customreact off\n` +
    `• customreact set emoji1,emoji2`
  );
});