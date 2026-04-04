const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",    
    alias: ["joinme", "f_join"],
    desc: "To join a group from an invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, q, isCreator, reply }) => {
    try {
        const msr = {
            own_cmd: "*🔴 You don't have permission to use this command.*"
        };

        // Only allow the creator to use the command
        if (!isCreator) return reply(msr.own_cmd);

        // If there's no input, check if the message is a reply with a link
        if (!q && !quoted) return reply("*🔴 Please provide the group link 🖇️*");

        // ♻️ Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        let groupLink;

        // If the message is a reply to a group invite link
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            // If the user provided the link in the command
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("*🔴 Invalid group link 🖇️*");

        // Accept the group invite
        await conn.groupAcceptInvite(groupLink);

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        reply("*✔️ Successfully joined the group!*");

    } catch (e) {
        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        console.log(e);
        reply(`*🔴 Error occurred while joining the group:*\n${e}`);
    }
});