const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");
        if (!isAdmins) return reply("*🔴 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to unlock the group.*");

        // 📡 Unlock group
        await conn.groupSettingUpdate(from, "unlocked");

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply("*✔️ Group has been unlocked. New members can now join.*");
    } catch (e) {
        console.error("Error unlocking group:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 Failed to unlock the group. Please try again.*");
    }
});