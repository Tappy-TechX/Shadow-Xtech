const { cmd } = require('../command');
const config = require('../config');

// Regex to detect ANY URL
const linkPatterns = [
      /\bhttps?:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i,
      /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|shorte\.st|rebrand\.ly|ow\.ly|v\.gd|t2m\.io)\b/i,
      /\b[a-z0-9-]+\.(com|net|org|io|me|gg|co|app|dev|xyz|site|link|ly|tv|us|ru|in|pk|ke)\b/i
    ];

cmd({
  on: 'body'
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
  try {
    // Only act if in a group, sender is not admin, and bot is admin
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Check if the message contains any link
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.DELETE_LINKS === 'true') {
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
  }
});