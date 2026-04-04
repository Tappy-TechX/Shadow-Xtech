const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "demoteadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, q, isGroup, isAdmins, isBotAdmins, botNumber, reply
}) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        // Check if the command is used in a group
        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        // Check if the user is an admin
        if (!isAdmins) return reply("*🔴 Only group admins can use this command.*");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to use this command.*");

        let number;
        if (quoted) {
            number = quoted.sender.split("@")[0]; // If replying to a message
        } else if (q && q.includes("@")) {
            number = q.replace(/[@\s]/g, ''); // If manually typing a number
        } else {
            return reply("*🔴 Please reply to a message or provide a number to demote.*");
        }

        // Prevent demoting the bot itself
        if (number === botNumber) return reply("*🔴 The bot cannot demote itself.*");

        const jid = number + "@s.whatsapp.net";

        // 📡 Demote member
        await conn.groupParticipantsUpdate(from, [jid], "demote");

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        reply(`*✔️ Successfully demoted @${number} to a normal member.*`, { mentions: [jid] });

    } catch (error) {
        console.error("Demote command error:", error);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply("*🔴 Failed to demote the member.*");
    }
});