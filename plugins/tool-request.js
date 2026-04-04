const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    react: "📨",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply("*_📌 Only the bot owner can use this command._*");
        }
        
        if (!args.length) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply(`*📝 Example: ${config.PREFIX}report Play command is not working*`);
        }

        const reportedMessages = {};
        const devNumber = "254756360306";
        const messageId = m.key.id;

        if (reportedMessages[messageId]) {
            await conn.sendMessage(from, {
                react: { text: "⚠️", key: m.key }
            });
            return reply("*📌 This report has already been forwarded to the owner. Please wait for a response.*");
        }
        reportedMessages[messageId] = true;

        // Kenyan time (EAT) formatted
        const time = new Date().toLocaleString("en-KE", {
            timeZone: "Africa/Nairobi",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const reportText = `*| REQUEST/BUG |*\n\n*👤 User*: @${m.sender.split("@")[0]}\n*📨 Request/Bug*: ${args.join(" ")}\n🕒 *Time:* ${time}\n💬 *Chat:* ${m.isGroup ? "Group Chat" : "Private Chat"}`;

        const confirmationText = `*👋 Hi ${m.pushName}, your request has been forwarded to the owner. Please wait...*`;

        await conn.sendMessage(`${devNumber}@s.whatsapp.net`, {
            text: reportText,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

        reply(confirmationText);
    } catch (error) {
        console.error(error);

        // ❌ Failure reaction (catch block)
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });

        reply("*🔴 An error occurred while processing your report.*");
    }
});