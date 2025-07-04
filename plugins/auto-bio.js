Const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Record the bot's start time
let autoBioEnabled = true; // Default state: autobio is enabled

// Array of fancy quotes
const FANCY_QUOTES = [
   "🚀 Firing up engines! Measuring my warp speed and checking vitals. Standby for a blazing fast status update!"
   "⚡ Pulse check & ping! Assessing my digital reflexes and confirming I'm alive and kicking. A moment, please!"
   "✨ Initiating diagnostic scan... Just confirming my cosmic connection and calculating response velocity. Almost there!"
   "⏳ Heartbeat strong, circuits clear! I'm gauging my operational speed to bring you live status. Thanks for your patience!"
   "🧠 Awake and agile! I'm running a quick self-assessment to report on my health and responsiveness. Your command is my pleasure!"

];

// Function to get a random fancy quote
const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * FANCY_QUOTES.length);
    return FANCY_QUOTES[randomIndex];
};

cmd({
    // Updated pattern to capture "on" or "off" arguments
    pattern: "autobio ?(.*)",
    desc: "Sets the bot's WhatsApp bio with dynamic info and a random quote. Use 'autobio on' or 'autobio off' to toggle the feature.",
    category: "owner", // Changing bot's bio typically requires owner privileges
    react: "📝", // A fitting reaction for updating bio
    filename: __filename
}, async (conn, mek, m, { reply, from, args }) => {
    const toggleArg = args[0] ? args[0].toLowerCase() : '';

    // --- TOGGLE FUNCTIONALITY ---
    if (toggleArg === 'on') {
        if (autoBioEnabled) {
            return reply("✅ Autobio is already enabled.");
        }
        autoBioEnabled = true;
        return reply("✅ Autobio has been enabled. I will now update my bio dynamically.");
    } else if (toggleArg === 'off') {
        if (!autoBioEnabled) {
            return reply("❌ Autobio is already disabled.");
        }
        autoBioEnabled = false;
        return reply("❌ Autobio has been disabled. I will no longer update my bio dynamically.");
    }

    // If no toggle argument is given, proceed with bio update if enabled
    if (!autoBioEnabled) {
        return reply("❌ The autobio feature is currently disabled. Use `autobio on` to enable it.");
    }

    try {
        // --- IMMEDIATE FAST RESPONSE ---
        await reply("Updating bot bio... Please wait! 🔄");

        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do,YYYY"); // Ensures full date, including year

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const randomQuote = getRandomQuote();

        // Construct the new bio message
        const newBio = `
🌟 SHADOW-XTECH 🌟
🕒 Online: ${runtimeHours}h ${runtimeMinutes}m ${runtimeSeconds}s
🤖 Status: Active!
"${randomQuote}"
🔹 Black-Tappy 🔹
        `.trim();

        // Update the bot's WhatsApp bio
        await conn.updateProfileStatus(newBio);

        // Confirm to the user that the bio has been updated
        await reply(`✅ Bot bio updated successfully!\n\n*New Bio:*\n\`\`\`${newBio}\`\`\``);

    } catch (error) {
        console.error("Error in autobio command: ", error);
        
        // Respond with error details
        const errorMessage = `
❌ An error occurred while trying to update the bot's bio.
🛠 *Error Details*:
${error.message}

This command typically requires owner privileges. Please ensure the bot has the necessary permissions or contact the owner.
        `.trim();
        return reply(errorMessage);
    }
});
