// groupevent.js
const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

// WhatsApp Channel Link
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

const GroupEvents = async (conn, update) => {
  try {
    const isGroup = isJidGroup(update.id);
    if (!isGroup) return;

    const metadata = await conn.groupMetadata(update.id);
    const participants = update.participants;
    const desc = metadata.desc || "No Description";
    const groupMembersCount = metadata.participants.length;

    for (let user of participants) {
      const userName = user.split("@")[0];
      const localTime = new Date().toLocaleString(); // local time string

      // Welcome Event
      if (update.action === "add" && config.WELCOME === "true") {
        const WelcomeText = `👋 @${userName}\nMembers: ${groupMembersCount}\nTime: ${localTime}\nWelcome to ${metadata.subject}!\n${desc}`;
        
        await conn.sendMessage(update.id, {
          video: { url: 'https://files.catbox.moe/eubadj.mp4' },
          gifPlayback: true,
          caption: WelcomeText,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "⚙️ Shadow-Xtech | Group Report",
              body: "Speed • Stability • Sync",
              thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
              sourceUrl: whatsappChannelLink,
              mediaType: 1,
              renderLargerThumbnail: false,
            }
          }
        }, { quoted: quotedContact });
      }

      // Goodbye Event
      else if (update.action === "remove" && config.WELCOME === "true") {
        const GoodbyeText = `👋 @${userName}\nMembers left: ${groupMembersCount}\nTime: ${localTime}\nGoodbye from ${metadata.subject}!`;
        
        await conn.sendMessage(update.id, {
          video: { url: 'https://files.catbox.moe/eubadj.mp4' },
          gifPlayback: true,
          caption: GoodbyeText,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "⚙️ Shadow-Xtech | Group Report",
              body: "Speed • Stability • Sync",
              thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
              sourceUrl: whatsappChannelLink,
              mediaType: 1,
              renderLargerThumbnail: false,
            }
          }
        }, { quoted: quotedContact });
      }

      // Promote Event
      else if (update.action === "promote") {
        const promoter = update.actor.split("@")[0];
        const PromoteText = `👋 @${userName}\nPromoted by: @${promoter}\nMembers: ${groupMembersCount}\nTime: ${localTime}\n@${userName} is now an Admin in ${metadata.subject}`;
        
        await conn.sendMessage(update.id, {
          text: PromoteText,
          contextInfo: {
            mentionedJid: [user, update.actor],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "⚙️ Shadow-Xtech | Group Report",
              body: "Speed • Stability • Sync",
              thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
              sourceUrl: whatsappChannelLink,
              mediaType: 1,
              renderLargerThumbnail: false,
            }
          }
        }, { quoted: quotedContact });
      }

      // Demote Event
      else if (update.action === "demote") {
        const promoter = update.actor.split("@")[0];
        const DemoteText = `👋 @${userName}\nDemoted by: @${promoter}\nMembers: ${groupMembersCount}\nTime: ${localTime}\n@${userName} is no longer an Admin in ${metadata.subject}`;
        
        await conn.sendMessage(update.id, {
          text: DemoteText,
          contextInfo: {
            mentionedJid: [user, update.actor],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              title: "⚙️ Shadow-Xtech | Group Report",
              body: "Speed • Stability • Sync",
              thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
              sourceUrl: whatsappChannelLink,
              mediaType: 1,
              renderLargerThumbnail: false,
            }
          }
        }, { quoted: quotedContact });
      }
    }
  } catch (error) {
    console.error("❌ Group Event Error:", error);
    await conn.sendMessage(update.id, {
      text: `❌ An error occurred while processing group events.\n${error}`,
      contextInfo: { mentionedJid: participants }
    });
  }
};

module.exports = GroupEvents;
