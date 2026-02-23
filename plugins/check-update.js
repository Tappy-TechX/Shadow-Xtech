const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
const UPTIME_VIDEO = 'https://files.catbox.moe/eubadj.mp4';

const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ Uptime | Status 🟢",
            vcard:
                "BEGIN:VCARD\n" +
                "VERSION:3.0\n" +
                "FN:SCIFI\n" +
                "ORG:Shadow-Xtech BOT;\n" +
                "TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\n" +
                "END:VCARD"
        }
    }
};

cmd({
    pattern: 'version',
    alias: ["changelog", "cupdate", "checkupdate"],
    react: '🚀',
    desc: "Check bot's version, system stats, and update info.",
    category: 'info',
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // --- Local version info ---
        const localVersionPath = path.join(__dirname, '../data/version.json');
        let localVersion = 'Unknown';
        let changelog = 'No changelog available.';
        if (fs.existsSync(localVersionPath)) {
            const localData = JSON.parse(fs.readFileSync(localVersionPath));
            localVersion = localData.version;
            changelog = localData.changelog;
        }

        // --- Fetch latest version info from GitHub ---
        const rawVersionUrl = 'https://raw.githubusercontent.com/Tappy-Black/Shadow-Xtech-V1/main/data/version.json';
        let latestVersion = 'Unknown';
        let latestChangelog = 'No changelog available.';
        try {
            const { data } = await axios.get(rawVersionUrl);
            latestVersion = data.version;
            latestChangelog = data.changelog;
        } catch (error) {
            console.error('Failed to fetch latest version:', error);
        }

        // --- Plugins & commands count ---
        const pluginPath = path.join(__dirname, '../plugins');
        const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;
        const totalCommands = commands.length;

        // --- System info ---
        const uptime = runtime(process.uptime());
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        const hostName = os.hostname();
        const lastUpdate = fs.existsSync(localVersionPath)
            ? fs.statSync(localVersionPath).mtime.toLocaleString()
            : 'Unknown';

        const githubRepo = 'https://github.com/Tappy-Black/Shadow-Xtech-V1';

        // --- Update status ---
        let updateMessage = `✅ Your Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ bot is up-to-date!`;
        if (localVersion !== latestVersion) {
            updateMessage = `🚀 Your Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ bot is outdated!
🔹 *Current Version:* ${localVersion}
🔹 *Latest Version:* ${latestVersion}

Use *.update* to update.`;
        }

        // --- Compose caption ---
        const caption = `🌟 *Good ${new Date().getHours() < 12 ? 'Morning' : 'Night'}, ${pushname}!* 🌟

📌 *Bot Name:* Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ
🔖 *Current Version:* ${localVersion}
📢 *Latest Version:* ${latestVersion}
📂 *Total Plugins:* ${pluginCount}
🔢 *Total Commands:* ${totalCommands}

💾 *System Info:*
⏳ *Uptime:* ${uptime}
📟 *RAM Usage:* ${ramUsage}MB / ${totalRam}MB
⚙️ *Host Name:* ${hostName}
📅 *Last Update:* ${lastUpdate}

📝 *Changelog:*
${latestChangelog}

⭐ *GitHub Repo:* ${githubRepo}
👤 *Owner:* [Black-Tappy](https://github.com/Tappy-TechX)

${updateMessage}

🚀 *Hey! Don't forget to fork & star the repo!*`;

        // --- Send video as muted loop GIF with external ad reply ---
        await conn.sendMessage(
            from,
            {
                video: { url: UPTIME_VIDEO },
                gifPlayback: true,
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
                        title: "⚙️ SHADOW-XTECH UPTIME STATUS",
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
        console.error('Error fetching version info:', error);
        reply('❌ An error occurred while checking the bot version.');
    }
});