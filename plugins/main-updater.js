const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: "🆕",
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply }) => {

    try {
        await reply("*🔍 Checking for Shadow-Xtech updates...*");

        // Fetch latest commit hash
        const { data: commitData } = await axios.get(
            "https://api.github.com/repos/Tappy-TechX/Shadow-Xtech/commits/main"
        );

        const latestCommitHash = commitData.sha;

        // Get current stored hash
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("✅ Your Sʜᴀᴅᴏᴡ-Xᴛᴇᴄʜ bot is already up-to-date!");
        }

        await reply("*🚀 Updating Shadow-Xtech Bot...*");

        // Download latest source code
        const zipPath = path.join(__dirname, "latest.zip");

        const { data: zipData } = await axios.get(
            "https://github.com/Tappy-TechX/Shadow-Xtech/archive/main.zip",
            { responseType: "arraybuffer" }
        );

        fs.writeFileSync(zipPath, zipData);

        // Extract zip
        await reply("*📦 Extracting latest files...*");

        const extractPath = path.join(__dirname, "latest");
        const zip = new AdmZip(zipPath);

        zip.extractAllTo(extractPath, true);

        // Replace files
        await reply("*🔄 Replacing bot files...*");

        const sourcePath = path.join(extractPath, "Shadow-Xtech-main");
        const destinationPath = path.join(__dirname, "..");

        copyFolderSync(sourcePath, destinationPath);

        // Save new commit hash
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, {
            recursive: true,
            force: true
        });

        await reply("*✅ Update complete! Restarting bot...*");

        process.exit(0);

    } catch (error) {
        console.error("Update error:", error);
        return reply("❌ Update failed. Please update manually.");
    }
});

// Copy folders while preserving config.js & app.json
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);

    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Preserve custom config files
        if (item === "config.js" || item === "app.json") {
            console.log(`Skipping ${item}`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}