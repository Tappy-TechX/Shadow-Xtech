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
            "*❌ Usage:* .setprefix <prefix>\n" +
            "*Examples:*\n" +
            "`.setprefix !`\n" +
            "`.setprefix 1`\n" +
            "`.setprefix #`\n" +
            "`.setprefix none` (no prefix)"
        );
    }

    let newPrefix = args[0];

    // Handle "none" prefix
    if (newPrefix.toLowerCase() === "none") {
        newPrefix = "";
    }

    // Update in memory
    config.PREFIX = newPrefix;

    try {
        const configPath = path.join(__dirname, '..', 'config.js');
        let file = fs.readFileSync(configPath, 'utf8');

        // Replace PREFIX line safely
        if (file.includes('PREFIX')) {
            file = file.replace(
                /PREFIX\s*:\s*["'`].*?["'`]/,
                `PREFIX: "${newPrefix}"`
            );
        } else {
            return reply("*⚠️ Could not find PREFIX in config file!*");
        }

        fs.writeFileSync(configPath, file);

        return reply(
            `*🟢 Prefix successfully changed!*\n\n` +
            `*New Prefix:* ${newPrefix === "" ? "None (no prefix)" : newPrefix}`
        );

    } catch (err) {
        console.error(err);
        return reply("*❌ Failed to update prefix permanently!*");
    }
});
