const config = require('../config')  
const { cmd } = require('../command')  
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')  

cmd({  
    pattern: "unmute",  
    alias: ["groupunmute"],  
    react: "🔊",  
    desc: "Unmute the group (Everyone can send messages).",  
    category: "group",  
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
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to unmute the group.*");  

        // 📡 Unmute group
        await conn.groupSettingUpdate(from, "not_announcement");  

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });  

        reply("*✔️ Group has been unmuted. Everyone can send messages.*");  

    } catch (e) {  
        console.error("Error unmuting group:", e);  

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });  

        reply("*🔴 Failed to unmute the group. Please try again.*");  
    }  
});