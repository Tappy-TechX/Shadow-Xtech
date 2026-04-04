const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉", 
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("*🔴 Only the bot owner can use this command.*");
        }

        reply("*⏳ Leaving group...*");
        await sleep(1500);
        await conn.groupLeave(from);

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        reply("*✔️ Goodbye! 👋*");

    } catch (e) {
        console.error(e);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply(`*🔴 Error leaving group:* ${e}`);
    }
});