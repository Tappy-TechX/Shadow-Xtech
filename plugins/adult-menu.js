const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "adult",
    alias: ["adultmenu"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {

        let dec = `╭───❍「 *18+ CMD 🔞* 」❍
├⬡ .xvideo
├⬡ .porn
├⬡ .xvideos
├⬡ .randomporn
├⬡ .randomxvideo
╰───────────────❍`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/78nvv0.jpg" },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363369453603973@newsletter",
                        newsletterName: "Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ AI",
                        serverMessageId: 143
                    },

                    externalAdReply: {
                        title: "🤖 Shadow-Xtech AI System",
                        body: "Advanced 18+ Command Panel",
                        thumbnailUrl: "https://files.catbox.moe/78nvv0.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});