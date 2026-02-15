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

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

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

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(groupId, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

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
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                });

            } else if (update.action === 'remove' && config.WELCOME === 'false') {
                const GoodbyeText = `Goodbye @${userName} 😔\n` +
                    `Member left or was removed. 🚪\n` +
                    `Time: *${timestamp}* ⏰\n` +
                    `Remaining Members: *${groupMembersCount}* 👥`;

                await conn.sendMessage(groupId, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                });

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];
                await conn.sendMessage(groupId, {
                    text: `*Admin Event* ⚡\n\n@${demoter} demoted @${userName} from admin. 🔻\n` +
                          `⏰ Time: *${timestamp}*\n` +
                          `👥 Group: *${metadata.subject}*`,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author),
                });

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];
                await conn.sendMessage(groupId, {
                    text: `*Admin Event* 🎉\n\n@${promoter} promoted @${userName} to admin. 👑\n` +
                          `⏰ Time: *${timestamp}*\n` +
                          `👥 Group: *${metadata.subject}*`,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author),
                });
            }
        }
    } catch (err) {
        console.error('❌ Error in GroupEvents:', err);
    }
};

module.exports = GroupEvents;