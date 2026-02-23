const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Bot launch time

const ALIVE_VIDEO = "https://files.catbox.moe/eubadj.mp4";

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

// Function to get random quote
function getRandomQuote() {
    return FANCY_QUOTES[Math.floor(Math.random() * FANCY_QUOTES.length)];
}

// Quoted contact reference
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Alive | Status 🟢",
            vcard:
                "BEGIN:VCARD\n" +
                "VERSION:3.0\n" +
                "FN:SCIFI\n" +
                "ORG:Shadow-Xtech BOT;\n" +
                "TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\n" +
                "END:VCARD"
        }
    }
};

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

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

        const runtimeMs = Date.now() - botStartTime;
        const hours = Math.floor(runtimeMs / (1000 * 60 * 60));
        const minutes = Math.floor((runtimeMs / (1000 * 60)) % 60);
        const seconds = Math.floor((runtimeMs / 1000) % 60);

        const caption = `
🌟 *SHADOW-XTECH STATUS* 🌟
*Hey 👋🏻 ${pushname}*

🕒 *Time:* ${currentTime}
📅 *Date:* ${currentDate}
⏳ *Uptime:* ${hours}h ${minutes}m ${seconds}s

🤖 *Status:* Bot is alive and healthy 🛠️

"${getRandomQuote()}"

🔹 *Powered by Black-Tappy* 🔹
        `.trim();

        await conn.sendMessage(
            from,
            {
                video: { url: ALIVE_VIDEO },
                gifPlayback: true, // Makes it behave like GIF
                caption,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363369453603973@newsletter",
                        newsletterName: "Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "⚙️ SHADOW-XTECH SYSTEM STATUS",
                        body: "Bot is live and operational — stay connected!",
                        thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                        sourceUrl: whatsappChannelLink,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            },
            { quoted: quotedContact }
        );

    } catch (error) {
        console.error("Error in alive command:", error);

        const errorMessage = `
❌ An error occurred while processing the *alive* command.

🛠 Error:
${error.message}

Please try again later.
        `.trim();

        return reply(errorMessage);
    }
});