const { cmd } = require("../command");
const { tiktokdl } = require("@bochilteam/scraper");

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ TikTok | Stream 📸",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\nEND:VCARD"
        }
    }
};

cmd({
    pattern: "tik-tok",
    alias: ["ttdl2","tt2","tiktokdl2"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("❗ Please provide a TikTok link.");
        if (!q.includes("tiktok.com")) return reply("🚫 Invalid TikTok link.");

        await conn.sendMessage(from,{ react:{ text:"⏳", key: mek.key }});

        const data = await tiktokdl(q);

        if (!data) return reply("⚠️ Failed to fetch TikTok video.");

        const videoUrl =
            data.video?.no_watermark ||
            data.video?.no_watermark_hd ||
            data.video?.watermark;

        if (!videoUrl) return reply("❌ Video not found.");

        const caption = "📥 *Downloaded by Shadow-Xtech*";

        await conn.sendMessage(from,{
            video:{ url: videoUrl },
            caption,
            contextInfo:{
                mentionedJid:[m.sender],
                forwardingScore:999,
                isForwarded:true,
                forwardedNewsletterMessageInfo:{
                    newsletterJid:"120363369453603973@newsletter",
                    newsletterName:"𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId:143
                },
                externalAdReply:{
                    title:"⚙️ Shadow-Xtech | TikPulse",
                    body:"Trend • Loop • Share",
                    thumbnailUrl:"https://files.catbox.moe/ubexsx.jpg",
                    sourceUrl:whatsappChannelLink,
                    mediaType:1,
                    renderLargerThumbnail:false
                }
            }
        },{ quoted: quotedContact });

    } catch (err) {
        console.error("TikTok Downloader Error:", err);
        reply("❌ Error downloading TikTok video.");
    }

});