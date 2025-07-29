const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Enregistrement de l'heure de démarrage du bot

const FALLBACK_WALLPAPERS = [
    "https://files.catbox.moe/og4tsk.jpg",
    "https://files.catbox.moe/odst1m.jpg",
    "https://files.catbox.moe/95n1x6.jpg",
    "https://files.catbox.moe/0w7hqx.jpg"
];

const getRandomWallpaper = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_WALLPAPERS.length);
    return FALLBACK_WALLPAPERS[randomIndex];
};

const FANCY_QUOTES = [
    "🧬 Neural grid stable — systems running within optimal range.",
    "🛰 Core uplink established — listening for user signal...",
    "⚡ Power node calibrated — quantum stream active.",
    "🧠 AI kernel synchronized — directive input mode engaged.",
    "⚙️ XTECH protocol active — mission parameters clear.",
    "🔋 Energy flow: 100% | AI routine: ALIVE",
    "🚀 Fusion reactor idle. Awaiting next instruction...",
    "🌐 Multi-thread ops: — No anomalies detected."
];

const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * FANCY_QUOTES.length);
    return FANCY_QUOTES[randomIndex];
};

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🎀",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const randomQuote = getRandomQuote();
        const wallpaperUrl = getRandomWallpaper();

        const formattedInfo = `
🌟 *SHADOW-XTECH STATUS* 🌟
Hey 👋🏻 ${pushname}
🕒 *Time*: ${currentTime}
📅 *Date*: ${currentDate}
⏳ *Uptime*: ${runtimeHours} hours, ${runtimeMinutes} minutes, ${runtimeSeconds} seconds

*🤖Status*: *Bot is alive and healthy🛠️*

"${randomQuote}"

*🔹 Powered by Black-Tappy 🔹*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: wallpaperUrl },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: 'ֆཏɑɖօա-𝕏Ե𝖾𝖼ཏ',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ SHADOW-XTECH SYSTEM STATUS",
                    body: "Bot is live and operational — stay connected!",
                    thumbnailUrl: wallpaperUrl,
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in alive command: ", error);

        const errorMessage = `
❌ An error occurred while processing the alive command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});