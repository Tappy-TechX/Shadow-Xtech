const { cmd } = require('../command');
const config = require('../config');

const MENU_IMAGE = 'https://files.catbox.moe/eubadj.mp4'; // preview/video/image
const DOC_URL = 'https://files.catbox.moe/xxxxxx.zip'; // your zip/doc link

cmd({
  pattern: "menu",
  react: "📜",
  desc: "Show menu",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {

try {

const readmore = String.fromCharCode(8206).repeat(4001);

let menu = `
╭━━━〔 *CYPHER X* 〕━━━┈⊷
┃ 👤 USER : ${pushname}
┃ 🤖 OWNER : Not Set
┃ ⚙️ PREFIX : [ 😂 ]
┃ 🌐 HOST : Heroku
┃ 📦 PLUGINS : 320
┃ 🔓 MODE : Public
┃ 📌 VERSION : 1.9.4
┃ ⚡ SPEED : 0.2592 ms
┃ 💾 RAM : 53%
╰━━━━━━━━━━━━━━━┈⊷
${readmore}
╭━━━〔 *COMMANDS* 〕━━━┈⊷
┃ 😂 menu
┃ 🎵 lyrics
┃ 📥 download
┃ 🌤️ weather
┃ ⏱️ uptime
╰━━━━━━━━━━━━━━━┈⊷
`;

await conn.sendMessage(from, {
  document: { url: DOC_URL },
  mimetype: 'application/zip',
  fileName: 'CypherX.zip',
  caption: menu,
  contextInfo: {
    externalAdReply: {
      title: "WhatsApp Bot Menu",
      body: "Cypher X MD",
      mediaType: 1,
      previewType: "PHOTO",
      thumbnailUrl: "https://files.catbox.moe/xxxxxx.jpg", // optional thumbnail
      mediaUrl: MENU_IMAGE,
      sourceUrl: "https://instagram.com"
    }
  }
}, { quoted: mek });

} catch (e) {
console.log(e);
reply(`❌ Error: ${e}`);
}

});