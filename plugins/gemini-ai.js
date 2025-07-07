const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs').promises; // Use promises version of fs for async operations
const path = require('path');

// Define the path to your config file. Adjust this as per your project structure.
const CONFIG_FILE = path.resolve(__dirname, '../config.json');

// --- Helper Functions for Config Management ---

/**
 * Reads the configuration from the config file.
 * @returns {Promise<object>} The configuration object.
 */
async function readConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, return a default configuration
            return {
                gemini: {
                    enabledGlobally: true,
                    enabledChats: {}
                }
            };
        }
        console.error("Error reading config file:", error);
        return {}; // Return empty on other errors
    }
}

/**
 * Writes the configuration to the config file.
 * @param {object} config - The configuration object to write.
 */
async function writeConfig(config) {
    try {
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing config file:", error);
    }
}

// --- Command Registration ---

// Register the new 'gemini' command.
cmd({
    pattern: "gemini",
    alias: ["g", "gem"],
    desc: "Chat with Gemini AI.",
    category: "ai",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const config = await readConfig();
        const geminiConfig = config.gemini || { enabledGlobally: true, enabledChats: {} };

        // Check global and chat-specific enablement
        if (!geminiConfig.enabledGlobally) {
            return reply("Gemini AI is currently disabled globally. Use `.gemini-on` to enable it.");
        }

        if (m.isGroup && !geminiConfig.enabledChats[from]) {
            return reply("Gemini AI is not enabled in this group. Use `.gemini-enable` to enable it here.");
        }

        if (m.isPrivate && !geminiConfig.enabledChats[from]) { // 'from' is the JID of the private chat
             return reply("Gemini AI is not enabled in DMs. Use `.gemini-enable` to enable it here.");
        }


        if (!q) {
            return reply("Please provide a message for Gemini AI.\nExample: `.gemini Tell me a fun fact`");
        }

        const apiUrl = `https://api.paxsenix.biz.id/ai/gemini-realtime?text=${encodeURIComponent(q)}&session_id=ZXlKaklqb2lZMTg0T0RKall6TTNNek13TVdFNE1qazNJaXdpY2lJNkluSmZNbU01TUdGa05ETmtNVFF3WmpNNU5pSXNJbU5vSWpvaWNtTmZZVE16TURWaE1qTmpNR1ExTnpObFl5Sjk`;

        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("Gemini AI failed to respond. Please try again later.");
        }

        await reply(`*Gemini:* ${data.message}`);
        await react("✅");

    } catch (e) {
        console.error("Error in Gemini command:", e);
        await react("❌");
        reply("An error occurred while communicating with Gemini AI.");
    }
});

// --- New Commands for Toggling ---

// Command to enable Gemini AI globally
cmd({
    pattern: "gemini-on",
    desc: "Enable Gemini AI globally.",
    category: "ai",
    react: "✅",
    filename: __filename,
    // Add owner-only restriction if needed
    // owner: true
},
async (conn, mek, m, { reply, react }) => {
    try {
        const config = await readConfig();
        config.gemini = config.gemini || { enabledGlobally: true, enabledChats: {} };

        if (config.gemini.enabledGlobally) {
            await react("ℹ️");
            return reply("Gemini AI is already enabled globally.");
        }

        config.gemini.enabledGlobally = true;
        await writeConfig(config);
        await react("✅");
        reply("Gemini AI has been enabled globally.");
    } catch (e) {
        console.error("Error enabling Gemini globally:", e);
        await react("❌");
        reply("An error occurred while trying to enable Gemini AI globally.");
    }
});

// Command to disable Gemini AI globally
cmd({
    pattern: "gemini-off",
    desc: "Disable Gemini AI globally.",
    category: "ai",
    react: "❌",
    filename: __filename,
    // Add owner-only restriction if needed
    // owner: true
},
async (conn, mek, m, { reply, react }) => {
    try {
        const config = await readConfig();
        config.gemini = config.gemini || { enabledGlobally: true, enabledChats: {} };

        if (!config.gemini.enabledGlobally) {
            await react("ℹ️");
            return reply("Gemini AI is already disabled globally.");
        }

        config.gemini.enabledGlobally = false;
        await writeConfig(config);
        await react("✅");
        reply("Gemini AI has been disabled globally.");
    } catch (e) {
        console.error("Error disabling Gemini globally:", e);
        await react("❌");
        reply("An error occurred while trying to disable Gemini AI globally.");
    }
});

// Command to enable Gemini AI in the current chat (group or DM)
cmd({
    pattern: "gemini-enable",
    desc: "Enable Gemini AI in this chat.",
    category: "ai",
    react: "✅",
    filename: __filename,
    // Add group/private chat admin restriction if needed
    // admin: true // For groups, or a custom check for private chats
},
async (conn, mek, m, { from, reply, react }) => {
    try {
        const config = await readConfig();
        config.gemini = config.gemini || { enabledGlobally: true, enabledChats: {} };

        if (config.gemini.enabledChats[from]) {
            await react("ℹ️");
            return reply("Gemini AI is already enabled in this chat.");
        }

        config.gemini.enabledChats[from] = true;
        await writeConfig(config);
        await react("✅");
        reply("Gemini AI has been enabled in this chat.");
    } catch (e) {
        console.error("Error enabling Gemini in chat:", e);
        await react("❌");
        reply("An error occurred while trying to enable Gemini AI in this chat.");
    }
});

// Command to disable Gemini AI in the current chat (group or DM)
cmd({
    pattern: "gemini-disable",
    desc: "Disable Gemini AI in this chat.",
    category: "ai",
    react: "❌",
    filename: __filename,
    // Add group/private chat admin restriction if needed
    // admin: true // For groups, or a custom check for private chats
},
async (conn, mek, m, { from, reply, react }) => {
    try {
        const config = await readConfig();
        config.gemini = config.gemini || { enabledGlobally: true, enabledChats: {} };

        if (!config.gemini.enabledChats[from]) {
            await react("ℹ️");
            return reply("Gemini AI is already disabled in this chat.");
        }

        delete config.gemini.enabledChats[from]; // Remove the entry to disable
        await writeConfig(config);
        await react("✅");
        reply("Gemini AI has been disabled in this chat.");
    } catch (e) {
        console.error("Error disabling Gemini in chat:", e);
        await react("❌");
        reply("An error occurred while trying to disable Gemini AI in this chat.");
    }
});
