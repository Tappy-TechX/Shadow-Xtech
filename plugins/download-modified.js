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
      displayName: "⚙️ Insta | Reels 🧩",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Shadow-Xtech\nORG:Xtech Grid;\nTEL;type=CELL:+1234567890\nEND:VCARD"
    }
  }
};

cmd({
  pattern: "ig",
  alias: ["insta", "instagram"],
  desc: "Download Instagram videos or images.",
  react: "🎥",
  category: "download",
  filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
  try {

    if (processedMessages.has(m.key.id)) return;
    processedMessages.add(m.key.id);
    setTimeout(() => processedMessages.delete(m.key.id), 300000);

    if (!q || !q.startsWith("http")) {
      return reply("*📌 Please provide a valid Instagram link.*");
    }

    const valid = [
      /instagram\.com\/p\//,
      /instagram\.com\/reel\//,
      /instagram\.com\/tv\//,
      /instagram\.com\/stories\//,
      /instagr\.am\//
    ].some(v => v.test(q));

    if (!valid) {
      return reply("*⚠️ Invalid Instagram URL.*");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const res = await igdl(q);

    if (!res || !res.data || res.data.length === 0) {
      return reply("*❌ No media found.*");
    }

    const mediaList = res.data;

    for (let i = 0; i < Math.min(mediaList.length, 20); i++) {

      const media = mediaList[i];
      const url = media.url;

      const isVideo =
        media.type === "video" ||
        /\.(mp4|mov|avi|mkv|webm)$/i.test(url);

      const caption = "*_📥 Downloaded By Shadow -Xtech_*";

      const options = {
        caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "⚙️ Shadow-Xtech | Instagram Downloader",
            body: "Watch • Post • Share",
            thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
            sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      };

      if (isVideo) {
        await conn.sendMessage(
          from,
          {
            video: { url },
            mimetype: "video/mp4",
            ...options
          },
          { quoted: quotedContact }
        );
      } else {
        await conn.sendMessage(
          from,
          {
            image: { url },
            ...options
          },
          { quoted: quotedContact }
        );
      }

    }

  } catch (err) {
    console.error("IG Download Error:", err);
    reply("*🔴 Failed to download media.*");
  }
});
//------------------- twitter-dl -------------------------
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
      return conn.sendMessage(from, { text: "*📌 Please provide a valid Twitter URL.*" }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("*⚠️ Failed to retrieve Twitter video. Please check the link and try again.*");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `*📥 Twitter Downloader*
*Description: ${desc || "No description"}*

*Video:*
1️⃣ SD
2️⃣ HD

*Audio:*
3️⃣ Audio
4️⃣ Document
5️⃣ Voice

📌 Reply with the number to download.`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *Downloaded in HD Quality*"
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
              caption: "📥 *Audio Downloaded as Document*"
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
            reply("*❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.*");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("*🔴 An error occurred while processing your request. Please try again.*");
  }
});

//------------------- MediaFire-dl -----------------------
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

    const caption = `*📦 MEDIAFIRE DOWNLOAD*
*📂 File: ${file_name}*
*🌐 Type: ${mime_type}*
*⏳ Downloading your file...*`;

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

//-------------------- apk-dl ----------------------------
cmd({          
  pattern: "apk",          
  desc: "Download APK from Aptoide.",          
  category: "download",          
  react: "📂",
  filename: __filename          
}, async (conn, m, store, {          
  from,          
  quoted,          
  q,          
  reply          
}) => {          
  try {          
    if (!q) {          
      return reply("*📌 Please provide an app name to search.*");          
    }          

    // ⏳ Loading reaction
    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;          
    const response = await axios.get(apiUrl);          
    const data = response.data;          
          
    if (!data || !data.datalist || !data.datalist.list.length) {  
      
      // ❌ Error reaction
      await conn.sendMessage(from, {
        react: { text: "❌", key: m.key }
      });

      return reply("*⚠️ No results found for the given app name.*");          
    }          
          
    const app = data.datalist.list[0];          
    const appSize = (app.size / 1048576).toFixed(2);          
          
    const caption = `📂〔 *APK Downloader* 〕📂          
              
🔍 *Name:* ${app.name}          
🌐 *Size:* ${appSize} MB          
📦 *Package:* ${app.package}          
📅 *Updated On:* ${app.updated}          
👨‍💻 *Developer:* ${app.developer.name}          
          
> *© Powered By Shadow-Xtech 🎲*`;          

    await conn.sendMessage(from, {          
      document: { url: app.file.path_alt },          
      fileName: `${app.name}.apk`,          
      mimetype: "application/vnd.android.package-archive",          
      caption: caption          
    }, { quoted: m });          

    // ✅ Success reaction
    await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });

  } catch (error) {          
    console.error("Error:", error);          

    // ❌ Error reaction
    await conn.sendMessage(from, {
      react: { text: "❌", key: m.key }
    });

    reply("*🔴 An error occurred while fetching the APK. Please try again.*");          
  }          
});

//------------------ G-Drive-DL -------------------------
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
      return reply("*🔴 Please provide a valid Google Drive link.*");  
    }  

    // ♻️ Loading reaction
    await conn.sendMessage(from, {
      react: { text: "♻️", key: m.key }
    });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;  
    const response = await axios.get(apiUrl);  
    const downloadUrl = response.data.result.downloadUrl;  

    if (downloadUrl) {  

      // ⬇️ Download starting
      await conn.sendMessage(from, {
        react: { text: "⬇️", key: m.key }
      });

      await conn.sendMessage(from, {  
        document: { url: downloadUrl },  
        mimetype: response.data.result.mimetype,  
        fileName: response.data.result.fileName,  
        caption: `📂〔 *GDrive Downloader* 〕📂\n\n🔗 *File Name:* ${response.data.result.fileName}\n📁 *Type:* ${response.data.result.mimetype}\n> *© Powered By Shadow-Xtech 🎲*`  
      }, { quoted: m });  

      // ⬆️ Upload complete
      await conn.sendMessage(from, {
        react: { text: "⬆️", key: m.key }
      });

      // ✅ Success
      await conn.sendMessage(from, {
        react: { text: "✅", key: m.key }
      });

    } else {  
      // ❌ Error reaction
      await conn.sendMessage(from, {
        react: { text: "❌", key: m.key }
      });

      return reply("*⚠️ No download URL found. Please check the link and try again.*");  
    }  
  } catch (error) {  
    console.error("Error:", error);  

    // ❌ Error reaction
    await conn.sendMessage(from, {
      react: { text: "❌", key: m.key }
    });

    reply("*🔴 An error occurred while fetching the Google Drive file. Please try again.*");  
  }  
});