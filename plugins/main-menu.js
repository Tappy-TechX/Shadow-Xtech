const config = require('../config');
const { cmd } = require('../command');
const fs = require("fs");
const path = require("path");
const { runtime } = require('../lib/functions');

// ===============================
// DATABASE SETUP
// ===============================

const dbPath = path.join(__dirname, '../lib/menu.json');

function getMenuType() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ menuType: "video" }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(dbPath));
    return data.menuType || "video";
}

function setMenuType(type) {
    fs.writeFileSync(dbPath, JSON.stringify({ menuType: type }, null, 2));
}

// ===============================
// CONFIG
// ===============================

const MENU_VIDEO_URL = 'https://files.catbox.moe/eubadj.mp4';

// ===============================
// MENU PAGES
// ===============================

const MENU_PAGES = [
`📥 *DOWNLOAD MENU*
facebook
tiktok
ytmp3
ytmp4
play`,

`👥 *GROUP MENU*
add
kick
promote
demote`,

`🎉 *FUN MENU*
joke
roast
8ball
ship`,

`🤖 *AI MENU*
ai
gpt
imagine`,

`⚡ *MAIN MENU*
ping
owner
alive
runtime`
];

// ===============================
// SET MENU COMMAND
// ===============================

cmd({
    pattern: "setmenu",
    desc: "Change menu style",
    category: "owner",
    use: ".setmenu <type>",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {

    if (!text) {
        return reply(`❌ Choose menu type:

video
document
carousel
footer
text
auto`);
    }

    const type = text.toLowerCase();
    const valid = ["video", "document", "carousel", "footer", "text", "auto"];

    if (!valid.includes(type)) {
        return reply("❌ Invalid type");
    }

    setMenuType(type);

    reply(`✅ Menu saved as *${type}* permanently`);
});

// ===============================
// MENU COMMAND
// ===============================

cmd({
    pattern: "menu",
    alias: ["allmenu"],
    desc: "Show menu",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {

    try {

        let menuType = getMenuType();

        // ===============================
        // AUTO DETECT DEVICE
        // ===============================
        const isAndroid = (m.message?.extendedTextMessage?.contextInfo?.deviceListMetadataVersion !== undefined);

        if (menuType === "auto") {
            menuType = isAndroid ? "document" : "video";
        }

        const page = parseInt(text) || 1;
        const totalPages = MENU_PAGES.length;

        const header = `💈 *${config.BOT_NAME}*
👑 ${config.OWNER_NAME}
⏱ ${runtime(process.uptime())}

📄 Page ${page}/${totalPages}
`;

        const body = MENU_PAGES[page - 1] || MENU_PAGES[0];

        const caption = header + "\n" + body + `\n\n> ${config.DESCRIPTION}`;

        // ===============================
        // MENU TYPES
        // ===============================

        // 🎥 VIDEO
        if (menuType === "video") {
            await conn.sendMessage(from, {
                video: { url: MENU_VIDEO_URL },
                caption,
                gifPlayback: true
            }, { quoted: mek });
        }

        // 📄 DOCUMENT
        else if (menuType === "document") {
            await conn.sendMessage(from, {
                document: { url: MENU_VIDEO_URL },
                mimetype: "application/pdf",
                fileName: `${config.BOT_NAME} Menu`,
                caption
            }, { quoted: mek });
        }

        // 🧾 TEXT
        else if (menuType === "text") {
            await reply(caption);
        }

        // 🎯 FOOTER STYLE
        else if (menuType === "footer") {
            await conn.sendMessage(from, {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: config.BOT_NAME,
                        body: "Advanced Menu System",
                        thumbnailUrl: MENU_VIDEO_URL,
                        sourceUrl: "https://github.com",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        }

        // 🎠 CAROUSEL (PAGINATED BUTTONS)
        else if (menuType === "carousel") {

            await conn.sendMessage(from, {
                text: caption,
                footer: "Navigate menu",
                buttons: [
                    {
                        buttonId: `.menu ${page - 1}`,
                        buttonText: { displayText: "⬅️ Prev" },
                        type: 1
                    },
                    {
                        buttonId: `.menu ${page + 1}`,
                        buttonText: { displayText: "➡️ Next" },
                        type: 1
                    }
                ],
                headerType: 1
            }, { quoted: mek });
        }

    } catch (err) {
        console.error(err);
        reply("❌ Menu error");
    }
});