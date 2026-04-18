const config = require('../config');
const { cmd } = require('../command');


cmd({
    pattern: "autorecordtype",
    alias: ["atr", "tyrec"],
    react: "⚙️",
    desc: "Toggle auto typing + recording together",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {

    if (!isOwner) return reply("❌ Only owner can use this command!");

    if (!config.AUTO_TYPING_RECORDING) {
        config.AUTO_TYPING_RECORDING = "false";
    }

    if (config.AUTO_TYPING_RECORDING === "true") {
        config.AUTO_TYPING_RECORDING = "false";
        reply("❌ Auto Typing + Recording DISABLED");
    } else {
        config.AUTO_TYPING_RECORDING = "true";
        reply("✅ Auto Typing + Recording ENABLED");
    }
});

/**
 * AUTO TYPE + RECORD (COMBINED MODE)
 * Sends both "composing" and "recording" presence
 */
cmd({
    on: "body"
}, async (conn, mek, m, { from }) => {

    if (config.AUTO_TYPING_RECORDING === 'true') {

        // typing first
        await conn.sendPresenceUpdate('composing', from);

        // slight delay makes it more realistic
        await new Promise(res => setTimeout(res, 500));

        // then recording
        await conn.sendPresenceUpdate('recording', from);
    }
});
