const config = require('../config');
const { cmd } = require('../command');


/**
 * TOGGLE COMMAND
 */
cmd({
    pattern: "autorecordtype",
    alias: ["atr", "tyrec"],
    react: "⚙️",
    desc: "Toggle auto typing + recording together",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {

    if (!isOwner) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply("❌ Only owner can use this command!");
    }

    config.AUTO_TYPING_RECORDING = config.AUTO_TYPING_RECORDING || "false";

    if (config.AUTO_TYPING_RECORDING === "true") {
        config.AUTO_TYPING_RECORDING = "false";

        await conn.sendMessage(from, { react: { text: "🔴", key: mek.key } });
        return reply("❌ Auto Typing + Recording DISABLED");

    } else {
        config.AUTO_TYPING_RECORDING = "true";

        await conn.sendMessage(from, { react: { text: "🟢", key: mek.key } });
        return reply("✅ Auto Typing + Recording ENABLED");
    }
});


/**
 * AUTO TYPE → THEN RECORD (SEQUENTIAL MODE)
 */
cmd({
    on: "body"
}, async (conn, mek, m, { from }) => {

    if (config.AUTO_TYPING_RECORDING === 'true') {

        // 1️⃣ Typing first (5s)
        await conn.sendPresenceUpdate('composing', from);
        await new Promise(res => setTimeout(res, 5000));

        // 2️⃣ Then recording (5s)
        await conn.sendPresenceUpdate('recording', from);
        await new Promise(res => setTimeout(res, 5000));

        // 3️⃣ Stop presence
        await conn.sendPresenceUpdate('available', from);
    }
});
