const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data/antidel');
const config = require('../config');

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent =
        mek.message?.conversation ||
        mek.message?.extendedTextMessage?.text ||
        '*(Empty Text Message)*';

    const stylishContent = `\`\`\`\n${messageContent}\n\`\`\``;

    const fullMessage =
        `${deleteInfo}\n\n💬 *DELETED CONTENT:*\n${stylishContent}`;

    await conn.sendMessage(
        jid,
        {
            text: fullMessage,
            contextInfo: {
                mentionedJid: isGroup
                    ? [update.key.participant, mek.key.participant]
                    : [update.key.remoteJid],
            },
        },
        { quoted: mek }
    );
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const clonedMessage = JSON.parse(JSON.stringify(mek.message));
    const messageType = Object.keys(clonedMessage)[0];

    if (clonedMessage[messageType]) {
        clonedMessage[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.key.participant || mek.participant,
            quotedMessage: mek.message,
        };
    }

    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        clonedMessage[messageType].caption =
            `${deleteInfo}\n\n🖼️ / 🎥 Media Recovered`;

        await conn.relayMessage(jid, clonedMessage, {});
    } else {
        await conn.sendMessage(
            jid,
            { text: `🚨 *DELETED MEDIA DETECTED!*\n\n${deleteInfo}` },
            { quoted: mek }
        );

        await conn.relayMessage(jid, clonedMessage, {});
    }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message !== null) continue;

        const store = await loadMessage(update.key.id);
        if (!store || !store.message) continue;

        const mek = store.message;
        const isGroup = isJidGroup(store.jid);
        const antiDeleteType = isGroup ? 'gc' : 'dm';
        const antiDeleteStatus = await getAnti(antiDeleteType);

        if (!antiDeleteStatus) continue;

        const deleteTime = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        let deleteInfo;
        let jid;

        if (isGroup) {
            const metadata = await conn.groupMetadata(store.jid);
            const groupName = metadata.subject;

            const sender = mek.key.participant?.split('@')[0];
            const deleter = update.key.participant?.split('@')[0];

            deleteInfo =
`🛡️ 𝐃𝐄𝐌𝐎𝐍 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 🛡️

⏰ Time: ${deleteTime}
👥 Group: ${groupName}
🗑️ Deleted by: @${deleter}
👤 Original Sender: @${sender}`;

            jid =
                config.ANTI_DEL_PATH === 'log'
                    ? conn.user.id
                    : store.jid;

        } else {
            const senderNumber =
                mek.key.remoteJid?.split('@')[0];

            deleteInfo =
`🛡️ 𝐃𝐄𝐌𝐎𝐍 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 🛡️

⏰ Time: ${deleteTime}
🗑️ Deleted by: @${senderNumber}
👤 Original Sender: @${senderNumber}`;

            jid =
                config.ANTI_DEL_PATH === 'log'
                    ? conn.user.id
                    : update.key.remoteJid;
        }

        if (
            mek.message?.conversation ||
            mek.message?.extendedTextMessage
        ) {
            await DeletedText(
                conn,
                mek,
                jid,
                deleteInfo,
                isGroup,
                update
            );
        } else {
            await DeletedMedia(
                conn,
                mek,
                jid,
                deleteInfo
            );
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};