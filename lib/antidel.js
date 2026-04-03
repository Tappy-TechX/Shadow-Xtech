const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage } = require('./store');
const { getAnti } = require('../data/antidel');
const config = require('../config');

async function DeletedText(conn, mek, jid, deleteInfo, isGroup, update) {
    const messageContent =
        mek.message?.conversation ||
        mek.message?.extendedTextMessage?.text ||
        'Unknown content';

    deleteInfo += `\n\n*📄 Content:* ${messageContent}`;

    await conn.sendMessage(
        jid,
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup
                    ? [update.key.participant, mek.key.participant]
                    : [update.key.remoteJid]
            }
        },
        { quoted: mek }
    );
}

async function DeletedMedia(conn, mek, jid, deleteInfo) {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];

    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.key.participant,
            quotedMessage: mek.message,
        };
    }

    if (['imageMessage', 'videoMessage'].includes(messageType)) {
        antideletedmek[messageType].caption = deleteInfo;
    } else {
        await conn.sendMessage(
            jid,
            { text: `*🚨 Deletion Detected!*\n\n${deleteInfo}` },
            { quoted: mek }
        );
    }

    await conn.relayMessage(jid, antideletedmek, {});
}

async function AntiDelete(conn, updates) {
    for (const update of updates) {
        if (update.update?.message === null || update.update?.messageStubType) {
            const store = loadMessage(update.key.id);
            if (!store || !store.message) continue;

            const mek = store.message;
            const isGroup = isJidGroup(store.jid);

            const antiType = isGroup ? 'gc' : 'dm';
            const isEnabled = await getAnti(antiType);

            // Skip if neither global nor per-chat toggle is true
            if (!config.ANTI_DELETE && !isEnabled) continue;
            if (!isEnabled) continue; // per-chat off

            const time = new Date().toLocaleTimeString('en-GB');
            let deleteInfo, jid;

            if (isGroup) {
                const groupMetadata = await conn.groupMetadata(store.jid);
                const groupName = groupMetadata.subject;

                const sender = mek.key.participant?.split('@')[0];
                const deleter = update.key.participant?.split('@')[0];

                deleteInfo = `-- AntiDelete Detected --
                                              
⏱️ Time: ${time}
🟢 Group: ${groupName}
📂 Deleted by: @${deleter}
👤 Sender: @${sender}`;

                jid = config.ANTI_DEL_PATH === "log"
                    ? config.OWNER
                    : store.jid;

            } else {
                const sender = mek.key.remoteJid?.split('@')[0];

                deleteInfo = `-- AntiDelete Detected --
                
⏱️ Time: ${time}
📂 Deleted by: @${sender}
👤 Sender: @${sender}`;

                jid = config.ANTI_DEL_PATH === "log"
                    ? config.OWNER
                    : store.jid;
            }

            if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
            } else {
                await DeletedMedia(conn, mek, jid, deleteInfo);
            }
        }
    }
}

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};