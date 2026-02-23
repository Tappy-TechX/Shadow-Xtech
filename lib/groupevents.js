// Give Me Credit If Using This File ✅
// Credits by Black Tappy 👑

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Contact used for quoting the reply
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Latency | Check 🚀",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

// Context info for mentions & forwarded messages
const getContextInfo = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363369453603973@newsletter',
        newsletterName: 'Shadow-Xtech 🚀',
        serverMessageId: 143,
    },
    externalAdReply: {
        title: "⚙️ Shadow-Xtech | System Pulse",
        body: "Speed • Stability • Sync",
        thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
        sourceUrl: whatsappChannelLink,
        mediaType: 1,
        renderLargerThumbnail: false,
    }
});

// Video to send (muted, looped like GIF)
const VIDEO_URL = 'https://files.catbox.moe/eubadj.mp4';

// Function to get formatted current time string
const getCurrentTime = () => {
    const tz = config.TIME_ZONE || 'UTC';
    const now = new Date();
    const options = {
        timeZone: tz,
        hour12: true,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
};

const GroupEvents = async (conn, update) => {
    try {
        const groupId = update?.id;
        if (!isJidGroup(groupId)) return;

        // Fetch metadata
        let metadata;
        try {
            metadata = await conn.groupMetadata(groupId);
        } catch (e) {
            console.warn(`Failed to fetch metadata for group ${groupId} ⚠️`, e);
            return;
        }

        const desc = metadata.desc || "No Description 📄";
        const groupMembersCount = metadata.participants.length;
        const timestamp = getCurrentTime();

        for (const participant of update.participants) {
            const userJid = participant;
            const userName = userJid.split('@')[0];

            // Welcome Message
            if (update.action === 'add' && config.WELCOME === 'false') {
                const WelcomeText = `Hey @${userName} 👋\n` +
                    `Welcome to *${metadata.subject}* 🎉\n` +
                    `You're member number *${groupMembersCount}* in this group. 🙏\n` +
                    `Time joined: *${timestamp}* ⏰\n\n` +
                    `📌 *Group Description:*\n${desc}\n\n` +
                    `*Powered by ${config.BOT_NAME || 'Shadow-Xtech'}* 🤖`;

                await conn.sendMessage(groupId, {
                    video: { url: VIDEO_URL },
                    caption: WelcomeText,
                    gifPlayback: true,
                    muted: true,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid)
                }, { quoted: quotedContact });
            }

            // Goodbye Message
            else if (update.action === 'remove' && config.WELCOME === 'false') {
                const GoodbyeText = `Goodbye @${userName} 😔\n` +
                    `Member left or was removed. 🚪\n` +
                    `Time: *${timestamp}* ⏰\n` +
                    `Remaining Members: *${groupMembersCount}* 👥`;

                await conn.sendMessage(groupId, {
                    video: { url: VIDEO_URL },
                    caption: GoodbyeText,
                    gifPlayback: true,
                    muted: true,
                    mentions: [userJid],
                    contextInfo: getContextInfo(userJid)
                }, { quoted: quotedContact });
            }

            // Admin Demote
            else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];
                const text = `*Admin Event* ⚡\n\n@${demoter} demoted @${userName} from admin. 🔻\n⏰ Time: *${timestamp}*\n👥 Group: *${metadata.subject}*`;

                await conn.sendMessage(groupId, {
                    video: { url: VIDEO_URL },
                    caption: text,
                    gifPlayback: true,
                    muted: true,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author)
                }, { quoted: quotedContact });
            }

            // Admin Promote
            else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];
                const text = `*Admin Event* 🎉\n\n@${promoter} promoted @${userName} to admin. 👑\n⏰ Time: *${timestamp}*\n👥 Group: *${metadata.subject}*`;

                await conn.sendMessage(groupId, {
                    video: { url: VIDEO_URL },
                    caption: text,
                    gifPlayback: true,
                    muted: true,
                    mentions: [update.author, userJid],
                    contextInfo: getContextInfo(update.author)
                }, { quoted: quotedContact });
            }
        }
    } catch (err) {
        console.error('❌ Error in GroupEvents:', err);
    }
};

module.exports = GroupEvents;
