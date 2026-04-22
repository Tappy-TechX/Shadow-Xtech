const { cmd } = require("../command");
const { setAnti, getAllAntiEditSettings } = require("../data/antiedit");

cmd({
    pattern: "antiedit",
    alias: ["editguard"],
    desc: "Control AntiEdit system",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, q, isCreator }) => {

    if (!isCreator) return reply("**📌 Owner only command**");

    const settings = await getAllAntiEditSettings();

    if (!q) {
        return reply(
`*_ANTI EDIT STATUS_*:

👥 Group: ${settings.gc_status ? "ON ✅" : "OFF ❌"}
💬 DM: ${settings.dm_status ? "ON ✅" : "OFF ❌"}

USAGE:
antiedit on
antiedit off
antiedit gc on/off
antiedit dm on/off`
        );
    }

    const args = q.toLowerCase().split(" ");

    // GLOBAL ON/OFF
    if (args[0] === "on") {
        await setAnti("gc", true);
        await setAnti("dm", true);
        return reply("✅ AntiEdit ENABLED for ALL");
    }

    if (args[0] === "off") {
        await setAnti("gc", false);
        await setAnti("dm", false);
        return reply("❌ AntiEdit DISABLED for ALL");
    }

    // GROUP CONTROL
    if (args[0] === "gc") {
        if (args[1] === "on") {
            await setAnti("gc", true);
            return reply("👥 Group AntiEdit ON");
        }
        if (args[1] === "off") {
            await setAnti("gc", false);
            return reply("👥 Group AntiEdit OFF");
        }
    }

    // DM CONTROL
    if (args[0] === "dm") {
        if (args[1] === "on") {
            await setAnti("dm", true);
            return reply("💬 DM AntiEdit ON");
        }
        if (args[1] === "off") {
            await setAnti("dm", false);
            return reply("💬 DM AntiEdit OFF");
        }
    }

    reply("Invalid format. Try: antiedit on/off | gc on/off | dm on/off");
});