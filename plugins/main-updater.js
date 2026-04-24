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
    desc: "Update bot safely without losing config.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply }) => {

    try {
        await reply("*🔍 Checking for updates...*");

        const { data: commitData } = await axios.get(
            "https://api.github.com/repos/Tappy-TechX/Shadow-Xtech/commits/main"
        );

        const latest = commitData.sha;
        const current = await getCommitHash();

        if (latest === current) {
            return reply("✅ Already up-to-date.");
        }

        await reply("*🚀 Downloading update...*");

        const zipPath = path.join(__dirname, "latest.zip");

        const { data } = await axios.get(
            "https://github.com/Tappy-TechX/Shadow-Xtech/archive/main.zip",
            { responseType: "arraybuffer" }
        );

        fs.writeFileSync(zipPath, data);

        const extractPath = path.join(__dirname, "latest");
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        const source = path.join(extractPath, "Shadow-Xtech-main");
        const dest = path.join(__dirname, "..");

        await reply("*🔄 Updating files safely...*");

        copyFolderSync(source, dest);

        await setCommitHash(latest);

        // IMPORTANT FIX: DO NOT DELETE CONFIG DATA
        const configEnvPath = path.join(__dirname, "..", "config.env");

        if (!fs.existsSync(configEnvPath)) {
            fs.writeFileSync(configEnvPath, "");
        }

        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("*✅ Update complete. Restarting safely...*");

        // SMALL DELAY ensures config flush
        setTimeout(() => {
            process.exit(0);
        }, 1500);

    } catch (e) {
        console.error(e);
        return reply("❌ Update failed.");
    }
});

/**
 * SAFE COPY (IMPORTANT FIX)
 */
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);

    for (const item of items) {
        const src = path.join(source, item);
        const dst = path.join(target, item);

        // ❌ NEVER overwrite config files
        if (
            item === "config.js" ||
            item === "config.env" ||   // 🔥 IMPORTANT FIX
            item === "app.json"
        ) {
            console.log(`Skipping ${item}`);
            continue;
        }

        if (fs.lstatSync(src).isDirectory()) {
            copyFolderSync(src, dst);
        } else {
            fs.copyFileSync(src, dst);
        }
    }
}