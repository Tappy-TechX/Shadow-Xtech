const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information with random styles.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {

    const githubRepoURL = 'https://github.com/Tappy-Black/Shadow-Xtech-V1';
    const videoGifUrl = 'https://files.catbox.moe/eubadj.mp4';

    const quotes = [
        "Repo check complete — all systems go! ✅",
        "Checking repository status... Perfect! 🔍",
        "Shadow-Xtech repo is live and ready! 📂",
        "Repo verified — stable and running! ⚡",
        " Repo inspection done — code looks solid! 🛠️",
        "Repo check passed — fork or clone now! 🚀",
        "Shadow-Xtech repository verified successfully! 💻",
        "Repo status: active, updated, and ready! 🔗",
        "Repository check ✅ All metrics green! 📊",
        "Shadow-Xtech repo check completed — stay connected! 👑"
    ];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    try {

        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const repoData = await response.json();
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
│ 💬 _"${selectedQuote}"_
╰────────────────⳹
> ${config.DESCRIPTION}`,

`•----[ GITHUB INFO ]----•
  🏷️ ${repoData.name}
  👤 ${repoData.owner.login}
  ✨ ${repoData.stargazers_count} Stars
  ⑂ ${repoData.forks_count} Forks
  💬 _"${selectedQuote}"_
•----[ ${config.BOT_NAME} ]----•
> ${config.DESCRIPTION}`,

`▄▀▄▀▄ REPOSITORY INFO ▄▀▄▀▄
♢ *Project*: ${repoData.name}
♢ *Author*: ${repoData.owner.login}
♢ *Stars*: ${repoData.stargazers_count} ✨
♢ *Forks*: ${repoData.forks_count} ⑂
♢ *Updated*: ${formatDate(repoData.updated_at)}
🔗 ${repoData.html_url}
💬 _"${selectedQuote}"_
> ${config.DESCRIPTION}`,

`┌──────────────────────┐
│  ⚡ ${config.BOT_NAME} REPO  ⚡  │
├──────────────────────┤
│ • Name: ${repoData.name}
│ • Owner: ${repoData.owner.login}
│ • Stars: ${repoData.stargazers_count}
│ • Forks: ${repoData.forks_count}
│ • URL: ${repoData.html_url}
│ • Desc: ${repoData.description || 'None'}
│ • Quote: "${selectedQuote}"
└──────────────────────┘
> ${config.DESCRIPTION}`,

`▰▰▰▰▰ REPO INFO ▰▰▰▰▰
🏷️  *${repoData.name}*
👨‍💻  ${repoData.owner.login}
⭐ ${repoData.stargazers_count}  ⑂ ${repoData.forks_count}
🔗 ${repoData.html_url}
📜 ${repoData.description || 'No description'}
💬 _"${selectedQuote}"_
> ${config.DESCRIPTION}`,

`╔══════════════════════╗
║   ${config.BOT_NAME} REPO    ║
╠══════════════════════╣
║ > NAME: ${repoData.name}
║ > OWNER: ${repoData.owner.login}
║ > STARS: ${repoData.stargazers_count}
║ > FORKS: ${repoData.forks_count}
║ > URL: ${repoData.html_url}
║ > DESC: ${repoData.description || 'None'}
║ > QUOTE: "${selectedQuote}"
╚══════════════════════╝
> ${config.DESCRIPTION}`,

`┌───────────────┐
│  📂  REPO  │
└───────────────┘
│ *Project*: ${repoData.name}
│ *Author*: ${repoData.owner.login}
│ ✨ ${repoData.stargazers_count} Stars
│ ⑂ ${repoData.forks_count} Forks
│ 🔗 ${repoData.html_url}
┌───────────────┐
│  📝  DESC  │
└───────────────┘
${repoData.description || 'No description'}
💬 _"${selectedQuote}"_
> ${config.DESCRIPTION}`,

`✦ ${config.BOT_NAME} Repository ✦
📌 *${repoData.name}*
👤 @${repoData.owner.login}
⭐ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
🔄 Last updated: ${formatDate(repoData.updated_at)}
🔗 GitHub: ${repoData.html_url}
${repoData.description || 'No description available'}
💬 _"${selectedQuote}"_
> ${config.DESCRIPTION}`,

`╔♫═🎧═♫══════════╗
   ${config.BOT_NAME} REPO
╚♫═🎧═♫══════════╝
•・゜゜・* ✧
 ✧ *Name*: ${repoData.name}
 ✧ *Owner*: ${repoData.owner.login}
 ✧ *Stars*: ${repoData.stargazers_count}
 ✧ *Forks*: ${repoData.forks_count}
•・゜゜・* ✧
🔗 ${repoData.html_url}
${repoData.description || 'No description'}
💬 _"${selectedQuote}"_
> ${config.DESCRIPTION}`,

`┏━━━━━━━━━━━━━━━━━━┓
┃  REPOSITORY REPORT  ┃
┗━━━━━━━━━━━━━━━━━━┛
◈ Project: ${repoData.name}
◈ Maintainer: ${repoData.owner.login}
◈ Popularity: ★ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
◈ Last Update: ${formatDate(repoData.updated_at)}
◈ URL: ${repoData.html_url}
Description:
${repoData.description || 'No description provided'}
Insight: _"${selectedQuote}"_
> ${config.DESCRIPTION}`

        ];

        const selectedStyle = getRandomElement(styles);

        const quotedContact = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: config.OWNER_NAME || "⚙️ System | Core 🔌",
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:ShadowXTech\nORG:Bot Repo;\nTEL;type=CELL:+1234567890\nEND:VCARD"
                }
            }
        };

        await conn.sendMessage(from, {
            video: { url: videoGifUrl },
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
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.OWNER_NAME || '𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: quotedContact });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});