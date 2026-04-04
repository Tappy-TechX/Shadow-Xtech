const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "🛹",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, reply, quoted, senderNumber }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        // Check if the command is used in a group
        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        // Get the bot owner's number dynamically
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("*🔴 Only the bot owner can use this command.*");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to use this command.*");

        let number;
        if (quoted) {
            number = quoted.sender.split("@")[0]; // If replying to a message
        } else if (q && q.includes("@")) {
            number = q.replace(/[@\s]/g, ''); // If mentioning a user
        } else {
            return reply("*🔴 Please reply to a message or mention a user to remove.*");
        }

        const jid = number + "@s.whatsapp.net";

        // 📡 Remove member
        await conn.groupParticipantsUpdate(from, [jid], "remove");

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply(`*✔️ Successfully removed @${number}*`, { mentions: [jid] });

    } catch (error) {
        console.error("Remove command error:", error);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Failed to remove the member.*`);
    }
});