const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");
const { downloadContentFromMessage } = require('@adiwajshing/baileys');

// ------------------------- REUSABLE QUOTED CONTACT -------------------------
const quotedContact = (title = "⚙️ Shadow-Xtech") => ({
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: title,
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
END:VCARD`
    }
  }
});

// ------------------------- PRIVACY MENU -------------------------
cmd({
  pattern: "privacy",
  alias: ["privacymenu"],
  desc: "Privacy settings menu",
  category: "privacy",
  react: "🛡️",
  filename: __filename
}, 
async (conn, mek, m, { from, sender, reply }) => {
  try {
    const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 
    const privacyMenu = `
> 🛡️ *Privacy Settings* 🛡️
 📌 •blocklist - View blocked users
 📌 •getbio - Get user's bio
 📌 •setppall - Set profile pic privacy
 📌 •setonline - Set online privacy
 📌 •setpp - Change bot's profile pic
 📌 •setmyname - Change bot's name
 📌 •updatebio - Change bot's bio
 📌 •groupsprivacy - Set group add privacy
 📌 •getprivacy - View current privacy settings
 📌 •getpp - Get user's profile picture

> ⚙️ *Options for privacy commands:*
 👥 •all | Everyone
 👤 •contacts | My contacts only
 ⛔ •contact_blacklist | Contacts except blocked
 🚫 •none | Nobody
 ⏱ •match_last_seen | Match last seen

 🌐 *Note:* Most commands are owner-only`;

    await conn.sendMessage(from, {
      text: privacyMenu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | Privacy Panel",
          body: "Secure • Trusted • Safe",
          thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact("⚙️ Privacy | Dashboard 🛡️") });

  } catch (e) {
    console.log(e);
    reply(`* 🔴Error: ${e.message}*`);
  }
});

// ------------------------- BLOCKLIST -------------------------
cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "privacy",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("*_🚫 This feature is for the owner only._*");

    try {
        const blockedUsers = await conn.fetchBlocklist();
        if (!blockedUsers.length) return reply("*_📋 Your block list is empty._*");

        const list = blockedUsers.map((user, i) => `⛔ BLOCKED ${user.split('@')[0]}`).join('\n');
        reply(`*📋 Blocked Users (${blockedUsers.length}):*\n\n*${list}*`);
    } catch (err) {
        console.error(err);
        reply(`*_🔴 Failed to fetch block list: ${err.message}_*`);
    }
});

// ------------------------- GET BIO -------------------------
cmd({
    pattern: "getbio",
    desc: "Displays the user's bio.",
    category: "privacy",
    react: "📝",
    filename: __filename,
},
async (conn, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await conn.fetchStatus?.(jid);
        if (!about) return reply("*_📝 User hasn’t set a bio yet._*");
        reply(`*👤 User Bio:*\n\n${about.status}`);
    } catch (error) {
        console.error(error);
        reply("*_📌 No bio available for this user_*");
    }
});

// ------------------------- SET PROFILE PICTURE PRIVACY -------------------------
cmd({
    pattern: "setppall",
    desc: "Update profile picture privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Owner only._*");
    const value = args[0] || 'all';
    const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];

    if (!validValues.includes(value)) return reply("*_🔴 Valid options: all, contacts, contact_blacklist, none._*");

    try {
        await conn.updateProfilePicturePrivacy(value);
        reply(`*_✅ Profile picture privacy updated to: ${value}_*`);
    } catch (e) {
        reply(`*_🔴 Error updating profile picture privacy: ${e.message}_*`);
    }
});

// ------------------------- SET ONLINE PRIVACY -------------------------
cmd({
    pattern: "setonline",
    desc: "Update online privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Owner only._*");
    const value = args[0] || 'all';
    const validValues = ['all', 'match_last_seen'];

    if (!validValues.includes(value)) return reply("*_🔴 Valid options: all, match_last_seen._*");

    try {
        await conn.updateOnlinePrivacy(value);
        reply(`*_✅ Online privacy updated to: ${value}_*`);
    } catch (e) {
        reply(`*_🔴 Error updating online privacy: ${e.message}_*`);
    }
});

// ------------------------- SET BOT PROFILE PICTURE -------------------------
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "privacy",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { quoted, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Owner only._*");
    if (!quoted?.message?.imageMessage) return reply("*_🔴 Please reply to an image._*");

    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        await conn.updateProfilePicture(conn.user.jid, { url: `file://${mediaPath}` });
        reply("*_✨ Profile picture updated successfully!_*");
    } catch (error) {
        console.error(error);
        reply(`*_🔴 Error updating profile picture: ${error.message}_*`);
    }
});

