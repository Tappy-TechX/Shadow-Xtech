const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "lockgc",
    alias: ["lock"],
    react: "🔒",
    desc: "Lock the group (Prevents new members from joining).",
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
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to lock the group.*");

        // 📡 Lock group
        await conn.groupSettingUpdate(from, "locked");

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply("*✔️ Group has been locked. New members cannot join.*");
    } catch (e) {
        console.error("Error locking group:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 Failed to lock the group. Please try again.*");
    }
});