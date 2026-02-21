const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');
const config = require('../config');

initializeAntiDeleteSettings();

// Quoted contact for replies
const quotedContact = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "⚙️ AntiDelete | Control 🚀",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:${config.botname || "SHADOW-XTECH"}
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=${config.owner || "254700000001"}:+${config.owner || "254700000001"}
END:VCARD`
        }
    }
};

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Sets up the Antidelete feature.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { reply, q, isCreator, from, sender }) => {

    if (!isCreator)
        return reply('⚠️ This command is only for the bot owner.', quotedContact);

    try {
        const command = q?.toLowerCase();

        switch (command) {

            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('✅ AntiDelete ENABLED for all chats.', quotedContact);

            case 'off':
                await setAnti('gc', false);
                await setAnti('dm', false);
                return reply('❌ AntiDelete DISABLED for all chats.', quotedContact);

            case 'gc on':
                await setAnti('gc', true);
                return reply('✅ AntiDelete enabled for Group Chats.', quotedContact);

            case 'gc off':
                await setAnti('gc', false);
                return reply('❌ AntiDelete disabled for Group Chats.', quotedContact);

            case 'dm on':
                await setAnti('dm', true);
                return reply('✅ AntiDelete enabled for Direct Messages.', quotedContact);

            case 'dm off':
                await setAnti('dm', false);
                return reply('❌ AntiDelete disabled for Direct Messages.', quotedContact);

            case 'status':
                const dm = await getAnti('dm');
                const gc = await getAnti('gc');

                return reply(
`🔍 AntiDelete Status

DM: ${dm ? '✅ ENABLED' : '❌ DISABLED'}
GC: ${gc ? '✅ ENABLED' : '❌ DISABLED'}`, quotedContact
                );

            default:
                return reply(
`AntiDelete Command Guide:

.antidelete on
.antidelete off
.antidelete gc on
.antidelete gc off
.antidelete dm on
.antidelete dm off
.antidelete status`, quotedContact
                );
        }

    } catch (e) {
        console.error("Error in antidelete command:", e);
        reply("❌ An error occurred.", quotedContact);
    }
});