const { cmd } = require("../command");
const config = require("../config"); // Your WhatsApp channel link

// Quoted contact card for replies
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

// Helper function to fetch real-time channel metadata
async function fetchChannelData(conn, inviteId) {
    try {
        const metadata = await conn.newsletterMetadata("invite", inviteId);
        if (!metadata || !metadata.id) throw new Error("Channel not found");

        return {
            id: metadata.id,
            name: metadata.name || "Unknown",
            followers: metadata.subscribers ?? 0,
            createdAt: metadata.creation_time
                ? new Date(metadata.creation_time * 1000)
                : null
        };
    } catch (err) {
        throw new Error("Failed to fetch channel metadata");
    }
}

cmd({
    pattern: "cid",
    alias: ["newsletter", "id"],
    react: "📡",
    desc: "Get WhatsApp Channel info from link",
    category: "whatsapp",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender }) => {
    try {
        if (!q)
            return reply(
                "❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/123456789"
            );

        const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match)
            return reply(
                "⚠️ Invalid channel link format.\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx"
            );

        const inviteId = match[1];

        // Fetch channel data
        let channelData;
        try {
            channelData = await fetchChannelData(conn, inviteId);
        } catch (err) {
            return reply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
        }

        const formattedText = `*— 乂 Channel Info —*\n\n` +
            `🆔 *ID:* ${channelData.id}\n` +
            `📌 *Name:* ${channelData.name}\n` +
            `👥 *Followers:* ${channelData.followers.toLocaleString()}\n` +
            `📅 *Created on:* ${channelData.createdAt ? channelData.createdAt.toLocaleString("id-ID") : "Unknown"}`;

        // Send message with copy button
        await conn.sendMessage(from, {
            text: formattedText,
            footer: "Shadow-Xtech | Channel Tracker",
            buttons: [
                { buttonId: `.copyid ${channelData.id}`, buttonText: { displayText: "Copy Channel ID 🆔" }, type: 1 }
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