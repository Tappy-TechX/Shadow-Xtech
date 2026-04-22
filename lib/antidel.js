const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage } = require('./store');
const { getAnti } = require('../data/antidel');
const config = require('../config');

/**
 * TEXT RESTORE
 */
async function DeletedText(conn, mek, jid, info, isGroup, update) {

    const content =
        mek.message?.conversation ||
        mek.message?.extendedTextMessage?.text ||
        'Unknown content';

    info += `\n\n📄 Content: ${content}`;

    await conn.sendMessage(jid, {
        text: info,
        contextInfo: {
            mentionedJid: isGroup
                ? [update.key.participant, mek.key.participant]
                : [update.key.remoteJid]
        }
    }, { quoted: mek });
}

/**
 * MEDIA RESTORE
 */
async function DeletedMedia(conn, mek, jid, info) {

    const msg = structuredClone(mek.message);
    const type = Object.keys(msg)[0];

    if (msg[type]) {
        msg[type].caption = info;
        msg[type].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.key.participant,
            quotedMessage: mek.message
        };
    }

    if (['imageMessage', 'videoMessage'].includes(type)) {
        await conn.relayMessage(jid, msg, {});
    } else {
        await conn.sendMessage(jid, {
            text: `🚨 Deleted Message Detected\n\n${info}`
        }, { quoted: mek });
    }
}

/**
 * MAIN ENGINE
 */
async function AntiDelete(conn, updates) {

    for (const update of updates) {

        // 🚨 ONLY DELETE EVENTS
        if (update.update?.message !== null) continue;

        const stored = loadMessage(update.key.id);
        if (!stored) return;

        const mek = stored.message;
        const isGroup = isJidGroup(stored.jid);

        const type = isGroup ? 'gc' : 'dm';
        const enabled = await getAnti(type);

        if (!config.ANTI_DELETE && !enabled) return;
        if (!enabled) return;

        const time = new Date().toLocaleTimeString('en-GB');

        let info;
        let jid;

        if (isGroup) {

            const meta = await conn.groupMetadata(stored.jid);
            const groupName = meta.subject;

            const sender = mek.key.participant?.split('@')[0];
            const deleter = update.key.participant?.split('@')[0];

            info =
`-- AntiDelete System --

⏱️ Time: ${time}
🟢 Group: ${groupName}
📂 Deleted by: @${deleter}
👤 Sender: @${sender}`;

            jid = config.ANTI_DEL_PATH === "log"
                ? config.OWNER
                : stored.jid;

        } else {

            const sender = mek.key.remoteJid?.split('@')[0];

            info =
`-- AntiDelete System --

⏱️ Time: ${time}
📂 Deleted by: @${sender}
👤 Sender: @${sender}`;

            jid = config.ANTI_DEL_PATH === "log"
                ? config.OWNER
                : stored.jid;
        }

        // 📌 ROUTE MESSAGE TYPE
        if (mek.message?.conversation || mek.message?.extendedTextMessage) {
            await DeletedText(conn, mek, jid, info, isGroup, update);
        } else {
            await DeletedMedia(conn, mek, jid, info);
        }
    }
}

module.exports = {
    AntiDelete,
    DeletedText,
    DeletedMedia
};