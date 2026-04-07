const { cmd } = require('../command');
const config = require("../config");

// Anti-Link System
const linkPatterns = [
      /\bhttps?:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i,
      /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|shorte\.st|rebrand\.ly|ow\.ly|v\.gd|t2m\.io)\b/i,
      /\b[a-z0-9-]+\.(com|net|org|io|me|gg|co|app|dev|xyz|site|link|ly|tv|us|ru|in|pk|ke)\b/i
    ];

cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK_KICK === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, {
        'text': `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`,
        'mentions': [sender]
      }, { 'quoted': m });

      await conn.groupParticipantsUpdate(from, [sender], "remove");
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});
