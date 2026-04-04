const fs = require("fs");
const path = require('path');
const axios = require("axios");
const config = require("../config");
const { cmd, commands } = require("../command");
const { downloadContentFromMessage, useMultiFileAuthState, makeWASocket } = require('@adiwajshing/baileys'); // Ensure you import these if used

// Privacy menu
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Privacy | Dashboard 🛡️",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
    }
  }
};

// Privacy menu command
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
    let whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 

    let privacyMenu = `> 🛡️ *Privacy Settings* 🛡️
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
    }, { quoted: quotedContact });

  } catch (e) {
    console.log(e);
    reply(`* 🔴Error: ${e.message}*`);
  }
});

// Blocklist
cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "privacy",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");

    try {
        const blockedUsers = await conn.fetchBlocklist();

        if (blockedUsers.length === 0) {
            return reply("*_📋 Your block list is empty._*");
        }

        const list = blockedUsers
            .map((user, i) => `⛔ BLOCKED ${user.split('@')[0]}`)
            .join('\n');

        const count = blockedUsers.length;
        reply(`*📋 Blocked Users (${count}):*\n\n*${list}*`);
    } catch (err) {
        console.error(err);
        reply(`*_🔴 Failed to fetch block list: ${err.message}_*`);
    }
});

// Get bio
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
        if (!about) return reply("*_📝 Oops! It seems this user hasn’t set a bio yet._*");
        return reply(`*👤 User Bio:*\n\n${about.status}`);
    } catch (error) {
        console.error("*🔴 Error in bio command:*", error);
        reply("*_📌 No bio available for this user_*");
    }
});

// Set profile pic privacy
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");

    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];

        if (!validValues.includes(value)) {
            return reply("*_🔴 Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'._*");
        }

        await conn.updateProfilePicturePrivacy(value);
        reply(`*_✅ Profile picture privacy updated to: ${value}_*`);
    } catch (e) {
        return reply(`*🔴 An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// Set online privacy
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");

    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'match_last_seen'];

        if (!validValues.includes(value)) {
            return reply("*_🔴 Invalid option. Valid options are: 'all', 'match_last_seen'._*");
        }

        await conn.updateOnlinePrivacy(value);
        reply(`*_✅ Online privacy updated to: ${value}_*`);
    } catch (e) {
        return reply(`*🔴 An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// Set bot profile pic
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "privacy",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { quoted, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");
    if (!quoted || !quoted.message.imageMessage) return reply("*_🔴 Please reply to an image._*");

    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        await conn.updateProfilePicture(conn.user.jid, { url: `file://${mediaPath}` });
        reply("*_✨ Profile picture updated successfully!_*");
    } catch (error) {
        console.error("*_🔴Error updating profile picture:_*", error);
        reply(`*_🔴 Error updating profile picture: ${error.message}_*`);
    }
});

// Set bot display name
cmd({
    pattern: "setmyname",
    desc: "Set your WhatsApp display name.",
    category: "privacy",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");
    const displayName = args.join(" ");
    if (!displayName) return reply("*_📌 Please provide a display name._*");

    try {
        const { state, saveCreds } = await useMultiFileAuthState('path/to/auth/folder');
        const conn2 = makeWASocket({ auth: state, printQRInTerminal: true });
        conn2.ev.on('creds.update', saveCreds);
        await conn2.updateProfileName(displayName);
        reply(`*_✅ Your display name has been set to: ${displayName}_*`);
    } catch (err) {
        console.error(err);
        reply("*_🔴 Failed to set your display name._*");
    }
});

// Update bot bio
cmd({
    pattern: "updatebio",
    react: "🆔",
    desc: "Change the Bot number Bio.",
    category: "privacy",
    use: '.updatebio',
    filename: __filename
},
async (conn, mek, m, { q, reply, isOwner, from }) => {
    try {
        if (!isOwner) return reply('*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*');
        if (!q) return reply('*_📝 Please type your new bio below to update it!_*');
        if (q.length > 139) return reply('*_📌 Text limit reached! Please reduce the characters and try again._*');

        await conn.updateProfileStatus(q);
        await conn.sendMessage(from, { text: "*_✔️ New Bio Added Successfully_*" }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        console.log(e);
    }
});

// Group add privacy
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*");

    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];

        if (!validValues.includes(value)) {
            return reply("*_📌 Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'._*");
        }

        await conn.updateGroupsAddPrivacy(value);
        reply(`*_✅ Group add privacy updated to: ${value}_*`);
    } catch (e) {
        return reply(`*🔴 An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// Get bot privacy settings
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Privacy | Dashboard 🚀",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`
    }
  }
};

cmd({
  pattern: "getprivacy",
  react: "🆔",
  desc: "Get the bot's current privacy settings.",
  category: "privacy",
  use: ".getprivacy",
  filename: __filename
}, 
async (conn, mek, m, { reply, isOwner, sender }) => {
  try {
    // ✅ Channel link 
    let whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 

    if (!isOwner) 
      return reply('*_🚫 Sorry! This feature is for the owner only. Keep exploring other commands!_*');

    const privacy = await conn.fetchPrivacySettings?.(true);
    if (!privacy) 
      return reply('*_🚫 Failed to fetch privacy settings._*');

    let message = `
╭───「 PRIVACY SETTINGS 」───
│ ∘ Read Receipts : ${privacy.readreceipts}
│ ∘ Profile Picture : ${privacy.profile}
│ ∘ Status : ${privacy.status}
│ ∘ Online : ${privacy.online}
│ ∘ Last Seen : ${privacy.last}
│ ∘ Group Add : ${privacy.groupadd}
│ ∘ Call Privacy : ${privacy.calladd}
╰───────────────────`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | System Privacy",
          body: "Privacy • Protection • Security",
          thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact });

  } catch (e) {
    reply('*🚫 An error occurred while fetching privacy settings.*\n\n' + e);
    console.log(e);
  }
});

// Get user profile pic
cmd({
    pattern: "getpp",
    desc: "Fetch the profile picture of a tagged or replied user.",
    category: "owner",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { quoted, sender, reply }) => {
    try {
        const targetJid = quoted ? quoted.sender : sender;
        if (!targetJid) return reply("*_📌 Please reply to a message to fetch the profile picture._*");

        const userPicUrl = await conn.profilePictureUrl(targetJid, "image").catch(() => null);
        if (!userPicUrl) return reply("*_⛔ No profile picture found for the specified user._*");

        await conn.sendMessage(m.chat, {
            image: { url: userPicUrl },
            caption: "*_👤 Here is the profile picture of the specified user._*"
        });
    } catch (e) {
        console.error("*🔴Error fetching user profile picture:*", e);
        reply("*_🔴 An error occurred while fetching the profile picture. Please try again later._*");
    }
});