const config = require('../config');
const { cmd } = require('../command');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const fetch = require('node-fetch'); // Needed for thumbnail fetch

// NEW IMPORTS (from your first code)
const axios = require("axios");
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("@whiskeysockets/baileys");

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: ".yts <query>",
    react: "🔎",
    desc: "Search YouTube videos and get details, then download audio/video.",
    category: "search",
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply("❌ Please provide a search query");

    try {
        const apiUrl = `https://yts.giftedtech.co.ke/?q=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl, { timeout: 100000 });
        const results = res.data?.videos;

        if (!Array.isArray(results) || results.length === 0) {
            return reply("❌ No results found");
        }

        const videos = results.slice(0, 5);

        const cards = await Promise.all(
            videos.map(async (vid) => ({
                header: {
                    title: `🎬 *${vid.name}*`,
                    hasMediaAttachment: true,
                    imageMessage: (
                        await generateWAMessageContent(
                            { image: { url: vid.thumbnail } },
                            {
                                upload: conn.waUploadToServer,
                            },
                        )
                    ).imageMessage,
                },
                body: {
                    text: `📺 Duration: ${vid.duration}\n👁️ Views: ${vid.views}${vid.published ? `\n📅 Published: ${vid.published}` : ""}`,
                },
                footer: { text: `> ${config.FOOTER || "Bot"}` },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Copy Link",
                                copy_code: vid.url,
                            }),
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Watch on YouTube",
                                url: vid.url,
                            }),
                        },
                    ],
                },
            }))
        );

        const message = generateWAMessageFromContent(
            from,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                        },
                        interactiveMessage: {
                            body: { text: `🔍 YouTube Results for: *${q}*` },
                            footer: {
                                text: `📂 Displaying first *${videos.length}* videos`,
                            },
                            carouselMessage: { cards },
                        },
                    },
                },
            },
            { quoted: mek }
        );

        await conn.relayMessage(from, message.message, {
            messageId: message.key.id,
        });

    } catch (error) {
        console.error("YTS Error:", error);
        return reply("❌ Error fetching results. Try again later.");
    }
});