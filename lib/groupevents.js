// Give Me Credit If Using This File ✅
// Credits by Black Tappy 👑

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363369453603973@newsletter',
        newsletterName: 'Shadow-Xtech 🚀',
        serverMessageId: 143,
    },
});

// Video URL for all group events
const videoUrl = 'https://files.catbox.moe/eubadj.mp4';

const GroupEvents = async (conn, update) => {
    try {
        const groupId = update?.id;
        if (!isJidGroup(groupId)) return;

        let metadata;
        try {
            metadata = await conn.groupMetadata(groupId);
        } catch (e) {
            console.warn(`Failed to fetch metadata for group ${groupId} ⚠️`, e);
            return;
        }

        const desc = metadata.desc || "No Description 📄";
        const groupMembersCount = metadata.participants.length;

        const timestamp = new Date().toLocaleString('en-US', { timeZone: config.TIME_ZONE || 'UTC 🌍' });

        for (const participant of update.participants) {
            const userJid = participant;
            const userName = userJid.split('@')[0];

            if (update.action === 'add' && config.WELCOME === 'false') {
                const WelcomeText = `Hey @${userName} 👋\n` +
                    `Welcome to *${metadata.subject}* 🎉\n` +
                    `You're member number *${groupMembersCount}* in this group. 🙏\n` +
                    `Time joined: *${timestamp}* ⏰\n\n` +
                    `📌 *Group Description:*\n${desc}\n\n` +
                    `*Powered by ${config.BOT_NAME || 'Shadow-Xtech'}* 🤖`;

                await conn.sendMessage(groupId, {
                    video: { url: videoUrl },
                    caption: WelcomeText,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                    mimetype: 'video/mp4',
                    gifPlayback: true, // loop video like GIF
                    seconds: 10, // optional: adjust video duration
                    fileName: 'welcome.mp4',
                });

            } else if (update.action === 'remove' && config.WELCOME === 'false') {
                const GoodbyeText = `Goodbye @${userName} 😔\n` +
                    `Member left or was removed. 🚪\n` +
                    `Time: *${timestamp}* ⏰\n` +
                    `Remaining Members: *${groupMembersCount}* 👥`;

                await conn.sendMessage(groupId, {
                    video: { url: videoUrl },
                    caption: GoodbyeText,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                    mimetype: 'video/mp4',
                    gifPlayback: true,
                    fileName: 'goodbye.mp4',
                });

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];
                await conn.sendMessage(groupId, {
                    video: { url: videoUrl },
                    caption: `*Admin Event* ⚡\n\n@${demoter} demoted @${userName} from admin. 🔻\n` +
                             `⏰ Time: *${timestamp}*\n` +
                             `👥 Group: *${metadata.subject}*`,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author),
                    mimetype: 'video/mp4',
                    gifPlayback: true,
                    fileName: 'demote.mp4',
                });

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];
                await conn.sendMessage(groupId, {
                    video: { url: videoUrl },
                    caption: `*Admin Event* 🎉\n\n@${promoter} promoted @${userName} to admin. 👑\n` +
                             `⏰ Time: *${timestamp}*\n` +
                             `👥 Group: *${metadata.subject}*`,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author),
                    mimetype: 'video/mp4',
                    gifPlayback: true,
                    fileName: 'promote.mp4',
                });
            }
        }
    } catch (err) {
        console.error('❌ Error in GroupEvents:', err);
    }
};

module.exports = GroupEvents;
