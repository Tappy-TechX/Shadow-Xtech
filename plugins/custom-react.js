const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "custom-react",
    alias: ["customreact"],
    react: "🔥",
    desc: "Enable or disable auto-react feature",
    category: "settings",
    filename: __filename
},
async (client, message, match, { isOwner, reply }) => {

if (!isOwner) {
return reply("*📛 Only the owner can use this command!*");
}

if (!match) {
return reply(`*🌟 CUSTOM-REACT SETTINGS*

Status : ${config.CUSTOM_REACT}
Mode   : ${config.CUSTOM_REACT_MODE}

Commands

.custom-react on
.custom-react off
.custom-react group
.custom-react private
.custom-react all
.custom-react emoji 😂
.custom-react emoji 😂,🔥,💀
`);
}

const input = match.toLowerCase();

if (input === "on") {
config.CUSTOM_REACT = "true";
return reply("*✅ Auto React Enabled*");
}

if (input === "off") {
config.CUSTOM_REACT = "false";
return reply("*❌ Auto React Disabled*");
}

if (input === "group") {
config.CUSTOM_REACT_MODE = "group";
return reply("*👥 Auto React set to GROUP chats only*");
}

if (input === "private") {
config.CUSTOM_REACT_MODE = "private";
return reply("*📩 Auto React set to PRIVATE chats only*");
}

if (input === "all") {
config.CUSTOM_REACT_MODE = "all";
return reply("*🌍 Auto React set to ALL chats*");
}

// SET EMOJIS
if (input.startsWith("emoji")) {

const emojis = match.replace(/emoji/i,"").trim();

if (!emojis) {
return reply("*⚠️ Example:*\n.custom-react emoji 😂,🔥,💀");
}

config.CUSTOM_REACT_EMOJIS = emojis;

return reply(`*✅ Custom React Emojis Updated to ${emojis}*`);
}

});