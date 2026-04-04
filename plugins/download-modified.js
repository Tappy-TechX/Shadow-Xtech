const { fetchJson } = require("../lib/functions");
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

