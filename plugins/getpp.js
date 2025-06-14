const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    alias: ["profilepic", "pp"],
    desc: "Get a user's profile picture and check bot's response time.",
    category: "main",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // Measure start time for ping
        const startTime = Date.now();

        // Fetch the profile picture URL
        const userProfilePic = await conn.getProfilePicture(sender);

        if (!userProfilePic) {
            return reply("Sorry, I couldn't fetch the profile picture.");
        }

        // Measure end time for ping
        const endTime = Date.now();
        const ping = endTime - startTime;

        // Send the profile picture
        await conn.sendMessage(from, {
            image: { url: userProfilePic },
            caption: `Here is your profile picture. Response time: ${ping}ms 📸`
        });

    } catch (e) {
        console.error("Error in getpp command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
