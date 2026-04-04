const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "aiimg", "genimg"],
    react: "🎨",
    desc: "Generate AI images from text",
    category: "fun",
    use: ".img <prompt>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("*🖼️ Please provide a prompt*\n*Example: .img futuristic city at night*");
        }

        await reply(`*🎨 Generating image for "${query}"...*`);

        // Popcat AI Image API
        const imageUrl = `https://api.popcat.xyz/ai-image?prompt=${encodeURIComponent(query)}`;

        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: `*📷 Result for: ${query}\n> *© Powered by Shadow-Xtech 🔒*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("AI Image Error:", error);
        reply(`*❌ Error: ${error.message || "Failed to generate image"}*`);
    }
});