const { cmd } = require('../command');

cmd({
    pattern: "jid",
    alias: ["id", "chatid", "gjid"],  
    desc: "Get full JID of current chat/user (Creator Only)",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isCreator, reply, sender 
}) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        if (!isCreator) {
            // ❌ Error reaction
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("*🔴 Command Restricted* - Only my creator can use this.");
        }

        if (isGroup) {
            // Ensure group JID ends with @g.us
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;

            // ✅ Success reaction
            await conn.sendMessage(from, {
                react: { text: "✅", key: mek.key }
            });

            return reply(`👥 *Group JID:*\n\`\`\`${groupJID}\`\`\``);
        } else {
            // Ensure user JID ends with @s.whatsapp.net
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;

            // ✅ Success reaction
            await conn.sendMessage(from, {
                react: { text: "✅", key: mek.key }
            });

            return reply(`👤 *User JID:*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("JID Error:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        return reply(`*🔴 Error fetching JID:*\n${e.message}`);
    }
});