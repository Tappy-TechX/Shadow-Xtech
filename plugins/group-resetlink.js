const config = require('../config')    
const { cmd, commands } = require('../command')    
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')    

cmd({    
    pattern: "revoke",    
    react: "🖇️",    
    alias: ["revokegrouplink","resetglink","revokelink","f_revoke"],    
    desc: "Reset the group link",    
    category: "group",    
    use: '.revoke',    
    filename: __filename    
},    
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {    
    try {    
        // ♻️ Loading reaction    
        await conn.sendMessage(from, {     
            react: { text: "♻️", key: mek.key }     
        });    

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");    
        if (!isAdmins) return reply("*🔴 Only group admins can use this command.*");    
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to reset the group link.*");    

        // 📡 Revoke group link    
        await conn.groupRevokeInvite(from);    

        // ✅ Success reaction    
        await conn.sendMessage(from, {     
            react: { text: "✅", key: mek.key }     
        });    

        reply("*✔️ Group link has been reset ⛔*");    

    } catch (e) {    
        console.error(e);    

        // ❌ Error reaction    
        await conn.sendMessage(from, {     
            react: { text: "❌", key: mek.key }     
        });    

        reply(`*🔴 Error resetting group link:*\n${e}`);    
    }    
});