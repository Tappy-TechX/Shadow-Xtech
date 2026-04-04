const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "restart",
    desc: "Restart bot with circle-style animated progress",
    category: "owner",
    react: "♻️",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        // 🚫 Owner check
        if (!isCreator) {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });
            return reply("*🚫 Access denied. Owner only command.*");
        }

        // ⏳ Initial react
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: mek.key } });

        // Circle-style spinner frames
        const spinner = ["◐","◓","◑","◒"];

        // Initial progress message
        let progressMsg = await reply("*♻️ Bot restart initiated...*\n[□□□□□□] 0% ◐");

        const totalSteps = 6; // Number of progress segments
        let frameIndex = 0;

        for (let i = 1; i <= totalSteps; i++) {
            await sleep(800); // wait per step

            // Build progress bar
            let filled = "■".repeat(i);
            let empty = "□".repeat(totalSteps - i);
            let percent = Math.round((i / totalSteps) * 100);

            // Spinner frame
            let spin = spinner[frameIndex % spinner.length];
            frameIndex++;

            // Edit message
            await conn.sendMessage(m.chat, {
                text: `*♻️ [${filled}${empty}] ${percent}% ${spin}*`
            }, { edit: progressMsg.key });
        }

        // Execute restart
        const { exec } = require("child_process");
        exec("pm2 restart all", async (error) => {
            if (error) {
                console.error(error);
                await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });
                return reply(`*🔴 Failed to restart bot:*\n${error.message}`);
            }

            // ✅ Success
            await conn.sendMessage(m.chat, { react: { text: "✅", key: mek.key } });
            await conn.sendMessage(m.chat, { text: "*✅ Bot restarted successfully!*", edit: progressMsg.key });
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });
        reply(`*❌ Error occurred: ${e.message}*`);
    }
});