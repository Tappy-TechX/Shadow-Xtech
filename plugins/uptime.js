const { cmd } = require('../command');
const os = require("os");
const process = require("process");

// Fancy uptime formatter
function fancyUptime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const dayStr = d > 0 ? `${d}d ` : "";
    const hourStr = h > 0 ? `${h}h ` : "";
    const minStr = m > 0 ? `${m}m ` : "";
    const secStr = s > 0 ? `${s}s` : "";

    return `${dayStr}${hourStr}${minStr}${secStr}`.trim() || "0s";
}

cmd({
    pattern: "uptime",
    alias: ["av", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, reply, botNumber, pushname }) => {
    try {
        const platform = "Heroku Platform";
        const release = os.release();
        const cpuModel = os.cpus()[0].model;
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuCores = os.cpus().length;
        const arch = os.arch();
        const nodeVersion = process.version;
        const botName = pushname || "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ";
        const owner = "Black-Tappy";

        // Stylish header - no box lines
        const header = `🟢  𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ 𝐈ꜱ 𝐀ʟɪᴠᴇ 𝐌ᴏᴛʜᴇʀ𝐟ᴜᴄᴋᴇʀ 🟢`;

        const status = `
${header}

🤖 𝐁ᴏᴛ 𝐍ᴀᴍᴇ : ${botName}
🆔 𝐁ᴏᴛ 𝐈ᴅ : @${botNumber.replace(/@.+/, "")}
👑 𝐎ᴡɴᴇʀ : ${owner}

⏳ 𝐔ᴘᴛɪᴍᴇ : ${fancyUptime(process.uptime())}
💾 𝐑ᴀᴍ 𝐔ꜱᴀɢᴇ : ${usedMem} MB / ${totalMem} MB
🖥️ 𝐏ʟᴀᴛꜰᴏʀᴍ : ${platform} (v${release}) [${arch}]
⚙️ 𝐂ᴘᴜ: ${cpuModel} (${cpuCores} cores)
🟢 𝐍ᴏᴅᴇ 𝐕ᴇʀꜱɪᴏɴ : ${nodeVersion}
🧬 𝐕ᴇʀꜱɪᴏɴ : 8.0.0 BETA

───────────────
⚪ Static Server Running With Ultimate Power ⚪!
        `;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/og4tsk.jpg" },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/4yqp5m.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`🚨 *An error occurred:* ${e.message}`);
    }
});
