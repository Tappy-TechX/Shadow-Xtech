const axios = require("axios");
const { cmd } = require("../command");

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Contact used for quoting the reply
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "📜 Bible | Verse💡",
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
    pattern: "bible",
    desc: "Fetch Bible verses by reference.",
    category: "fun",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { args, reply, from, sender }) => {
    try {
        if (args.length === 0) {
            return reply(`⚠️ *Please provide a Bible reference.*\n\n📝 *Example:*\n*.bible John 1:1*`);
        }

        const reference = args.join(" ");
        const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data.text) {
            const { reference: ref, text, translation_name } = response.data;

            // Stylish text for final reply
            const stylishText =
                `📜 *Bible Verse Found!*\n\n` +
                `📖 *Reference: ${ref}*\n` +
                `📚 *Text: ${text}*\n\n` +
                `🗂️ *Translation: ${translation_name}*\n\n` +
                `*© SHADOW-XTECH BIBLE*`;

            // Send final report with quoted contact + external ad reply
            await conn.sendMessage(
                from,
                {
                    text: stylishText,
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
                            title: "⚙️ Shadow-Xtech | Bible Menu",
                            body: "Pray • Believe • Receive",
                            thumbnailUrl: "https://files.catbox.moe/2mnw2r.jpg",
                            sourceUrl: whatsappChannelLink,
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                },
                { quoted: quotedContact }
            );

        } else {
            reply("❌ *Verse not found.* Please check the reference and try again.");
        }
    } catch (error) {
        console.error(error);
        reply("⚠️ *An error occurred while fetching the Bible verse.* Please try again.");
    }
});