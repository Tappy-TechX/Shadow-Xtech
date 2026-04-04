const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"; 

// ❌ Ban user
cmd({
    pattern: "ban",
    alias: ["blockuser", "addban"],
    desc: "Ban a user from using the bot",
    category: "owner",
    react: "⛔",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*_❗Only the bot owner can use this command!_*");
        }

        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } }); // loading

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🔴 Please provide a number or tag/reply a user.*");
        }

        let banned = JSON.parse(fs.readFileSync("./lib/ban.json", "utf-8"));

        if (banned.includes(target)) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🔴 This user is already banned.*");
        }

        banned.push(target);
        fs.writeFileSync("./lib/ban.json", JSON.stringify([...new Set(banned)], null, 2));

        const text = `*⛔ User has been banned from using the bot.*\n\n*👤 @${target.split("@")[0]}*`;

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
                    title: "⚙️ Shadow-Xtech | Ban User",
                    body: "Restrict • Guard • Protect",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); // success

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); // error
        reply("❌ Error: " + err.message);
    }
});

// ✅ Unban user
cmd({
    pattern: "unban",
    alias: ["removeban"],
    desc: "Unban a user",
    category: "owner",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("_❗Only the bot owner can use this command!_");
        }

        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } }); // loading

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🔴 Please provide a number or tag/reply a user.*");
        }

        let banned = JSON.parse(fs.readFileSync("./lib/ban.json", "utf-8"));

        if (!banned.includes(target)) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*🔴 This user is not banned.*");
        }

        const updated = banned.filter(u => u !== target);
        fs.writeFileSync("./lib/ban.json", JSON.stringify(updated, null, 2));

        const text = `*✅ User has been unbanned.*\n\n*👤 @${target.split("@")[0]}*`;

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
                    title: "⚙️ Shadow-Xtech | Unban System",
                    body: "Restrict • Guard • Protect",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); // success

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); // error
        reply("*🔴 Error:* " + err.message);
    }
});

// 📋 List banned users
cmd({
    pattern: "listban",
    alias: ["banlist", "bannedusers"],
    desc: "List all banned users",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*_❗Only the bot owner can use this command!_*");
        }

        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } }); // loading

        let banned = JSON.parse(fs.readFileSync("./lib/ban.json", "utf-8"));
        banned = [...new Set(banned)];

        if (banned.length === 0) return reply("*🔴 No banned users found.*");

        let msg = "`*⛔ Banned Users:*`\n\n";
        banned.forEach((id, i) => {
            msg += `${i + 1}. @${id.replace("@s.whatsapp.net", "")}\n`;
        });

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                mentionedJid: banned,
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚙️ Shadow-Xtech | Listban System",
                    body: "Restrict • Guard • Protect",
                    thumbnailUrl: 'https://files.catbox.moe/3hrxbh.jpg',
                    sourceUrl: whatsappChannelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); // success

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); // error
        reply("*🔴 Error:* " + err.message);
    }
});