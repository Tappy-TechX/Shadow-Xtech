const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"], // Aliases for the command
    use: '.ping', // Usage example
    desc: "Check bot's response time, load, and stability.", // Description of the command
    category: "main", // Command category
    react: "⚡", // Reaction to be sent when the command is triggered
    filename: __filename // Path to the current file, useful for logging
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // --- Latency Measurement ---
        // Record the time when the command was received to calculate the round-trip time (latency).
        const start = Date.now();

        // --- Status Indicators ---
        // Stylish Emojis for visual appeal in the response.
        const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];
        
        // --- Fancy Loading Messages ---
        // Array of dynamic, stylish messages to display while the bot is processing.
        const loadingMessages = [
            "*〘⚡ Analyzing bot speed... 〙*",
            "*〘🚀 Calculating latency... 〙*",
            "*〘📊 Checking system load... 〙*",
            "*〘✨ Performing diagnostics... 〙*",
            "*〘⚙️ Optimizing response... 〙*",
            "*〘⏳ Gathering performance data... 〙*",
            "*〘📡 Fetching real-time metrics... 〙*",
            "*〘💡 Assessing bot health... 〙*"
        ];
        // Select a random loading message to display.
        const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

        // --- Speed and Latency Quotes ---
        // Dynamic, speed and latency-focused quotes for a more engaging and personalized response.
        const speedLatencyQuotes = [
            "“✨Speed is key in the digital realm.✨”",
            "“🟢Latency is the silent killer of user experience.🎀”",
            "“❤️Fast responses make a happy user.💞”",
            "“🤔The quicker the bot, the better the service.🥹”",
            "“✅Measuring performance, one ping at a time.📊”",
            "“📆Where there's speed, there's progress.🟢”",
            "“🚀Battling latency, one millisecond at a time.⚡”",
            "“💡The art of the bot is in its swiftness.🌟”",
            "“📈Performance is not just about speed, but consistency.⚙️”",
            "“👑In the world of bots, speed is king.👑”",
            "“💨Don't let latency slow you down!💨”",
            "“⚡Our bot runs at the speed of thought... almost!⚡”"
        ];
        // Select a random quote to display.
        const randomQuote = speedLatencyQuotes[Math.floor(Math.random() * speedLatencyQuotes.length)];

        // Send the randomly selected "fancy" loading message.
        await conn.sendMessage(from, {
            text: randomLoadingMessage
        });
        const end = Date.now();
        const latencyMs = end - start; // This variable represents the bot's response latency in milliseconds.
        let stabilityStatus = "Stable";
        if (latencyMs > 1000) stabilityStatus = "Slow"; // Latency over 1 second
        else if (latencyMs > 500) stabilityStatus = "Moderate"; // Latency between 500ms and 1000ms
        const memoryUsage = process.memoryUsage();
        const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024; // Convert bytes to Megabytes for readability.
        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(sender, 'image');
        } catch {
            profilePicUrl = 'https://i.ibb.co/gdpjw5w/pp-wa-3.jpg'; // Example fallback image URL
        }
        const stylishText = `
╭─❏ *『 BOT PERFORMANCE REPORT 』*
│
├─🤖 *Bot Name:* ${config.botname || 'SHADOW-XTECH'}
├─⚡ *Latency:* ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${latencyMs}ms
├─📶 *Bot Load:* ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${memoryUsageMB.toFixed(2)} MB
├─✨ *Stability:* ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${stabilityStatus}
├─⏱️ *Checked At:* ${new Date().toLocaleTimeString()}
│
╰─❏ *${randomQuote}!*
        `.trim(); // .trim() removes any leading/trailing whitespace.
        await conn.sendMessage(from, {
            image: { url: profilePicUrl },
            caption: stylishText, 
            contextInfo: {
                mentionedJid: [sender], 
                forwardingScore: 999, 
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek }); // Reply to the original message

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
