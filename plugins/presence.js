const { cmd } = require("../command");
const config = require("../config");

/*
|--------------------------------------------------------------------------
| Always Online Command
|--------------------------------------------------------------------------
*/
cmd({
    pattern: "alwaysonline",
    alias: ["online", "stayonline"],
    react: "🟢",
    desc: "Enable/Disable always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { reply, args, isOwner }) => {
    try {
        if (!isOwner) {
            return reply("❌ Owner only command.");
        }

        const input = args[0]?.toLowerCase();

        // Show current status
        if (!input) {
            return reply(
                `🟢 *Always Online Settings*\n\n` +
                `Current Status: *${config.ALWAYS_ONLINE}*\n\n` +
                `Usage:\n` +
                `.alwaysonline on\n` +
                `.alwaysonline off`
            );
        }

        if (input === "on") {
            config.ALWAYS_ONLINE = "true";
            return reply("✅ Always online mode enabled.");
        }

        if (input === "off") {
            config.ALWAYS_ONLINE = "false";
            return reply("✅ Always online mode disabled.");
        }

        return reply("❌ Use `.alwaysonline on` or `.alwaysonline off`");

    } catch (err) {
        console.log("AlwaysOnline Command Error:", err);
        reply("❌ Error updating always online setting.");
    }
});


/*
|--------------------------------------------------------------------------
| Always Online Presence Handler
|--------------------------------------------------------------------------
*/
cmd({
    on: "body"
},
async (conn, mek, m) => {
    try {
        if (config.ALWAYS_ONLINE === "true") {
            await conn.sendPresenceUpdate("available");
        }
    } catch (err) {
        console.log("AlwaysOnline Presence Error:", err);
    }
});
