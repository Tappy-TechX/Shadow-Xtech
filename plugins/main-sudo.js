const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const OWNER_PATH = path.join(__dirname, "../lib/sudo.json");

// Ensure the sudo.json file exists
const ensureOwnerFile = () => {
  if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
  }
};

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 

// ✅ Add sudo
cmd({
    pattern: "setsudo",
    alias: ["addsudo", "addowner"],
    desc: "Add a temporary owner",
    category: "owner",
    react: "😇",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*❗This Command Can Only Be Used By My Owner!*");
        }

        ensureOwnerFile();

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🔴 Please provide a number or tag/reply a user.*");
        }

        let owners = JSON.parse(fs.readFileSync(OWNER_PATH));

        if (owners.includes(target)) {
            return reply("*📌 This user is already a temporary owner.*");
        }

        owners.push(target);
        fs.writeFileSync(OWNER_PATH, JSON.stringify([...new Set(owners)], null, 2));

        const text = "*✅ Successfully Added User As Temporary Owner*";
        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | System Pulse",
                    body: "Add • Guard • Protect",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`*🔴 Error:* ${err.message}`);
    }
});

// ❌ Remove sudo
// =============================
cmd({
    pattern: "delsudo",
    alias: ["delowner", "deletesudo"],
    desc: "Remove a temporary owner",
    category: "owner",
    react: "🫩",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*❗This Command Can Only Be Used By My Owner!*");
        }

        ensureOwnerFile();

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            return reply("*📌 Please provide a number or tag/reply a user.*");
        }

        let owners = JSON.parse(fs.readFileSync(OWNER_PATH));

        if (!owners.includes(target)) {
            return reply("*🔴 User not found in owner list.*");
        }

        const updated = owners.filter(x => x !== target);
        fs.writeFileSync(OWNER_PATH, JSON.stringify(updated, null, 2));

        const text = "*✅ Successfully Removed User As Temporary Owner*";
        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 144
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | System Pulse",
                    body: "Restrict • Guard • Protect",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`*🔴 Error:* ${err.message}`);
    }
});

// 📋 List sudo
cmd({
    pattern: "listsudo",
    alias: ["listowner"],
    desc: "List all temporary owners",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        if (!isCreator) {
            return reply("*❗This Command Can Only Be Used By My Owner!*");
        }

        ensureOwnerFile();

        let owners = JSON.parse(fs.readFileSync(OWNER_PATH));
        owners = [...new Set(owners)];

        if (owners.length === 0) {
            return reply("*❌ No temporary owners found.*");
        }

        let listMessage = "*🤴 List of Sudo Owners:*\n\n";
        owners.forEach((owner, i) => {
            listMessage += `*${i + 1}. ${owner.replace("@s.whatsapp.net", "")}*\n`;
        });

        await conn.sendMessage(from, {
            text: listMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 145
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | System Pulse",
                    body: "All Temporary Owners",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`*🔴 Error:* ${err.message}`);
    }
});