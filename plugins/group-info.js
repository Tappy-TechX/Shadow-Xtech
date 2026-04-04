const { cmd } = require('../command');

cmd({
    pattern: "ginfo",
    alias: ["groupinfo"],
    desc: "Get group information",
    category: "group",
    react: "🥏",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, quoted, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        // Only work in groups
        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        // Get group metadata
        const metadata = await conn.groupMetadata(from);
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = metadata.owner;

        // Get profile picture
        let ppUrl;
        try { ppUrl = await conn.profilePictureUrl(from, 'image'); } 
        catch { ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'; }

        const gdata = `*「 Group Information 」*\n
*Name* - ${metadata.subject}
*Jid* - ${metadata.id}
*Participants* - ${metadata.size}
*Owner* - ${owner.split('@')[0]}
*Description* - ${metadata.desc?.toString() || 'undefined'}
*Admins* - \n${listAdmin}\n`;

        // Send group info
        await conn.sendMessage(from, { image: { url: ppUrl }, caption: gdata }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.error("Ginfo command error:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply(`*🔴 Error occurred while fetching group info.*\n${e}`);
    }
});