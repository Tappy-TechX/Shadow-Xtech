const yts = require('yt-search');
const axios = require('axios');
const { cmd } = require('../command');

const PRINCE_API = 'https://api.princetechn.com/api/download';

// ── Shared quoted vCard (shows "Forwarded" + "View channel" like screenshot) ──
const quotedVcard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "POPKID-XMD",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:POPKID-XMD\nTEL;type=CELL;type=VOICE;waid=254111385747:+254111385747\nEND:VCARD`
        }
    }
};

// ── Newsletter context (shows "View channel" button at bottom) ────────────────
const newsletterCtx = (sender, title, body, thumbnail, sourceUrl) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363423997837331@newsletter',
        newsletterName: "ᴘᴏᴘᴋɪᴅ-xᴍᴅ ɴᴇᴛᴡᴏʀᴋ",
        serverMessageId: 143
    },
    externalAdReply: {
        title: title,
        body: body,
        mediaType: 1,
        renderLargerThumbnail: true,   // ← big YouTube style thumbnail
        thumbnailUrl: thumbnail,        // ← actual video thumbnail
        sourceUrl: sourceUrl            // ← links to youtube.com
    }
});

cmd({
    pattern: "marion",
    alias: ["songs", "musics"],
    desc: "Play and download a song from YouTube",
    category: "downloader",
    filename: __filename
}, async (conn, m, mek, { from, sender, args, reply }) => {
    try {
        const query = args.join(' ').trim();

        if (!query) return reply(
            `🎵 *POPKID MUSIC* 🎵\n\n` +
            `Send a song name to download!\n\n` +
            `*Example:*\n*.play cardigan*\n*.play taylor swift cardigan*`
        );

        // ── 1. React searching ────────────────────────────────────────────────
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // ── 2. Search YouTube ─────────────────────────────────────────────────
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return reply(`❌ *No results found for:* ${query}`);

        const {
            url,
            title,
            duration,
            views,
            author,
            thumbnail
        } = video;

        const viewsFormatted = views ? views.toLocaleString() : '0';
        const durationStr = duration?.timestamp || '';
        const channelName = author?.name || '';

        // ── 3. React downloading ──────────────────────────────────────────────
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // ── 4. Send "Downloading audio..." message (top card in screenshot) ───
        // This is the text message with big thumbnail that shows first
        await conn.sendMessage(from, {
            text: `🎵 *Downloading audio...*\n\n*${title}*\n🎬 ${channelName} | 🕐 ${durationStr}\n\n_Please wait..._`,
            contextInfo: newsletterCtx(
                sender,
                title,
                `${channelName} | ${durationStr} | ${viewsFormatted} views`,
                thumbnail,
                url
            )
        }, { quoted: quotedVcard });

        // ── 5. Call PrinceTech API ────────────────────────────────────────────
        const apiRes = await axios.get(`${PRINCE_API}/ytmp3`, {
            params: { apikey: 'prince', url }
        });

        const result = apiRes.data?.result;
        if (!result?.download_url) throw new Error('Download failed. Try again.');

        // ── 6. Fetch audio as buffer ──────────────────────────────────────────
        const fileRes = await axios.get(result.download_url, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(fileRes.data);

        // ── 7. React done ─────────────────────────────────────────────────────
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        // ── 8. Send audio with big thumbnail card + "Forwarded" + "View channel"
        // This is the audio player section in the screenshot
        await conn.sendMessage(from, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: newsletterCtx(
                sender,
                result.title || title,
                `${channelName} | ${durationStr} | ${viewsFormatted} views`,
                thumbnail,
                url
            )
        }, { quoted: quotedVcard });

    } catch (err) {
        console.error("PLAY ERROR:", err.message);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ *Failed:* ${err.message}`);
    }
});
