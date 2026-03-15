const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antilib');

// Initialize settings
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Configure the AntiDelete feature.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, q, isCreator }) => {
    if (!isCreator) return reply('*_📌 This command is only for the bot owner._*');

    try {
        const command = q?.toLowerCase();
        switch (command) {
            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('*🟢 _AntiDelete is now ENABLED for all chats._*');

            case 'off gc':
                await setAnti('gc', false);
                return reply('*🔴 _AntiDelete for Group Chats is now DISABLED._*');

            case 'off dm':
                await setAnti('dm', false);
                return reply('*🔴 _AntiDelete for Direct Messages is now DISABLED._*');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`*🔄 _AntiDelete for Group Chats is now ${!gcStatus ? 'ENABLED' : 'DISABLED'}._*`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`*🔄 _AntiDelete for Direct Messages is now ${!dmStatus ? 'ENABLED' : 'DISABLED'}._*`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('*✅ _AntiDelete has been ENABLED for all chats._*');

            case 'status':
                const currentStatus = await getAllAntiDeleteSettings();
                return reply(`🔍 _AntiDelete Status:_\n\n*DM AntiDelete:* ${currentStatus.dm_status ? '✅ ENABLED' : '❌ DISABLED'}\n*Group Chat AntiDelete:* ${currentStatus.gc_status ? '✅ ENABLED' : '❌ DISABLED'}`);

            default:
                return reply(`-- *AntiDelete Command Guide:* --
• \`.antidelete on\` - ✅ Enable AntiDelete for all chats
• \`.antidelete off gc\` - ❌ Disable AntiDelete for Group Chats
• \`.antidelete off dm\` - ❌ Disable AntiDelete for Direct Messages
• \`.antidelete set gc\` - 🔄 Toggle AntiDelete for Group Chats
• \`.antidelete set dm\` - 🔄 Toggle AntiDelete for Direct Messages
• \`.antidelete set all\` - ✅ Enable AntiDelete for all chats
• \`.antidelete status\` - 🔍 Check current AntiDelete status`);
        }
    } catch (e) {
        console.error("⚠️ Error in antidelete command:", e);
        return reply("❌ An error occurred while processing your request.");
    }
});