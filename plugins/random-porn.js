const { cmd } = require("../command");
const fetch = require("node-fetch"); // ensure node-fetch is installed

// --- MODIFICATION ---
// Array to hold multiple API URLs
const apiEndpoints = [
    "https://apis-keith.vercel.app/dl/hentaivid"
    // You can add more APIs with same JSON format
];

// Quoted contact for forwarding/newsletter
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "🔞 Adult | Explicit Content 🔥",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Shadow-Xtech Weather Bot
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
NOTE:Real-time Weather • Forecast • AQI • Alerts
END:VCARD`
        }
    }
};

cmd({
    pattern: "randomporn",
    alias: ["hey'', "randomxvideos', "randporn", "randxvideo", "randxvideos"],
    desc: "Get a random adult video from various online APIs.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply, sender }) => {
    try {
        // 1. Send a "searching" reaction
        await conn.sendMessage(from, {
            react: {
                text: '🔍',
                key: mek.key
            }
        });

        // 2. Select a random API and fetch data
        const randomApiUrl = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];
        const response = await fetch(randomApiUrl);
        const data = await response.json();

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("❌ No videos found from the selected API. Please try again.");
        }

        // 3. Pick a random video
        const randomVideo = data.result[Math.floor(Math.random() * data.result.length)];
        const { title, category, media, views_count } = randomVideo;
        const { video_url } = media;

        if (!video_url) {
            return reply("❌ The selected item from the API did not contain a valid video URL. Please try again.");
        }

        // 4. Create caption for video preview
        const caption = `
████████████████
*🟠 SHADOW-XTECH 🔥*
████████████████
🎥 *Title:* ${title}
📂 *Category:* ${category}
👀 *Views:* ${views_count}
        `;

        // 5. Send the video preview
        const sentMessage = await conn.sendMessage(from, {
            video: { url: video_url },
            caption: caption
        }, { quoted: mek });

        const sentMessageId = sentMessage.key.id;

        // 6. Send forwarded newsletter + external ad reply
        const message = "Here’s your video preview! Reply with *download* to get the full video.";
        const whatsappChannelLink = "https://chat.whatsapp.com/yourchannel"; // replace with your link

        await conn.sendMessage(from, {
            text: message,
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
                    title: "🌦 Shadow-Xtech | Intelligent Weather",
                    body: "Smart Advice • Alerts • AQI • GPS",
                    thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedContact });

        // 7. Listen for user reply "download"
        conn.ev.on("messages.upsert", async (upsert) => {
            const receivedMessage = upsert.messages[0];
            if (!receivedMessage.message) return;

            const conversation = receivedMessage.message.conversation ||
                receivedMessage.message.extendedTextMessage?.text;
            const remoteJid = receivedMessage.key.remoteJid;

            const isReplyToOurMessage = receivedMessage.message.extendedTextMessage?.contextInfo?.stanzaId === sentMessageId;

            if (isReplyToOurMessage && conversation) {
                await conn.sendMessage(remoteJid, { react: { text: '⬇️', key: receivedMessage.key } });

                if (conversation.toLowerCase() === "download") {
                    await conn.sendMessage(remoteJid, {
                        video: { url: video_url },
                        caption: `📥 *Download your requested video:* ${title}`
                    }, { quoted: receivedMessage });
                } else {
                    reply("❌ Invalid option! Please reply with *download* to get the video.");
                }
            }
        });

    } catch (error) {
        console.error('Error in randomporn command:', error);
        reply("❌ An error occurred while processing your request. Please try again.");
    }
});