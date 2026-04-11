const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

cmd({ on: "body" }, async (conn, m, { isGroup }) => {
  try {

    // ❌ Only works if enabled + group chat
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;

    // 🔥 Bot JID (fixed safe format)
    const botNumber =
      (conn.user.id || conn.user.jid).split("@")[0] + "@s.whatsapp.net";

    // 📩 Get message text safely
    const msg =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      "";

    // 👥 Mentions (multiple fallbacks for reliability)
    const mentioned =
      m.mentionedJid ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
      [];

    // 🚨 FINAL FIX: detect bot mention reliably
    const botTag =
      mentioned.includes(botNumber) ||
      msg.includes(botNumber.split("@")[0]);

    if (!botTag) return;

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

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const randomClip = pickRandom(voiceClips);
    const randomThumbnailUrl = pickRandom(thumbnails);

    const generateWaveformString = (durationSec) => {
      const template = ['၊','|','။','|','၊','|','။','|','|','|','\u200B'];

      const waveformArray = template.map(s =>
        Math.random() < 0.4 ? pickRandom(template) : s
      );

      const waveform = waveformArray.join('');
      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;

      return `▶︎ •${waveform}• ${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    let estimatedDuration = 5;

    try {
      const headRes = await axios.head(randomClip);
      const sizeBytes = parseInt(headRes.headers['content-length'] || '0', 10);
      estimatedDuration = Math.max(2, Math.floor(sizeBytes / (32 * 1024)));
    } catch {}

    const waveformString = generateWaveformString(estimatedDuration);

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
          newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | Mention Reply",
          body: "Fast • Reliable • Secure",
          thumbnailUrl: randomThumbnailUrl,
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);

    const ownerJid = (conn.user.id || conn.user.jid).split("@")[0] + "@s.whatsapp.net";

    await conn.sendMessage(ownerJid, {
      text: `*Bot Error in Mention Handler:*\n${e.message}`
    });
  }
});