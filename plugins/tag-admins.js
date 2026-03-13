const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagadmins",
    react: "👑",
    alias: ["gc_tagadmins"],
    desc: "Tag all Admins of the Group",
    category: "group",
    use: '.tagadmins [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("*_🔴 This command can only be used in groups._*");

        // Fetch group metadata
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("*_❌ Failed to fetch group information._*");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = groupInfo.participants.length; // ✅ Fixed
        let admins = await getGroupAdmins(participants);
        let totalAdmins = admins ? admins.length : 0;

        if (totalAdmins === 0) return reply("*_🔴 No admins found in this group._*");

        let emojis = ['👑', '⚡', '🌟', '✨', '🎖️', '💎', '🔱', '🛡️', '🚀', '🏆'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Extract message properly
        let message = args.join(" ");
        if (!message) message = "*📣 Attention Admins*";

        let teks = `
╭────────────╮
│  Tag Admins 📌 │
╰────────────╯

🌐 *Group:* ${groupName}
👥 *Members:* ${totalMembers}
💬 *Message:* ${message}

⧉ *Summoning Admins...* 🚀

`;

        for (let admin of admins) {
            teks += `${randomEmoji} @${admin.split('@')[0]}\n`;
        }

        teks += "└──✪ Shadow ┃ Xtech ✪──";

        await conn.sendMessage(from, { text: teks, mentions: admins }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`❌ *Error Occurred!*\n\n${e.message || e}`);
    }
});