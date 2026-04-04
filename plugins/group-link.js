const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group",
    react: "🌐", 
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const groupMetadata = await conn.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin);

        const isBotAdmins = groupAdmins.some(admin => admin.id === botNumber);
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to get the group link.*");

        const isAdmins = groupAdmins.some(admin => admin.id === sender);
        if (!isAdmins) return reply("*🔴 Only group admins can request the group link.*");

        // 📡 Get the invite code
        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) return reply("*🔴 Failed to retrieve the invite code.*");

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        // Reply with the invite link
        reply(`*✔️ Here is your group invite link:*\n${inviteLink}`);

    } catch (error) {
        console.error("Invite command error:", error);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 An error occurred while fetching the group link.*\n_Error:_ ${error.message || "Unknown error"}`);
    }
});