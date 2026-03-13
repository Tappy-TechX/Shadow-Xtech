const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data'); // Assuming these are correctly imported
const config = require('../config');

// Helper to send stylish text deletions
const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || '*(Empty Text Message)*';

    // Adding more emphasis to the deleted content
    const stylishContent = `\`\`\`${messageContent}\`\`\``; // Using code block for deleted text

    const fullMessage = `${deleteInfo}\n\n*💬 DELETED CONTENT:*\n${stylishContent}`;

    await conn.sendMessage(
        jid,
        {
            text: fullMessage,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

// Helper to handle stylish media deletions
const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];

    // Prepare context info for relaying the original message
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message, // This helps link to the original if possible
        };
    }

    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        // Set caption for image/video directly
        antideletedmek[messageType].caption = `${deleteInfo}\n\n*🖼️ / 🎥 Media Recovered*`; // Add a clear indicator
        await conn.relayMessage(jid, antideletedmek, {}); // Relay the media with new caption
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        // For audio/document, send info text first, then relay
        await conn.sendMessage(jid, { text: `*🚨 DELETED MEDIA DETECTED!* 🚨\n\n${deleteInfo}\n\n*🎵 / 📄 Media Recovered Below*` }, { quoted: mek });
        await conn.relayMessage(jid, antideletedmek, {}); // Relay the media
    } else {
        // Fallback for other media types (e.g., sticker, contact, location)
        await conn.sendMessage(jid, { text: `*🚨 DELETED MESSAGE DETECTED!* 🚨\n\n${deleteInfo}\n\n*♻️ Message Content Recovered Below*` }, { quoted: mek });
        await conn.relayMessage(jid, antideletedmek, {}); // Relay the message as-is
    }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteType = isGroup ? 'gc' : 'dm';
                const antiDeleteStatus = await getAnti(antiDeleteType); // Check if anti-delete is enabled for this chat type
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Ensure 24-hour format
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `
*🛡️ 𝐃𝐄𝐌𝐎𝐍 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 🛡️*

*⏰ Time:* ${deleteTime}
*👥 Group:* ${groupName}
*🗑️ Deleted by:* @${deleter}
*👤 Original Sender:* @${sender}
                    `.trim(); // Using trim() to remove leading/trailing whitespace
                    jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0]; // For DMs, original sender is remoteJid
                    const deleterNumber = update.key.remoteJid?.split('@')[0]; // For DMs, deleter is also remoteJid (since it's their deletion)

                    deleteInfo = `
*🛡️ 𝐃𝐄𝐌𝐎𝐍 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 🛡️*

*⏰ Time:* ${deleteTime}
*🗑️ Deleted by:* @${deleterNumber}
*👤 Original Sender:* @${senderNumber}
                    `.trim();
                    jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};

// By black-Tappy
