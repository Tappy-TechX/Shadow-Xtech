const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "📡",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("⛔ *Access Denied!*📍 *This protocol can only be executed inside group environments.*");

        const botOwner = conn.user.id.split(":")[0];
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("🔐 *Unauthorized Access!*🛡️ *Only admins or the Supreme Core Operator may deploy this protocol.*");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("⚠️ *System Fault!*. *Failed to interface with group metadata core.*");

        const groupName = groupInfo.subject || "Unknown User";
        const totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("🚫 *Zero User Found in Current Node!*");

        let emojis = ['📡', '🔊', '⚡', '🚨', '🧬', '🪐', '💠', '🎯', '🔗', '🛠️', '🌀', '💻', '🔧', '🔭', '⏳', '🗿', '🚀', '🎧', '🪀', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "⚡ All Members — Status Sync Required!";

        let teks = `
⎾⦿========================================⏌
  🛰️ *TAG ALL MODULE — BROADCAST MODE*
⎿==========================================⏋

  🌐 *GROUP NAME*   : ${groupName}
  👤 *TOTAL MEMBERS*  : ${totalMembers}
  💬 *TAGGED MESSAGE* : ${message}

 ⧉ *MENTION PROTOCOL INITIATED...*
`;

        for (let mem of participants) {
            if (!mem.id) continue;
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += `
⎾==========================================⏌
  ⚙️ *TRANSMISSION CORE*[SHADOW-XTECH]
⎿==========================================⏋`;

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *SYSTEM FAILURE DETECTED!*🧾 *Error Trace:*${e.message || e}`);
    }
});