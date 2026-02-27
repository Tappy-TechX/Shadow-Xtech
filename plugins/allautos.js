//-----------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

//-----------------------------------------------------
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    react: "🔔",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return reply("*_🟢 Admin event notifications are now enabled._*");
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return reply("*_🔴 Admin event notifications are now disabled._*");
    } else {
        return reply(`*_🫟 Example: .admin-events on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return reply("*_🟢 Welcome messages are now enabled._*");
    } else if (status === "off") {
        config.WELCOME = "false";
        return reply("*_🔴 Welcome messages are now disabled._*");
    } else {
        return reply(`*_🫟 Example: .welcome on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const newPrefix = args[0]; // Get the new prefix from the command arguments
    if (!newPrefix) return reply("*_❌ Please provide a new prefix. Example: `.setprefix !`_*");

    // Update the prefix in memory
    config.PREFIX = newPrefix;

    return reply(`*_🟢 Prefix successfully changed to ${newPrefix}_*`);
});
//-----------------------------------------------------
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    // If no argument is provided, show current mode and usage
    if (!args[0]) {
        return reply(`*_📌 Current mode:_* *_${config.MODE}_*\n\n*_🌐 Usage: .mode private OR .mode public_*`);
    }

    const modeArg = args[0].toLowerCase();

    if (modeArg === "private") {
        config.MODE = "private";
        return reply("*_🟢 Bot mode is now set to `PRIVATE.`_*");
    } else if (modeArg === "public") {
        config.MODE = "public";
        return reply("*_🔴 Bot mode is now set to `PUBLIC.`_*");
    } else {
        return reply("*_❌ Invalid mode. Please use `.mode private` or `.mode public`._*");
    }
});
//-----------------------------------------------------
//-----------------------------------------------------
cmd({
    pattern: "autotyping",
    react: "⌨️",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*_🫟 Example: .autotyping on_*");
    }

    config.AUTO_TYPING = status === "on" ? "true" : "false";
    return reply(`*_🟢 Auto typing has been turned ${status}._*`);
});
//-----------------------------------------------------
cmd({
    pattern: "mention-reply",
    alias: ["mentionreply", "mee"],
    react: "💬",
    description: "Set bot status to always online or offline.",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        return reply("*_🟢 Mention Reply feature is now enabled._*");
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        return reply("*_🔴 Mention Reply feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .mee on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    react: "⚡",
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        await reply("*_🟢 always online mode is now enabled._*");
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        await reply("*_🔴 always online mode is now disabled._*");
    } else {
        await reply(`*🛠️ Example: . always-online on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-recording",
    alias: ["autorecording"],
    react: "🎙️",
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*_🫟 Example: .auto-recording on_*");
    }

    config.AUTO_RECORDING = status === "on" ? "true" : "false";
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return reply("*_🟢 Auto recording is now enabled. Bot is recording..._*");
    } else {
        await conn.sendPresenceUpdate("available", from);
        return reply("*_🔴 Auto recording has been disabled._*");
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    react: "👀",
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return reply("*_🟢 Auto-viewing of statuses is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return reply("*_🔴 Auto-viewing of statuses is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autostatusview on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "status-react",
    alias: ["autostatusreact"],
    react: "❤️",
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return reply("*_🟢 Auto-liking of statuses is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return reply("*_🔴 Auto-liking of statuses is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autostatusreact on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "read-message",
    alias: ["autoread"],
    react: "📖",
    desc: "Enable or disable read-message feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return reply("*_🟢 Read-message feature is now enabled._*");
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return reply("*_🔴 Read-message feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autoread on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-voice",
    alias: ["autovoice"],
    react: "🎤",
    desc: "Enable or disable auto-voice feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_VOICE = "true";
        return reply("*_🟢 Auto-voice feature is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_VOICE = "false";
        return reply("*_🔴 Auto-voice feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autovoice on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "anti-bad",
    alias: ["antibadword"],
    react: "🚫",
    desc: "Enable or disable anti-bad word feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        return reply("*_🟢 Anti-bad word is now enabled._*");
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        return reply("*_🔴 Anti-bad word feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .antibadword on_`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    react: "✨",
    desc: "Enable or disable auto-sticker feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return reply("*_🟢 Auto-sticker feature is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return reply("*_🔴 Auto-sticker feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autosticker on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    react: "💬",
    desc: "Enable or disable auto-reply feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        return reply("*_🟢 Auto-reply is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        return reply("*_🔴 Auto-reply feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autoreply on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "auto-react",
    alias: ["autoreact"],
    react: "🔥",
    desc: "Enable or disable auto-react feature",
    category: "settings",
    filename: __filename
},      
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        return reply("*_🟢 Auto-react is now enabled._*");
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        return reply("*_🔴 Auto-react feature is now disabled._*");
    } else {
        return reply(`*_🫟 Example: .autoreact on_*`);
    }
});
//-----------------------------------------------------
cmd({
    pattern: "status-reply",
    alias: ["autostatusreply"],
    react: "💌",
    desc: "Enable or disable status-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*_📛 Only the owner can use this command!_*");

    const status = args[0]?.toLowerCase();

    if (status === "on") {
        config.AUTO_STATUS_REPLY = "true";
        return reply("*_🟢 Status-reply feature is now enabled._*");
    } else if (status === "off") {
        config.AUTO_STATUS_REPLY = "false";
        return reply("*_🔴 Status-reply feature is now disabled._*");
    } else {
        return reply("*_🫟 Example: .autostatusreply on_*");
    }
});
//-----------------------------------------------------

//-----------------------------------------------------
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('*_📛 This command can only be used in a group._*');
    if (!isBotAdmins) return reply('*_📛 Bot must be an admin to use this command._*');
    if (!isAdmins) return reply('*_📛 You must be an admin to use this command._*');

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      reply("*_🟢 ANTI_LINK has been enabled._*");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      reply("*_🔴 ANTI_LINK has been disabled._*");
    } else {
      reply("*_💡Usage: `.antilink on/off`_*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});
//-----------------------------------------------------
cmd({
  pattern: "antilink-kick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('*_📛 This command can only be used in a group._*');
    if (!isBotAdmins) return reply('*_📛 Bot must be an admin to use this command._*');
    if (!isAdmins) return reply('*_📛 You must be an admin to use this command._*');

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      reply("*_🟢 ANTI_LINK_KICK has been enabled._*");
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      reply("*_🔴 ANTI_LINK_KICK has been disabled._*");
    } else {
      reply("*_💡Usage: `.antilink-kick on/off`_*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});
//-----------------------------------------------------
cmd({
  pattern: "deletelink",
  alias: ["linksdelete"],
  desc: "Enable or disable DELETE_LINKS in groups",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply }) => {
  try {
    if (!isGroup) return reply('*_📛 This command can only be used in a group._*');
    if (!isBotAdmins) return reply('*_📛 Bot must be an admin to use this command._*');
    if (!isAdmins) return reply('*_📛 You must be an admin to use this command._*');

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      reply("*_🔴 DELETE_LINKS is now enabled._*");
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      reply("*_🔴 DELETE_LINKS is now disabled._*");
    } else {
      reply("*_💡Usage: `.deletelink on/off`_*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});
//-----------------------------------------------------