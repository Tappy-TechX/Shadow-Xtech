const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

// Quoted contact for replying
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🚀 Version | Update Center",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:Shadow-Xtech
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
END:VCARD`
    }
  }
};

const whatsappChannelLink = "https://chat.whatsapp.com/yourchannel"; // <-- replace with your channel link

cmd({
  pattern: 'version',
  alias: ["changelog", "cupdate", "checkupdate"],
  react: '🚀',
  desc: "Check bot's version, system stats, and update info.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
  try {

    // 🕒 Dynamic Greeting System
    const hour = new Date().getHours();
    let greetingTitle, greetingMessage;

    const morningQuotes = [
      "Rise and shine! Let’s make today productive 🚀",
      "New day, new wins loading ⚡",
      "Time to dominate your goals 💪",
      "Success starts now 🔥",
      "Let’s build something powerful today"
    ];
    const afternoonQuotes = [
      "Keep pushing, greatness is loading ⚡",
      "Stay sharp, stay focused 💼",
      "Momentum is on your side 🚀",
      "Productivity mode activated 🔥",
      "Success doesn’t sleep 💪"
    ];
    const eveningQuotes = [
      "Stay sharp, stay winning 💼",
      "Reflect, recharge, refocus 🔥",
      "Another step closer to greatness 🚀",
      "Calm mind, strong vision ⚡",
      "Strategy time 🌙"
    ];
    const nightQuotes = [
      "System calm, but still watching 🌌",
      "Quiet hours, powerful ideas 💻",
      "Rest, reset, reload 🔄",
      "Legends work in silence 🔥",
      "Stability maintained 🌃"
    ];

    function pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    if (hour >= 5 && hour < 12) {
      greetingTitle = "🌅 *Good Morning*";
      greetingMessage = pickRandom(morningQuotes);
    } else if (hour >= 12 && hour < 17) {
      greetingTitle = "☀️ *Good Afternoon*";
      greetingMessage = pickRandom(afternoonQuotes);
    } else if (hour >= 17 && hour < 21) {
      greetingTitle = "🌇 *Good Evening*";
      greetingMessage = pickRandom(eveningQuotes);
    } else {
      greetingTitle = "🌙 *Good Night*";
      greetingMessage = pickRandom(nightQuotes);
    }

    // 📂 Local Version
    const localVersionPath = path.join(__dirname, '../data/version.json');
    let localVersion = 'Unknown';
    let changelog = 'No changelog available.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // 🌐 Fetch Latest Version
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

    // 📂 Plugin count
    const pluginPath = path.join(__dirname, '../plugins');
    const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;

    // 🔢 Command count
    const totalCommands = commands.length;

    // 💻 System stats
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();

    // 🔄 Update Check
    let updateMessage = `✅ Your *Shadow-Xtech* bot is up-to-date!`;
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 Your *Shadow-Xtech* bot is outdated!
🔹 *Current Version:* ${localVersion}
🔹 *Latest Version:* ${latestVersion}

Use *.update* to update.`;
    }

    // 💫 Stylish Dynamic Status Message
    const stylishText = `${greetingTitle} — ${greetingMessage}
👤 *User:* ${pushname}

📌 *Bot Name:* 𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ
🔖 *Current Version:* ${localVersion}
📢 *Latest Version:* ${latestVersion}
📂 *Plugins:* ${pluginCount}
🔢 *Commands:* ${totalCommands}

💾 *System Pulse*
⏳ Uptime: ${uptime}
📟 RAM: ${ramUsage}MB / ${totalRam}MB
⚙️ Host: ${hostName}
📅 Last Update: ${lastUpdate}

📝 *Latest Changelog*
${latestChangelog}

${updateMessage}

⭐ Repo: https://github.com/Tappy-Black/Shadow-Xtech-V1
🚀 Fork • Star • Support`;

    // Send the status message
    await conn.sendMessage(from, {
      text: stylishText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: '𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ',
          serverMessageId: 143
        },
        externalAdReply: {
          title: "⚙️ Shadow-Xtech | Version Center",
          body: "Performance • Intelligence • Control",
          thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: quotedContact });

  } catch (error) {
    console.error('Error fetching version info:', error);
    reply('❌ An error occurred while checking the bot version.');
  }
});