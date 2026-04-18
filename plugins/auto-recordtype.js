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
 * AUTO TYPE + RECORD (SYNC 5s MODE)
 */
cmd({
    on: "body"
}, async (conn, mek, m, { from }) => {

    if (config.AUTO_TYPING_RECORDING === 'true') {

        // start both at same time
        await Promise.all([
            conn.sendPresenceUpdate('composing', from),
            conn.sendPresenceUpdate('recording', from)
        ]);

        // keep BOTH active for 5 seconds
        await new Promise(res => setTimeout(res, 5000));

        // optional: stop presence after 5s
        await conn.sendPresenceUpdate('available', from);
    }
});
