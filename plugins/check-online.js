const { cmd } = require('../command');  

const whatsappChannelLink = '[https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10](https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10)';  

// 🔖 Contact used for quoting the reply  
const quotedContact = {  
    key: {  
        fromMe: false,  
        participant: "0@s.whatsapp.net",  
        remoteJid: "status@broadcast"  
    },  
    message: {  
        contactMessage: {  
            displayName: "🟢 Online | Monitor Center",  
            vcard: `BEGIN:VCARD  
VERSION:3.0  
FN:Shadow-Xtech  
ORG:Shadow-Xtech BOT;  
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001  
END:VCARD`  
        }  
    }  
};  

cmd({  
    pattern: "online",  
    alias: ["whosonline", "onlinemembers"],  
    desc: "Check who's online in the group (Admins & Owner only)",  
    category: "main",  
    react: "🟢",  
    filename: __filename  
},  
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, fromMe, reply }) => {  
    try {  
        if (!isGroup) return reply("❌ This command can only be used in a group!");  
        if (!isCreator && !isAdmins && !fromMe) {  
            return reply("❌ Only bot owner and group admins can use this command!");  
        }  

        await reply("🔄 Scanning for online members... This may take a few seconds.");  

        const groupData = await conn.groupMetadata(from);  

        const onlineAdmins = [];
        const onlineParticipants = [];

        for (const participant of groupData.participants) {  
            try {  
                const presence = conn.presences[participant.id]?.lastKnownPresence || 'unavailable';  
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    if (participant.admin) {
                        onlineAdmins.push(participant.id);
                    } else {
                        onlineParticipants.push(participant.id);
                    }
                }  
            } catch {}  
        }  

        // Include bot owner (you can adjust this ID)  
        const botOwnerId = "254700000001@s.whatsapp.net";  
        if (!onlineAdmins.includes(botOwnerId) && !onlineParticipants.includes(botOwnerId)) {
            onlineAdmins.unshift(botOwnerId); // Owner listed as admin
        }

        if (onlineAdmins.length === 0 && onlineParticipants.length === 0) {
            return reply("⚠️ Couldn't detect any online members. They might be hiding their presence.");  
        }

        const formatList = (list) => 
            list.map((id, i) => `│ ${i + 1}. @${id.split('@')[0]}${' '.repeat(10 - id.split('@')[0].length)}│`).join('\n');

        const stylishText = `╭──────────────╮
│  🟢 ONLINE NOW  │
├──────────────┤
│ Admins: │
${formatList(onlineAdmins)}
├──────────────┤
│ Participants: │
${formatList(onlineParticipants)}
├──────────────┤
│ Total Online: ${onlineAdmins.length + onlineParticipants.length}/${groupData.participants.length} │
╰──────────────╯`;

        await conn.sendMessage(from, {  
            text: stylishText,  
            contextInfo: {  
                mentionedJid: [...onlineAdmins, ...onlineParticipants],  
                forwardingScore: 999,  
                isForwarded: true,  
                forwardedNewsletterMessageInfo: {  
                    newsletterJid: '120363369453603973@newsletter',  
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",  
                    serverMessageId: 143  
                },  
                externalAdReply: {  
                    title: "⚙️ Shadow-Xtech | Live Pulse",  
                    body: "Live • Track • Scan",  
                    thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',  
                    sourceUrl: whatsappChannelLink,  
                    mediaType: 1,  
                    renderLargerThumbnail: false  
                }  
            }  
        }, { quoted: quotedContact });  

    } catch (e) {  
        console.error("Error in online command:", e);  
        reply(`An error occurred: ${e.message}`);  
    }  
});