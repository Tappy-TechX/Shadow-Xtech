const { cmd } = require("../command");
const config = require("../config");
const fs = require("fs");

cmd({
  pattern: "customreact",
  alias: ["custom-react"],
  react: "⚙️",
  desc: "Enable or disable custom reactions and set emojis",
  category: "settings",
  filename: __filename,
},
async (conn, m, text, { args }) => {

  if (!args[0]) {
    return m.reply(
      `*Custom React Settings*\n\n` +
      `Usage:\n` +
      `• customreact on\n` +
      `• customreact off\n` +
      `• customreact set emoji1,emoji2,emoji3`
    );
  }

  const action = args[0].toLowerCase();

  if (action === "on") {
    config.CUSTOM_REACT = "true";
    return m.reply("✅ Custom reactions enabled");
  }

  if (action === "off") {
    config.CUSTOM_REACT = "false";
    return m.reply("❌ Custom reactions disabled");
  }

  if (action === "set") {
    const emojis = args.slice(1).join(" ");
    if (!emojis) return m.reply("❌ Please provide emojis separated by commas");

    config.CUSTOM_REACT_EMOJIS = emojis;
    return m.reply(`✅ Custom emojis updated:\n${emojis}`);
  }

  return m.reply("❌ Invalid option. Use on/off/set");
});