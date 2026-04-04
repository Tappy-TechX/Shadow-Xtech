const config = require('../config');  
const { cmd } = require('../command');  
const axios = require('axios');  

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; // replace if needed

cmd({  
  on: "body"  
}, async (conn, m, { isGroup }) => {  
  try {  
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;  
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;  

    const voiceClips = [  
      "https://files.catbox.moe/wbd7ib.mp3",  
      "https://files.catbox.moe/luzdz7.mp3",  
      "https://files.catbox.moe/3vpi1m.mp3",  
      "https://files.catbox.moe/h7uaqi.mp3",
      "https://files.catbox.moe/qid005.mp3"  
    ];  

    const thumbnails = [  
      "https://files.catbox.moe/qycj0s.jpg",  
      "https://files.catbox.moe/r2dxcc.jpg",  
      "https://files.catbox.moe/wea3ig.jpg",  
      "https://files.catbox.moe/1busib.jpg",  
      "https://files.catbox.moe/v7ptvy.jpg"  
    ];  

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];  
    const randomThumbnailUrl = thumbnails[Math.floor(Math.random() * thumbnails.length)];  
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';  

    // Generate custom waveform keeping exact symbols  
    const generateWaveformString = (durationSec) => {  
      const template = ['၊','၊','|','|','၊','|','။','|','|','|','|','။','၊','\u200B','\u200B','\u200B','၊','|'];  
      const waveformArray = template.map(s => {  
        if (Math.random() < 0.4) {  
          return template[Math.floor(Math.random() * template.length)];  
        }  
        return s;  
      });  
      const waveform = waveformArray.join('');  
      const minutes = Math.floor(durationSec / 60);  
      const seconds = durationSec % 60;  
      const timeStr = `${minutes}:${seconds.toString().padStart(2,'0')}`;  
      return `▶︎ •${waveform}• ${timeStr}`;  
    };  

    if (m.mentionedJid.includes(botNumber)) {  
      const thumbnailRes = await axios.get(randomThumbnailUrl, { responseType: 'arraybuffer' });  
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');  

      let estimatedDuration = 5;  
      try {  
        const headRes = await axios.head(randomClip);  
        const sizeBytes = parseInt(headRes.headers['content-length'] || '0', 10);  
        estimatedDuration = Math.max(2, Math.floor(sizeBytes / (32 * 1024)));  
      } catch (err) {  
        console.warn("Could not fetch Content-Length, using default duration");  
      }  

      const waveformString = generateWaveformString(estimatedDuration);  

      // Send audio as document + ptt + waveform caption + newsletter + new externalAdReply  
      await conn.sendMessage(m.chat, {  
        document: { url: randomClip },  
        mimetype: 'audio/mp4',  
        fileName: "voice.mp4",  
        ptt: true,  
        caption: waveformString,  
        contextInfo: {  
          forwardingScore: 999,  
          isForwarded: true,  
          forwardedNewsletterMessageInfo: {  
            newsletterJid: '120363369453603973@newsletter',  
            newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",  
            serverMessageId: 143  
          },  
          externalAdReply: {  
            title: "⚙️ Shadow-Xtech | Mention Reply",  
            body: "Fast • Reliable • Secure",  
            thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',  
            sourceUrl: whatsappChannelLink,  
            mediaType: 1,  
            renderLargerThumbnail: true 
          }  
        }  
      }, { quoted: m });  
    }  

  } catch (e) {  
    console.error(e);  
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";  
    await conn.sendMessage(ownerJid, {  
      text: `*Bot Error in Mention Handler:*\n${e.message}`  
    });  
  }  
});