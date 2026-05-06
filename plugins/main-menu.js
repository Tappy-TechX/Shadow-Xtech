const { cmd } = require('../command');

const MENU_ZIP_URL = 'https://github.com/Tappy-TechX/Shadow-Xtech/archive/refs/heads/main.zip';

cmd({
    pattern: "menu",
    alias: ["panel", "commands"],
    react: "📂",
    desc: "Show bot menu",
    category: "main",
    use: ".menu",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {

        const menuText = `
╭━━〔 *SHADOW XTECH* 〕━━⬣
┃ 👤 *USER:* ${pushname}
┃ ⚙️ *OWNER:* Not Set
┃ 🔑 *PREFIX:* [ 😂 ]
┃ 🌐 *HOST:* Heroku
┃ 🔌 *PLUGINS:* 328
┃ 📡 *MODE:* Public
┃ 🧬 *VERSION:* 1.0.0
┃ ⚡ *SPEED:* 0.25 ms
┃ 💾 *RAM:* 53%
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *MAIN MENU* 〕━━⬣
┃ 📥 .download
┃ 🎵 .lyrics
┃ 🌤️ .weather
┃ ⏱️ .uptime
┃ 🧠 .ai
╰━━━━━━━━━━━━━━━⬣

╭━━〔 *OWNER MENU* 〕━━⬣
┃ 🔒 .ban
┃ 🔓 .unban
┃ ⚙️ .mode
╰━━━━━━━━━━━━━━━⬣

> © Shadow Xtech
`;

        await conn.sendMessage(from, {
            document: { url: MENU_ZIP_URL },
            mimetype: 'application/zip',
            fileName: 'Shadow-Xtech.zip',
            caption: menuText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
                    newsletterJid: "120363369453603973@newsletter"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});