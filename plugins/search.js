const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const {
    generateWAMessageContent,
    generateWAMessageFromContent
} = require('@whiskeysockets/baileys');

cmd({
    pattern: "yts",
    desc: "Search YouTube videos",
    category: "search",
    use: ".yts <query>",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        // ❌ No query
        if (!q) return reply("❌ Please provide a search query!");

        // 🔍 API Request
        const apiUrl = `https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        const results = res.data?.videos;

        // ❌ No results
        if (!Array.isArray(results) || results.length === 0) {
            return reply("❌ No results found");
        }

        const videos = results.slice(0, 5);

        // 🎴 Create Cards
        const cards = await Promise.all(
            videos.map(async (vid) => {
                let imageMessage;

                try {
                    const img = await generateWAMessageContent(
                        { image: { url: vid.thumbnail } },
                        { upload: conn.waUploadToServer }
                    );
                    imageMessage = img.imageMessage;
                } catch {
                    imageMessage = null;
                }

                return {
                    header: {
                        title: `🎬 ${vid.name}`,
                        hasMediaAttachment: !!imageMessage,
                        imageMessage
                    },
                    body: {
                        text:
                            `📺 Duration: ${vid.duration}\n` +
                            `👁️ Views: ${vid.views}` +
                            (vid.published ? `\n📅 Published: ${vid.published}` : "")
                    },
                    footer: {
                        text: config.FOOTER || "Bot"
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Copy Link",
                                    copy_code: vid.url
                                })
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Watch on YouTube",
                                    url: vid.url
                                })
                            }
                        ]
                    }
                };
            })
        );

        // 📩 Send Carousel Message
        const message = generateWAMessageFromContent(
            from,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: {
                            body: {
                                text: `🔍 YouTube Results for: *${q}*`
                            },
                            footer: {
                                text: `📂 Showing ${videos.length} results`
                            },
                            carouselMessage: { cards }
                        }
                    }
                }
            },
            { quoted: mek }
        );

        await conn.relayMessage(from, message.message, {
            messageId: message.key.id
        });

    } catch (error) {
        console.error("YTS Error:", error);

        // 🔁 Fallback simple message
        try {
            return reply("❌ Error fetching results. Try again later.");
        } catch {}
    }
});