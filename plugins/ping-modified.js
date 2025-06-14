const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping2",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();
        
        // Stylish Emojis
        const reactionEmojis = ['⚡', '🚀', '🔥', '💨', '🌟'];
        const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];
        
        const pingMessage = await conn.sendMessage(from, {
            text: '*〘⏳ Checking bot speed... 〙*'
        });
       
        const end = Date.now();
        const speed = end - start;

        let status = "Stable";
        if (speed > 1000) status = "Slow";
        else if (speed > 500) status = "Moderate";

        const stylishText = `
╭─❏ *『 BOT PING STATUS 』* ❏
│
├─🤖 *Bot Name:*  ${config.botname || 'SHADOW-XTECH'}
├─⚡ *Speed:* ${speed}ms
├─📶 *Status:* ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${status}
├─⏱️ *Checked At:* ${new Date().toLocaleTimeString()}
│
╰─❏ *${getFancyMessage()}* ❏
        `.trim();
        //import profilepic
        let profilePic;
            try {
              profilePic = await sock.profilePictureUrl(m.sender, 'image');
            } catch (err) {
              profilePic = 'https://i.ibb.co/7yzjwvJ/default.jpg'; // Fallback image if profile pic isn't available
            }

            await sock.sendMessage(m.from, {
              image: { url: profilePic },
              caption: text
            }, { quoted: m });
          }
        }
        // import fancy message 
        function getFancyMessage() {
        const messages = [
           "⚡ Zooming through the wires!",
           "💨 Too fast to catch!",
           "🚀 Full throttle response!",
           "✨ Lightning mode activated!",
           "🌐 Instant like magic!",
         ];
         return messages[Math.floor(Math.random() * messages.length)];
       }  
       //export stylish fonts
        await conn.sendMessage(from, {
            text: stylishText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