// ------------------------- SET BOT DISPLAY NAME -------------------------
cmd({
    pattern: "setmyname",
    desc: "Set bot display name.",
    category: "privacy",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Owner only._*");
    const displayName = args.join(" ");
    if (!displayName) return reply("*_📌 Please provide a display name._*");

    try {
        await conn.updateProfileName(displayName);
        reply(`*_✅ Display name updated to: ${displayName}_*`);
    } catch (err) {
        console.error(err);
        reply("*_🔴 Failed to set display name._*");
    }
});

// ------------------------- UPDATE BOT BIO -------------------------
cmd({
    pattern: "updatebio",
    react: "🆔",
    desc: "Change bot bio.",
    category: "privacy",
    filename: __filename
},
async (conn, mek, m, { q, reply, isOwner }) => {
    if (!isOwner) return reply('*_🚫 Owner only._*');
    if (!q) return reply('*_📝 Please type your new bio._*');
    if (q.length > 139) return reply('*_📌 Max 139 characters._*');

    try {
        await conn.updateProfileStatus(q);
        reply("*_✔️ Bio updated successfully_*");
    } catch (e) {
        console.error(e);
        reply('*_🔴 Failed to update bio._*');
    }
});

// ------------------------- GET PRIVACY SETTINGS -------------------------
cmd({
  pattern: "getprivacy",
  react: "🆔",
  desc: "Get bot's current privacy settings.",
  category: "privacy",
  filename: __filename
}, 
async (conn, mek, m, { reply, isOwner, sender }) => {
  if (!isOwner) return reply('*_🚫 Owner only._*');

  try {
    const privacy = await conn.fetchPrivacySettings?.(true);
    if (!privacy) return reply('*_🚫 Failed to fetch privacy settings._*');

    const message = `
╭───「 PRIVACY SETTINGS 」───
│ ∘ Read Receipts : ${privacy.readreceipts}
│ ∘ Profile Picture : ${privacy.profile}
│ ∘ Status : ${privacy.status}
│ ∘ Online : ${privacy.online}
│ ∘ Last Seen : ${privacy.last}
│ ∘ Group Add : ${privacy.groupadd}
│ ∘ Call Privacy : ${privacy.calladd}
╰───────────────────`.trim();

    await conn.sendMessage(m.chat, { text: message }, { quoted: quotedContact("⚙️ Privacy | Dashboard 🚀") });
  } catch (e) {
    console.error(e);
    reply('*🚫 Error fetching privacy settings.*');
  }
});

// ------------------------- GET USER PROFILE PICTURE -------------------------
cmd({
    pattern: "getpp",
    desc: "Fetch profile picture of a tagged or replied user.",
    category: "privacy",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { quoted, sender, reply }) => {
    try {
        const targetJid = quoted?.sender || sender;
        if (!targetJid) return reply("*_📌 Reply to a message to fetch profile picture._*");

        const userPicUrl = await conn.profilePictureUrl(targetJid, "image").catch(() => null);
        if (!userPicUrl) return reply("*_⛔ No profile picture found._*");

        await conn.sendMessage(m.chat, {
            image: { url: userPicUrl },
            caption: "*_👤 Here is the profile picture of the specified user._*"
        });
    } catch (e) {
        console.error(e);
        reply("*_🔴 Error fetching profile picture. Try again later._*");
    }
});