const { cmd } = require('../command');  
const config = require('../config');  

const axios = require("axios");  
const {  
  generateWAMessageContent,  
  generateWAMessageFromContent,  
} = require("gifted-baileys");  

const API_KEY = "AIzaSyAxGr0RkdqPMpAm7tJbyF_TOEinyWlkYsU";
const CX = "30ffb3bd32c7546c6";

cmd({  
  pattern: "google",  
  alias: ["ggle", "gglesearch", "googlesearch"],  
  desc: "Search Google and display first results",  
  category: "search",  
  react: "🔍",  
  filename: __filename,  
},  
async (conn, mek, m, { from, q, reply }) => {  

  // ⏳ Loading reaction  
  await conn.sendMessage(from, {  
    react: { text: "⏳", key: mek.key }  
  });  

  if (!q) {  
    await conn.sendMessage(from, {  
      react: { text: "❌", key: mek.key }  
    });  
    return reply("*Please provide a search query*");  
  }  

  try {  
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&key=${API_KEY}&cx=${CX}`;
    
    const res = await axios.get(apiUrl, { timeout: 60000 });  

    if (!res.data?.items || res.data.items.length === 0) {  
      await conn.sendMessage(from, {  
        react: { text: "❌", key: mek.key }  
      });  
      return reply("*No results found. Try a different query.*");  
    }  

    const results = res.data.items.slice(0, 5);  

    const defaultImg = "https://files.catbox.moe/79m9dv.jpg";  

    const cards = await Promise.all(  
      results.map(async (result) => ({  
        header: {  
          title: `🔍 *${result.title}*`,  
          hasMediaAttachment: true,  
          imageMessage: (  
            await generateWAMessageContent(  
              { image: { url: defaultImg } },  
              { upload: conn.waUploadToServer }  
            )  
          ).imageMessage,  
        },  
        body: {  
          text: `📝 ${result.snippet || "No description available"}`,  
        },  
        footer: {  
          text: `> *${config.BOT_NAME || "BOT"}*`,  
        },  
        nativeFlowMessage: {  
          buttons: [  
            {  
              name: "cta_copy",  
              buttonParamsJson: JSON.stringify({  
                display_text: "Copy Link",  
                copy_code: result.link,  
              }),  
            },  
            {  
              name: "cta_url",  
              buttonParamsJson: JSON.stringify({  
                display_text: "Open Link",  
                url: result.link,  
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
              body: {  
                text: `🔍 Google Results for: *${q}*`,  
              },  
              footer: {  
                text: `📂 Showing ${results.length} results`,  
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

    // ✅ Success reaction  
    await conn.sendMessage(from, {  
      react: { text: "✅", key: mek.key }  
    });  

  } catch (error) {  
    console.error("Google Search Error:", error?.response?.data || error.message);  

    await conn.sendMessage(from, {  
      react: { text: "❌", key: mek.key }  
    });  

    return reply("*🔴 Failed to perform Google search. Please try again.*");  
  }  
});