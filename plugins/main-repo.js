const fetch = require('node-fetch'); // Keep import structure, though fetch is now unused for repo data
const config = require('../config');
const { cmd } = require('../command');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';
const repoVideoUrl = 'https://files.catbox.moe/eubadj.mp4';

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information with random styles.",
    react: "📂",
    category: "info",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {

        const githubRepoURL = 'https://github.com/Tappy-TechX/Shadow-Xtech';

        const repoData = {
            name: "Shadow-Xtech",
            owner: { login: "Tappy-Black" },
            stargazers_count: 26,
            forks_count: 70,
            html_url: githubRepoURL,
            description: 'No description, website, or topics provided.',
            updated_at: new Date().toISOString()
        };

        const quotes = [
            "Open-source & powerful. Fork now. 🚀✨",
            "Built for scale. Clone the future. 🧩🛠️",
            "Your bot starts here. Check the repo. 🤖📂",
            "Transparency at its core. View code. 🔍🔓",
            "Modular. Fast. Yours to fork. ⚡🔧",
            "Stars welcome, forks loved! 🌟🍴",
            "Contribute today. Code is live. 💻🔥",
            "Stable & sleek — repo tells all. 📊🧪",
            "Every byte matters. Fork the repo. 🧠📁",
            "Shadow-Xtech lives in this repo. 👑🛡️"
        ];

        const getRandomElement = (arr) =>
            arr[Math.floor(Math.random() * arr.length)];

        const selectedQuote = getRandomElement(quotes);

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const styles = [

`╭───『 ${config.BOT_NAME} REPO 』───⳹
│ 📦 *Repository*: ${repoData.name}
│ 👑 *Owner*: ${repoData.owner.login}
│ ⭐ *Stars*: ${repoData.stargazers_count}
│ ⑂ *Forks*: ${repoData.forks_count}
│ 🔗 *URL*: ${repoData.html_url}
│ 📝 *Desc*: ${repoData.description || 'None'}
│ 💬 *"${selectedQuote}"*
╰────────────────⳹

${config.DESCRIPTION}`,

`•----[ GITHUB INFO ]----•
🏷️ ${repoData.name}
👤 ${repoData.owner.login}
✨ ${repoData.stargazers_count} Stars
⑂ ${repoData.forks_count} Forks
💬 *"${selectedQuote}"*
•----[ ${config.BOT_NAME} ]----•

${config.DESCRIPTION}`,

`▄▀▄▀▄ REPOSITORY INFO ▄▀▄▀▄
♢ *Project*: ${repoData.name}
♢ *Author*: ${repoData.owner.login}
♢ *Stars*: ${repoData.stargazers_count} ✨
♢ *Forks*: ${repoData.forks_count} ⑂
♢ *Updated*: ${formatDate(repoData.updated_at)}
🔗 ${repoData.html_url}
💬 *"${selectedQuote}"*

${config.DESCRIPTION}`,

`┌──────────────────────┐
│  ⚡ ${config.BOT_NAME} REPO ⚡
├──────────────────────┤
│ • Name: ${repoData.name}
│ • Owner: ${repoData.owner.login}
│ • Stars: ${repoData.stargazers_count}
│ • Forks: ${repoData.forks_count}
│ • URL: ${repoData.html_url}
│ • Desc: ${repoData.description || 'None'}
│ • Quote: "${selectedQuote}"
└──────────────────────┘

${config.DESCRIPTION}`,

`▰▰▰▰▰ REPO INFO ▰▰▰▰▰
🏷️ *${repoData.name}*
👨‍💻 ${repoData.owner.login}
⭐ ${repoData.stargazers_count}
⑂ ${repoData.forks_count}
🔗 ${repoData.html_url}
📜 ${repoData.description || 'No description'}
💬 *"${selectedQuote}"*

${config.DESCRIPTION}`,

`╔══════════════════════╗
║   ${config.BOT_NAME} REPO
╠══════════════════════╣
║ > NAME: ${repoData.name}
║ > OWNER: ${repoData.owner.login}
║ > STARS: ${repoData.stargazers_count}
║ > FORKS: ${repoData.forks_count}
║ > URL: ${repoData.html_url}
║ > DESC: ${repoData.description || 'None'}
║ > QUOTE: "${selectedQuote}"
╚══════════════════════╝

${config.DESCRIPTION}`,

`┌───────────────┐
│ 📂 REPO
└───────────────┘
│ *Project*: ${repoData.name}
│ *Author*: ${repoData.owner.login}
│ ✨ ${repoData.stargazers_count} Stars
│ ⑂ ${repoData.forks_count} Forks
│ 🔗 ${repoData.html_url}
┌───────────────┐
│ 📝 DESC
└───────────────┘
${repoData.description || 'No description'}
💬 *"${selectedQuote}"*

${config.DESCRIPTION}`,

`✦ ${config.BOT_NAME} Repository ✦
📌 *${repoData.name}*
👤 @${repoData.owner.login}
⭐ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
🔄 Last updated: ${formatDate(repoData.updated_at)}
🔗 GitHub: ${repoData.html_url}
${repoData.description || 'No description available'}
💬 *"${selectedQuote}"*

${config.DESCRIPTION}`,

`╔♫═🎧═♫══════════╗
${config.BOT_NAME} REPO
╚♫═🎧═♫══════════╝
✧ *Name*: ${repoData.name}
✧ *Owner*: ${repoData.owner.login}
✧ *Stars*: ${repoData.stargazers_count}
✧ *Forks*: ${repoData.forks_count}
🔗 ${repoData.html_url}
${repoData.description || 'No description'}
💬 *"${selectedQuote}"*

${config.DESCRIPTION}`,

`┏━━━━━━━━━━━━━━━━━━┓
┃ REPOSITORY REPORT ┃
┗━━━━━━━━━━━━━━━━━━┛
◈ Project: ${repoData.name}
◈ Maintainer: ${repoData.owner.login}
◈ Popularity: ★ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
◈ Last Update: ${formatDate(repoData.updated_at)}
◈ URL: ${repoData.html_url}
Description: ${repoData.description || 'No description provided'}
Insight: *"${selectedQuote}"*

${config.DESCRIPTION}`
        ];

        const selectedStyle = getRandomElement(styles);

        await conn.sendMessage(from, {
            video: { url: repoVideoUrl },
            gifPlayback: true,
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | System Core",
                    body: "Bot is live and operational — stay connected!",
                    thumbnailUrl: "https://files.catbox.moe/3l3qgq.jpg",
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: Failed to execute command.\n${error.message}`);
    }
});