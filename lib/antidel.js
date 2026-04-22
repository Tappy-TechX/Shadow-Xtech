const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage } = require('./store');
const { getAnti } = require('../data/antidel');
const config = require('../config');

async function DeletedText(conn, mek, jid, deleteInfo, isGroup, update) {

    const messageContent =
        mek.message?.conversation ||
        mek.message?.extendedTextMessage?.text ||
        'Unknown content';

    deleteInfo += `\n\n📄 Content: ${messageContent}`;

    await conn.sendMessage(jid, {
        text: deleteInfo,
        contextInfo: {
            mentionedJid: isGroup
                ? [update.key.participant, mek.key.participant]
                : [update.key.remoteJid]
        }
    }, { quoted: mek });
}

async function DeletedMedia(conn, mek, jid, deleteInfo) {
    const msg = structuredClone(mek.message);
    const type = Object.keys(msg)[0];

    if (msg[type]) {
        msg[type].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.key.participant,
            quotedMessage: mek.message,
        };
    }

    if (['imageMessage', 'videoMessage'].includes(type)) {
        msg[type].caption = deleteInfo;
        await conn.relayMessage(jid, msg, {});
    } else {
        await conn.sendMessage(jid, {
            text: `🚨 Deletion Detected!\n\n${deleteInfo}`
        }, { quoted: mek });
    }
}

async function AntiDelete(conn, updates) {

    for (const update of updates) {

        // ✅ REAL DELETE CHECK
        if (update.update?.message !== null) continue;

        const storeData = loadMessage(update.key.id);
        if (!storeData) return;

        const mek = storeData.message;
        const isGroup = isJidGroup(storeData.jid);

        const type = isGroup ? 'gc' : 'dm';
        const enabled = await getAnti(type);

        if (!config.ANTI_DELETE && !enabled) return;
        if (!enabled) return;

        const time = new Date().toLocaleTimeString('en-GB');

        let deleteInfo;
        let jid;

        if (isGroup) {

            const meta = await conn.groupMetadata(storeData.jid);
            const groupName = meta.subject;

            const sender = mek.key.participant?.split('@')[0];
            const deleter = update.key.participant?.split('@')[0];

            deleteInfo =
`-- AntiDelete Detected --

⏱️ Time: ${time}
🟢 Group: ${groupName}
📂 Deleted by: @${deleter}
👤 Sender: @${sender}`;

            jid = config.ANTI_DEL_PATH === "log"
                ? config.OWNER
                : storeData.jid;

        } else {

            const sender = mek.key.remoteJid?.split('@')[0];

            deleteInfo =
`-- AntiDelete Detected --

⏱️ Time: ${time}
📂 Deleted by: @${sender}
👤 Sender: @${sender}`;

            jid = config.ANTI_DEL_PATH === "log"
                ? config.OWNER
                : storeData.jid;
        }

        if (mek.message?.conversation || mek.message?.extendedTextMessage) {
            await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
        } else {
            await DeletedMedia(conn, mek, jid, deleteInfo);
        }
    }
}

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};