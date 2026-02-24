const { cmd } = require("../command");
const config = require("../config"); // Assuming your WhatsApp link is in config

// Contact used for quoting the reply
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Channel | Info 🚀",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
        }
    }
};

cmd({
    pattern: "cid",
    alias: ["newsletter", "id"],
    react: "📡",
    desc: "Get WhatsApp Channel info from link",
    category: "whatsapp",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender }) => {
    try {
        if (!q) return reply("❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/123456789");

        const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match) return reply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");

        const channelId = match[1];

        let metadata;
        try {
            // Fetch channel metadata using WhatsApp API
            metadata = await conn.newsletterMetadata("invite", channelId);
        } catch (e) {
            return reply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
        }

        if (!metadata || !metadata.id) return reply("❌ Channel not found or inaccessible.");

        // Current date and time
        const currentDateTime = new Date().toLocaleString("id-ID", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Stylish text for the message
        const stylishText = `*— 乂 Channel Info —*\n\n` +
            `🆔 *ID:* ${metadata.id}\n` +
            `📌 *Name:* ${metadata.name}\n` +
            `👥 *Subscribers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
            `📅 *Fetched on:* ${currentDateTime}`;

        // Send message with a button to copy the channel ID
        await conn.sendMessage(from, {
            text: stylishText,
            footer: "Shadow-Xtech | Channel Info",
            buttons: [
                { buttonId: `copyid_${metadata.id}`, buttonText: { displayText: "📋 Copy Channel ID" }, type: 1 }
            ],
            headerType: 1,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "🛰️ Shadow-Xtech | Channel Sync",
                    body: "Fast • Secure • Connected",
                    thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
                    sourceUrl: config.whatsappChannelLink || q,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

    } catch (error) {
        console.error("❌ Error in .cid plugin:", error);
        reply("⚠️ An unexpected error occurred.");
    }
});