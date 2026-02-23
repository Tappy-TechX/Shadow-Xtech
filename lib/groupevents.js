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

// Fallback images
const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

// GIFs for events
const gifUrls = {
    join: [
        'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
        'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
        'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif'
    ],
    leave: [
        'https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif',
        'https://media.giphy.com/media/l4pTdcifjB2H5eLx2/giphy.gif',
        'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif'
    ],
    admin: [
        'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
        'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
        'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif'
    ]
};

// Helper function to get "X hours/minutes ago"
function timeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return `${diffSec} second${diffSec > 1 ? 's' : ''} ago`;
}

// Get formatted timestamp with timezone
function getTimestamp() {
    const now = new Date();
    const timeZone = config.TIME_ZONE || 'UTC';
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    }).format(now) + ' 🌍';
}

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

        for (const participant of update.participants) {
            const userJid = participant;
            const userName = userJid.split('@')[0];
            const timestamp = getTimestamp();
            const now = new Date();

            // Select random media
            const randomGif = (type) => gifUrls[type][Math.floor(Math.random() * gifUrls[type].length)];
            const fallbackImg = ppUrls[Math.floor(Math.random() * ppUrls.length)];

            if (update.action === 'add' && config.WELCOME === 'false') {
                const joinAgo = timeAgo(now);

                const WelcomeText = `Hey @${userName} 👋\n` +
                    `Welcome to *${metadata.subject}* 🎉\n` +
                    `You're member number *${groupMembersCount}* in this group. 🙏\n` +
                    `Joined: *${joinAgo}* ⏱️\n` +
                    `Time joined: *${timestamp}* ⏰\n\n` +
                    `📌 *Group Description:*\n${desc}\n\n` +
                    `*Powered by ${config.BOT_NAME || 'Shadow-Xtech'}* 🤖`;

                await conn.sendMessage(groupId, {
                    video: { url: randomGif('join') },
                    caption: WelcomeText,
                    gifPlayback: true,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                });

            } else if (update.action === 'remove' && config.WELCOME === 'false') {
                const leftAgo = timeAgo(now);

                const GoodbyeText = `Goodbye @${userName} 😔\n` +
                    `Member left or was removed. 🚪\n` +
                    `Left: *${leftAgo}* ⏱️\n` +
                    `Time: *${timestamp}* ⏰\n` +
                    `Remaining Members: *${groupMembersCount}* 👥`;

                await conn.sendMessage(groupId, {
                    video: { url: randomGif('leave') },
                    caption: GoodbyeText,
                    gifPlayback: true,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid),
                });

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];

                await conn.sendMessage(groupId, {
                    video: { url: randomGif('admin') },
                    caption: `*Admin Event* ⚡\n\n@${demoter} demoted @${userName} from admin. 🔻\n` +
                             `⏰ Time: *${timestamp}*\n` +
                             `👥 Group: *${metadata.subject}*`,
                    gifPlayback: true,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author),
                });

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];

                await conn.sendMessage(groupId, {
                    video: { url: randomGif('admin') },
                    caption: `*Admin Event* 🎉\n\n@${promoter} promoted @${userName} to admin. 👑\n` +
                             `⏰ Time: *${timestamp}*\n` +
                             `👥 Group: *${metadata.subject}*`,
                    gifPlayback: true,
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
