const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const Config = require('../config');
const fs = require('fs-extra');
const axios = require('axios');

// Helper: Download media from URL
async function downloadMedia(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// ==================== Take ====================
cmd({
    pattern: 'take',
    alias: ['rename', 'stake'],
    desc: 'Create a sticker with a custom pack name and multiple emojis.',
    category: 'sticker',
    use: '<emojis> <packname> (reply to media or URL)',
    filename: __filename,
}, async (conn, mek, m, { quoted, args, reply }) => {
    try {
        if (!quoted) return reply('*Reply to a sticker, image, or video.*');
        if (!args.length) return reply('*Provide emojis and pack name like: .take 🙂 MyPack*');

        // Extract emojis and pack name
        let emojiList = [];
        let packNameIndex = 0;
        for (let i = 0; i < args.length; i++) {
            if (/\p{Emoji}/u.test(args[i])) {
                emojiList.push(args[i]);
            } else {
                packNameIndex = i;
                break;
            }
        }
        let packName = args.slice(packNameIndex).join(' ');
        if (!packName) packName = Config.STICKER_NAME || 'Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ';
        if (!emojiList.length) emojiList.push('🤩'); // default emoji

        // Download media
        let media;
        const mime = quoted.mtype;
        if (mime === 'stickerMessage' || mime === 'imageMessage' || mime === 'videoMessage') {
            media = await quoted.download();
        } else if (args[packNameIndex] && args[packNameIndex].startsWith('http')) {
            media = await downloadMedia(args[packNameIndex]);
        } else {
            return reply('*Unsupported media. Reply to an image, sticker, video, or provide a valid URL.*');
        }

        const sticker = new Sticker(media, {
            pack: packName,
            author: Config.STICKER_AUTHOR || 'Black-Tappy',
            type: StickerTypes.FULL,
            categories: emojiList,
            id: Math.random().toString(36).slice(2, 10),
            quality: 75,
            background: 'transparent'
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply('*❌ Failed to create sticker. Make sure your media is valid.*');
    }
});

// ==================== Sticker Command with Multiple Emojis ====================
cmd({
    pattern: 'sticker',
    alias: ['s', 'stickergif'],
    desc: 'Create a sticker from media or URL with optional multiple emojis.',
    category: 'sticker',
    use: '<optional emojis> (reply to media or URL)',
    filename: __filename,
}, async (conn, mek, m, { quoted, args, reply }) => {
    try {
        // Extract emojis
        let emojiList = [];
        let mediaArgIndex = 0;
        for (let i = 0; i < args.length; i++) {
            if (/\p{Emoji}/u.test(args[i])) {
                emojiList.push(args[i]);
            } else {
                mediaArgIndex = i;
                break;
            }
        }
        if (!emojiList.length) emojiList.push('🤩'); // default

        // Download media
        let media;
        const mime = quoted ? quoted.mtype : null;
        if (mime === 'imageMessage' || mime === 'stickerMessage' || mime === 'videoMessage') {
            media = await quoted.download();
        } else if (args[mediaArgIndex] && args[mediaArgIndex].startsWith('http')) {
            media = await downloadMedia(args[mediaArgIndex]);
        } else {
            return reply('*Unsupported media. Reply to an image, sticker, video, or provide a valid URL.*');
        }

        const sticker = new Sticker(media, {
            pack: Config.STICKER_NAME || 'Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ',
            author: Config.STICKER_AUTHOR || 'Black-Tappy',
            type: StickerTypes.FULL,
            categories: emojiList,
            id: Math.random().toString(36).slice(2, 10),
            quality: 75,
            background: 'transparent'
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply('*❌ Failed to create sticker. Check your media or URL.*');
    }
});