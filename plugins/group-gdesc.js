const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "updategdesc",
    alias: ["upgdesc", "gdesc"],
    react: "📜",
    desc: "Change the group description.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");
        if (!isAdmins) return reply("*🔴 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to update the group description.*");
        if (!q) return reply("*🔴 Please provide a new group description.*");

        await conn.groupUpdateDescription(from, q);

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        reply(`*✔️ Group description has been updated to:*\n*${q}*`);

    } catch (e) {
        console.error("Error updating group description:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply(`*🔴 Failed to update the group description.*\n\n${e}`);
    }
});