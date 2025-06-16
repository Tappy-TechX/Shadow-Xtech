const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Enregistrement de l'heure de démarrage du bot

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🎀",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User"; // Nom de l'utilisateur ou valeur par défaut

        // Array of random Demon Slayer videos
        const demonSlayerVideos = [
            "https://files.catbox.moe/t9vxu8.mp4",
            "https://files.catbox.moe/wea6jw.mp4",
            "https://files.catbox.moe/62kcq2.mp4",
            "https://files.catbox.moe/z09wz0.mp4"
        ];
        const randomVideoUrl = demonSlayerVideos[Math.floor(Math.random() * demonSlayerVideos.length)];

        // Array of random fancy texts
        const fancyTexts = [
            "Set your heart ablaze!",
            "To protect something... you need to become strong.",
            "Live with your head held high.",
            "The strong should aid and protect the weak."
        ];
        const randomFancyText = fancyTexts[Math.floor(Math.random() * fancyTexts.length)];

        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const formattedInfo = `
*${randomFancyText}*

🌟 *SHADOW-XTECH STATUS* 🌟
Hey 👋🏻 ${pushname}
🕒 *Time*: ${currentTime}
📅 *Date*: ${currentDate}
⏳ *Uptime*: ${runtimeHours} hours, ${runtimeMinutes} minutes, ${runtimeSeconds} seconds

*🤖Status*: *Bot 🤖 is alive and healthy🛠️*

*🔹 Powered by Black-Tappy 🔹*
        `.trim();

        // Send the message with a random video and caption
        await conn.sendMessage(from, {
            video: { url: randomVideoUrl },
            caption: formattedInfo,
            gifPlayback: true, // Optional: plays the video like a GIF
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: '𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in alive command: ", error);
        
        // Respond with error details
        const errorMessage = `
❌ An error occurred while processing the alive command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});