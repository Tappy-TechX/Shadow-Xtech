const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command");

const envPath = path.join(__dirname, "../config.env");

// runtime tracking
const spamData = {
    warns: {},
    history: {},
    limit: 5, // messages within 5 seconds
};

// save config value permanently
function saveEnvVar(key, value) {
    let envData = "";

    if (fs.existsSync(envPath)) {
        envData = fs.readFileSync(envPath, "utf8");
    }

    const regex = new RegExp(`^${key}=.*$`, "m");

    if (envData.match(regex)) {
        envData = envData.replace(regex, `${key}=${value}`);
    } else {
        envData += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envData.trim() + "\n");
}

// command to change antispam mode
cmd({
    pattern: "antispam",
    alias: ["spamprotect"],
    desc: "Manage anti spam system",
    category: "group",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { args, isOwner, from }) => {

    const mode = (args[0] || "").toLowerCase();

    if (!mode) {
        return m.reply(
            `📊 *ANTI-SPAM STATUS*\n\n` +
            `Mode: ${config.ANTI_SPAM.toUpperCase()}\n` +
            `Limit: ${spamData.limit} messages / 5 sec\n\n` +
            `Usage:\n` +
            `.antispam warn\n` +
            `.antispam kick\n` +
            `.antispam off`
        );
    }

    if (!isOwner) return m.reply("❌ Owner only command");

    if (!["warn", "kick", "off"].includes(mode)) {
        return m.reply("Invalid mode. Use: warn / kick / off");
    }

    saveEnvVar("ANTI_SPAM", mode);

    config.ANTI_SPAM = mode;

    m.reply(`✅ Anti-spam mode updated to *${mode.toUpperCase()}*`);
});


// message detector
cmd({
    on: "body"
},
async (conn, mek, m, { from, sender, isGroup, isAdmins, isBotAdmins }) => {

    if (!isGroup) return;
    if (config.ANTI_SPAM === "off") return;

    if (!spamData.history[from]) spamData.history[from] = {};
    if (!spamData.warns[from]) spamData.warns[from] = {};

    if (!spamData.history[from][sender]) {
        spamData.history[from][sender] = [];
    }

    const now = Date.now();

    spamData.history[from][sender].push(now);

    // keep only last 5 sec messages
    spamData.history[from][sender] =
        spamData.history[from][sender].filter(
            time => now - time < 5000
        );

    const count = spamData.history[from][sender].length;

    if (count >= spamData.limit) {

        if (config.ANTI_SPAM === "warn") {
            spamData.warns[from][sender] =
                (spamData.warns[from][sender] || 0) + 1;

            const warns = spamData.warns[from][sender];

            await conn.sendMessage(from, {
                text: `⚠️ @${sender.split("@")[0]} spam detected!\nWarning: ${warns}/3`,
                mentions: [sender]
            });

            spamData.history[from][sender] = [];

            if (warns >= 3 && isBotAdmins) {
                await conn.groupParticipantsUpdate(
                    from,
                    [sender],
                    "remove"
                );

                delete spamData.warns[from][sender];
            }

        } else if (config.ANTI_SPAM === "kick") {

            if (isBotAdmins) {
                await conn.sendMessage(from, {
                    text: `🚫 @${sender.split("@")[0]} removed for spam.`,
                    mentions: [sender]
                });

                await conn.groupParticipantsUpdate(
                    from,
                    [sender],
                    "remove"
                );
            }
        }

        spamData.history[from][sender] = [];
    }
});