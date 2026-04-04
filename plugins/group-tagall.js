const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members (Public)",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("*_🔴 This command can only be used in groups._*");

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("*_❌ Failed to fetch group information._*");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("*_🔴 No members found in this group._*");

        let emojis = ['📢', '📡', '🌐', '🧬', '📎', '🏷️', '📣', '🔔', '🪐', '🚨', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '📍', '🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "⚡ *Attention Everyone*"; // Default message

        let teks = `
╭────────────╮
│ Tag All 📌 │
╰────────────╯

 🌐 *Group: ${groupName}*
 👤 *Members: ${totalMembers}*
 💬 *Message: ${message}*

 ⧉ *Initiating mentions...🚀*`;

        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──✪ Shadow ┃ Xtech ✪──";

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});
