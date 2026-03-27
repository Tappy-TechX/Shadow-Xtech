const { cmd } = require("../command");
const config = require("../config");

// Quoted contact
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
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {

        if (!q) {
            return reply("❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/xxxxxxxxx");
        }

        // Extract Channel ID
        const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match) {
            return reply("⚠️ *Invalid channel link format.*\n\nCorrect format:\nhttps://whatsapp.com/channel/xxxxxxxxx");
        }

        const inviteCode = match[1];

        // Fetch metadata from WhatsApp
        let metadata;
        try {
            metadata = await conn.newsletterMetadata("invite", inviteCode);
        } catch (err) {
            console.error("Metadata fetch error:", err);
            return reply("❌ Failed to fetch channel data. The link may be invalid or private.");
        }

        if (!metadata) {
            return reply("❌ Channel not found.");
        }

        // Safely fetch values
        const channelId = metadata.id || "N/A";
        const channelName = metadata.name || metadata.subject || "Unknown Channel";
        const subscribers = metadata.subscribers || metadata.followerCount || metadata.participantsCount || 0;

        // Format followers nicely
        const formattedSubscribers = Number(subscribers).toLocaleString("en-US");

        // Current Date & Time (English)
        const now = new Date();

        const formattedDate = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }).replace(",", " •");

        const formattedTime = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        // Stylish Output
        const stylishText =
`*— 乂 Channel Information —*

🆔 *Channel ID:* ${channelId}
📌 *Channel Name:* ${channelName}
👥 *Followers:* ${formattedSubscribers}

📅 ${formattedDate}
⏰ ${formattedTime}`;

        await conn.sendMessage(from, {
            text: stylishText,
            footer: "Shadow-Xtech | Channel Scanner",
            buttons: [
                {
                    buttonId: `copyid_${channelId}`,
                    buttonText: { displayText: "📋 Copy Channel ID" },
                    type: 1
                }
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
        reply("⚠️ Unexpected error occurred while fetching channel info.");
    }
});