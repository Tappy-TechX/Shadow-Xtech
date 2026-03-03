const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');

let stickerData = null;
let cooldown = new Map(); // prevent spam
let stickerIndex = 0;     // track sequential sticker

// List of random emojis for reaction
const emojis = ["❤️","😂","😍","👍","🔥","😎","🥳","🤯","👏","✨","💯","😜"];

// Fetch sticker JSON once
async function getStickerData() {
  if (!stickerData) {
    const jsonUrl = 'https://raw.githubusercontent.com/Tappy-TechX/Shadow-Xtech-Data/main/autosticker.json';
    const res = await axios.get(jsonUrl);
    stickerData = Object.values(res.data); // get values array
  }
  return stickerData;
}

cmd({
  on: 'body'
}, async (conn, mek, m, { from, body, sender }) => {
  try {
    if (!body) return;
    if (mek.key.fromMe) return; // ignore bot messages
    if (config.AUTO_STICKER !== 'true') return;

    // ⏱ 3 sec cooldown per user
    const now = Date.now();
    const userCooldown = cooldown.get(sender) || 0;
    if (now - userCooldown < 3000) return;
    cooldown.set(sender, now);

    const stickers = await getStickerData();
    if (stickers.length === 0) return;

    // Pick sticker sequentially
    const stickerToSend = stickers[stickerIndex];
    stickerIndex = (stickerIndex + 1) % stickers.length; // loop back

    // Pick random emoji
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Send sticker with pack & author
    await conn.sendMessage(
      from,
      {
        sticker: {
          url: stickerToSend,
          packname: "Shadow-Xtech Stickers",
          author: "Tappy-TechX"
        }
      },
      { quoted: mek }
    );

    // React with random emoji
    await conn.sendMessage(from, { react: { text: randomEmoji, key: mek.key } });

  } catch (e) {
    console.error('AutoSticker+Emoji error:', e);
  }
});