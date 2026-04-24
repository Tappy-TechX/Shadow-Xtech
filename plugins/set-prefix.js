const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix (supports symbols, numbers, or none).",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {

    if (!isCreator) return reply("*📛 Only the owner can use this command!*");

    if (!args[0]) {
        return reply(
            "*❌ Usage:* " + config.PREFIX + "setprefix <prefix>\n" +
            "*Examples:*\n" +
            "`" + config.PREFIX + "setprefix !`\n" +
            "`" + config.PREFIX + "setprefix 1`\n" +
            "`" + config.PREFIX + "setprefix #`\n" +
            "`" + config.PREFIX + "setprefix none` (no prefix)"
        );
    }

    let newPrefix = args[0];

    // Handle "none" prefix
    if (newPrefix.toLowerCase() === "none") {
        newPrefix = "";
    }

    try {
        const configPath = path.join(__dirname, '..', 'config.js');
        let file = fs.readFileSync(configPath, 'utf8');

        // Replace PREFIX line safely
        if (file.includes('PREFIX')) {
            if (newPrefix === "") {
                file = file.replace(
                    /PREFIX\s*:\s*["'`].*?["'`]/,
                    'PREFIX: ""'
                );
            } else {
                file = file.replace(
                    /PREFIX\s*:\s*["'`].*?["'`]/,
                    `PREFIX: "${newPrefix}"`
                );
            }
        } else {
            return reply("*⚠️ Could not find PREFIX in config file!*");
        }

        fs.writeFileSync(configPath, file);

        // Update in memory immediately
        config.PREFIX = newPrefix;
        
        // Clear the require cache so index.js picks up the change
        delete require.cache[require.resolve('../config')];

        return reply(
            `*🟢 Prefix successfully changed!*\n\n` +
            `*New Prefix:* ${newPrefix === "" ? "None (no prefix)" : newPrefix}\n\n` +
            `*ℹ️ Note:* The change is immediate. You can now use the new prefix.`
        );

    } catch (err) {
        console.error(err);
        return reply("*❌ Failed to update prefix permanently!*");
    }
});