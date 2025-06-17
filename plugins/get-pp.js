const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    alias: ["profilepic", "pp"],
    desc: "Get a user's profile picture with style.",
    category: "main",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Measure start time for ping
        const startTime = Date.now();
        const pushname = m.pushName || "User";

        // Array of random fancy texts
        const fancyTexts = [
            "Behold, the face of a legend!",
            "Looking sharp! Here's your profile pic.",
            "A picture is worth a thousand words.",
            "Caught in 4K! ✨",
            "Your digital reflection, delivered instantly."
        ];
        const randomFancyText = fancyTexts[Math.floor(Math.random() * fancyTexts.length)];

        // Fetch the profile picture URL
        let userProfilePicUrl;
        try {
            userProfilePicUrl = await conn.profilePictureUrl(sender, 'image');
        } catch {
            // If the user has no profile picture, inform them.
            return reply("You don't seem to have a profile picture for me to fetch!");
        }

        // Measure end time for ping
        const endTime = Date.now();
        const ping = endTime - startTime;

        // Construct the final caption
        const caption = `
*${randomFancyText}*

👤 *User:* ${pushname}
⚡ *Response Time:* ${ping}ms

*🔹 Powered by Shadow-Xtech 🔹*
        `.trim();

        // Send the profile picture with the new caption and context info
        await conn.sendMessage(from, {
            image: { url: userProfilePicUrl },
            caption: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter', // Your Newsletter JID
                    newsletterName: '𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ', // Your Newsletter Name
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in getpp command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});