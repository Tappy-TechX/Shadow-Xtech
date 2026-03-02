const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

const processedMessages = new Set();

// Quoted contact setup    
const quotedContact = {    
  key: {    
    fromMe: false,    
    participant: "0@s.whatsapp.net",    
    remoteJid: "status@broadcast"    
  },    
  message: {    
    contactMessage: {    
      displayName: "🎬 Insta | Reels 🎥",    
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Shadow-Xtech\nORG:Xtech Grid;\nTEL;type=CELL:+1234567890\nEND:VCARD"    
    }    
  }    
};    
    
const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';    

cmd({    
  pattern: "ig",    
  alias: ["insta", "instagram"],    
  desc: "Download Instagram videos or images.",    
  react: "🎥",    
  category: "download",    
  filename: __filename    
}, async (conn, m, store, { from, q, reply }) => {    
  try {    
    if (!q || !q.startsWith("http")) {    
      return reply("❌ Please provide a valid Instagram link.");    
    }    

    const isValidUrl = [    
      /https?:\/\/(?:www\.)?instagram\.com\//,    
      /https?:\/\/(?:www\.)?instagr\.am\//    
    ].some(pattern => pattern.test(q));    

    if (!isValidUrl) {    
      return reply("⚠️ That doesn't look like a valid Instagram link.");    
    }    

    await conn.sendMessage(from, {    
      react: { text: "⏳", key: m.key }    
    });    

    const data = await igdl(q);

    if (!data || !data.data || data.data.length === 0) {    
      return reply("❌ No media found. Please double-check the link.");    
    }    

    for (let i = 0; i < Math.min(20, data.data.length); i++) {    
      const media = data.data[i];    
      const mediaUrl = media.url;    

      const isVideo =
        media.type === "video" ||
        /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl);

      const caption = `📥 Downloaded by Shadow-Xtech-V1`;

      const messageOptions = {    
        caption,    
        contextInfo: {    
          forwardingScore: 999,    
          isForwarded: true,    
          forwardedNewsletterMessageInfo: {    
            newsletterJid: '120363369453603973@newsletter',    
            newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",    
            serverMessageId: 143    
          },    
          externalAdReply: {    
            title: "⚙️ Shadow-Xtech | IG Pulse",    
            body: "Post • Story • Reel",    
            thumbnailUrl: "https://files.catbox.moe/2mnw2r.jpg",    
            sourceUrl: whatsappChannelLink,    
            mediaType: 1,    
            renderLargerThumbnail: false    
          }    
        }    
      };    

      if (isVideo) {    
        await conn.sendMessage(from, {    
          video: { url: mediaUrl },    
          mimetype: "video/mp4",    
          ...messageOptions    
        }, { quoted: quotedContact });    
      } else {    
        await conn.sendMessage(from, {    
          image: { url: mediaUrl },    
          ...messageOptions    
        }, { quoted: quotedContact });    
      }    
    }    

  } catch (error) {    
    console.error("Error in .ig command:", error);    
    reply("❌ An error occurred while processing your request.");    
  }    
});
//-------------------twitter-dl--------------------------

cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    // ✅ Clean Apple-Style Caption
    const caption = `╭───────────────
│ 𝕏 Twitter Downloader
╰───────────────

📝 Description:
${desc || "No description available"}

───────────────
🎬 Download Options

1. SD Quality
2. HD Quality
3. Audio (MP3)
4. Audio (Document)
5. Voice Note

Reply with a number to continue.`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || 
                           receivedMsg.message.extendedTextMessage?.text;

      const senderID = receivedMsg.key.remoteJid;

      const isReplyToBot =
        receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {

        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {

          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 Downloaded in SD Quality"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 Downloaded in HD Quality"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 Audio Downloaded as Document"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
//-------------------MediaFire-dl-----------------------

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭────────────
  🔥 *MediaFire DL*
╰────────────

*📄 ${file_name}*
*📦 ${mime_type}*

*⬇️ Downloading...*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

//---------------------apk-dl----------------------------

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭───────────────╮
   APK Downloader
╰───────────────╯

📦 Name: ${app.name}
🏋 Size: ${appSize} MB
📱 Package: ${app.package}
👨‍💻 Developer: ${app.developer.name}
📅 Updated: ${app.updated}

⬇️ Preparing download...`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

//-------------------------G-Drive-DL--------------------

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© Powered By Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ🔒*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
}); 
