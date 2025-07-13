const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Enregistrement de l'heure de démarrage du bot

// Array of fallback wallpaper URLs
const FALLBACK_WALLPAPERS = [
    "https://files.catbox.moe/og4tsk.jpg", // Your original image
    "https://files.catbox.moe/odst1m.jpg",
    "https://files.catbox.moe/95n1x6.jpg",
    "https://files.catbox.moe/0w7hqx.jpg"
];

// Function to get a random wallpaper URL
const getRandomWallpaper = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_WALLPAPERS.length);
    return FALLBACK_WALLPAPERS[randomIndex];
};

// Array of fancy quotes related to bot status with added emojis
const FANCY_QUOTES = [
    "🟢 System online, ready to serve! ✨",
    "💖 Heartbeat detected: Bot is alive and kicking! 🚀",
    "🌟 All systems nominal. Ready for your commands. ✅",
    "✨ Status check: Operational and responsive. 💡",
    "🚀 The bot is awake and processing requests! 🤖",
    "🌟 Alive and well, at your service! 🎉",
    "✅ Bot status: All clear and operational! 💯",
    "💫 Checking in: The bot is active and ready! 🔮"
];

// Function to get a random fancy quote
const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * FANCY_QUOTES.length);
    return FANCY_QUOTES[randomIndex];
};

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🎀",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User"; // Nom de l'utilisateur ou valeur par défaut
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY"); // Added YYYY for full date

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const randomQuote = getRandomQuote();
        const wallpaperUrl = getRandomWallpaper(); // Get a random wallpaper

        const formattedInfo = `
🌟 *SHADOW-XTECH STATUS* 🌟
Hey 👋🏻 ${pushname}
🕒 *Time*: ${currentTime}
📅 *Date*: ${currentDate}
⏳ *Uptime*: ${runtimeHours} hours, ${runtimeMinutes} minutes, ${runtimeSeconds} seconds

*🤖Status*: *Bot 🤖 is alive and healthy🛠️*

"${randomQuote}"

*🔹 Powered by Black-Tappy 🔹*
        `.trim();

        // Envoyer le message avec image et légende
        await conn.sendMessage(from, {
            image: { url: wallpaperUrl }, // Use the random wallpaper URL
            caption: formattedInfo,
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
        
        // Répondre avec des détails de l'erreur
        const errorMessage = `
❌ An error occurred while processing the alive command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});
