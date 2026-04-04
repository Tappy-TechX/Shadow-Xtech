const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isAdmins, isBotAdmins, botNumber, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");
        if (!isAdmins) return reply("*🔴 Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to use this command.*");

        let number;
        if (quoted) {
            number = quoted.sender.split("@")[0];
        } else if (q && q.includes("@")) {
            number = q.replace(/[@\s]/g, '');
        } else {
            return reply("*🔴 Please reply to a message or provide a number to promote.*");
        }

        if (number === botNumber) return reply("*🔴 The bot cannot promote itself.*");

        const jid = number + "@s.whatsapp.net";

        // 📡 Promote member
        await conn.groupParticipantsUpdate(from, [jid], "promote");

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply(`*✔️ Successfully promoted @${number} to admin.*`, { mentions: [jid] });

    } catch (error) {
        console.error("Promote command error:", error);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 Failed to promote the member.*");
    }
});