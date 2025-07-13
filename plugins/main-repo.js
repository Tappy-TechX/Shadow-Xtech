const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information with random images and quotes.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/Tappy-Black/Shadow-Xtech-V1';

    // Array of additional random image URLs
    const randomImageUrls = [
        "https://files.catbox.moe/etqc8k.jpg", // Example random image 1
        "https://files.catbox.moe/etqc8k.jpg", // **Replace with actual URL**
        "https://files.catbox.moe/0w7hqx.jpg", // **Replace with actual URL**
        "https://files.catbox.moe/95n1x6.jpg", // **Replace with actual URL**
        "https://files.catbox.moe/og4tsk.jpg"  // **Replace with actual URL**
    ];

    // Array of random quotes related to bot health and encouraging repo forks
    const quotes = [
        "Our bot's performance is just Superb! Explore its core health in our repo. Fork it! 🚀✨",
        "Keeping the bot's systems in tip-top shape! See the magic behind it – fork our repo! 🌬️💻",
        "Deep dive into bot health! Our repo is open for you. Give it a fork and contribute! 💡🌟",
        "Bot health check: Optimal! Want to see the code? Head to our repo and fork away! 🩺✅",
        "Fresh code, fresh air for our bot! Get inspired, fork our repo, and join the innovation! 🔥🚀"
    ];

    // Helper function to get a random element from an array
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        const selectedRandomImageUrl = getRandomElement(randomImageUrls);
        const selectedQuote = getRandomElement(quotes);

        // Function to format date nicely
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        // Format 1: Classic Box
        const style1 = `╭───『 ${config.BOT_NAME} REPO 』───⳹
│
│ 📦 *Repository*: ${repoData.name}
│ 👑 *Owner*: ${repoData.owner.login}
│ ⭐ *Stars*: ${repoData.stargazers_count}
│ ⑂ *Forks*: ${repoData.forks_count}
│ 🔗 *URL*: ${repoData.html_url}
│
│ 📝 *Description*:
│ ${repoData.description || 'No description'}
│
│ 💬 _"${selectedQuote}"_
╰────────────────⳹
> ${config.DESCRIPTION}`;

        // Format 2: Minimalist
        const style2 = `•----[ GITHUB INFO ]----•
  │
  ├─ 🏷️ ${repoData.name}
  ├─ 👤 ${repoData.owner.login}
  ├─ ✨ ${repoData.stargazers_count} Stars
  ├─ ⑂ ${repoData.forks_count} Forks
  │
  ├─ 💬 _"${selectedQuote}"_
  •----[ ${config.BOT_NAME} ]----•
  > ${config.DESCRIPTION}`;

        // Format 3: Fancy Borders
        const style3 = `▄▀▄▀▄ REPOSITORY INFO ▄▀▄▀▄

  ♢ *Project*: ${repoData.name}
  ♢ *Author*: ${repoData.owner.login}
  ♢ *Stars*: ${repoData.stargazers_count} ✨
  ♢ *Forks*: ${repoData.forks_count} ⑂
  ♢ *Updated*: ${formatDate(repoData.updated_at)}
  
  🔗 ${repoData.html_url}
  
  💬 _"${selectedQuote}"_
  
  > ${config.DESCRIPTION}`;

        // Format 4: Code Style
        const style4 = `┌──────────────────────┐
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
> ${config.DESCRIPTION}`;

        // Format 5: Modern Blocks
        const style5 = `▰▰▰▰▰ REPO INFO ▰▰▰▰▰

  🏷️  *${repoData.name}*
  👨‍💻  ${repoData.owner.login}
  
  ⭐ ${repoData.stargazers_count}  ⑂ ${repoData.forks_count}
  🔗 ${repoData.html_url}
  
  📜 ${repoData.description || 'No description'}
  
  💬 _"${selectedQuote}"_
  
  > ${config.DESCRIPTION}`;

        // Format 6: Retro Terminal
        const style6 = `╔══════════════════════╗
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
> ${config.DESCRIPTION}`;

        // Format 7: Elegant
        const style7 = `┌───────────────┐
│  📂  REPO  │
└───────────────┘
│
│ *Project*: ${repoData.name}
│ *Author*: ${repoData.owner.login}
│
│ ✨ ${repoData.stargazers_count} Stars
│ ⑂ ${repoData.forks_count} Forks
│
│ 🔗 ${repoData.html_url}
│
┌───────────────┐
│  📝  DESC  │
└───────────────┘
${repoData.description || 'No description'}

💬 _"${selectedQuote}"_

> ${config.DESCRIPTION}`;

        // Format 8: Social Media Style
        const style8 = `✦ ${config.BOT_NAME} Repository ✦

📌 *${repoData.name}*
👤 @${repoData.owner.login}

⭐ ${repoData.stargazers_count} Stars | ⑂ ${repoData.forks_count} Forks
🔄 Last updated: ${formatDate(repoData.updated_at)}

🔗 GitHub: ${repoData.html_url}

${repoData.description || 'No description available'}

💬 _"${selectedQuote}"_

> ${config.DESCRIPTION}`;

        // Format 9: Fancy List
        const style9 = `╔♫═🎧═♫══════════╗
   ${config.BOT_NAME} REPO
╚♫═🎧═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ *Name*: ${repoData.name}
 ✧ *Owner*: ${repoData.owner.login}
 ✧ *Stars*: ${repoData.stargazers_count}
 ✧ *Forks*: ${repoData.forks_count}
•・゜゜・* ✧  *・゜゜・•

🔗 ${repoData.html_url}

${repoData.description || 'No description'}

💬 _"${selectedQuote}"_

> ${config.DESCRIPTION}`;

        // Format 10: Professional
        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
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

> ${config.DESCRIPTION}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = getRandomElement(styles);

        // Send a random image (either the main MENU_IMAGE_URL or one from randomImageUrls)
        const finalImageUrl = config.MENU_IMAGE_URL || selectedRandomImageUrl;
        
        await conn.sendMessage(from, {
            image: { url: finalImageUrl },
            caption: selectedStyle,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.OWNER_NAME || '𝐒ʜᴀᴅᴏᴡ-𝐗ᴛ𝐞𝐜𝐡',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/ddmjyy.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
