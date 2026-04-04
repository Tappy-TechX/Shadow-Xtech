const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

//------------ remove only members -------------------
cmd({
    pattern: "removemembers",
    alias: ["kickall", "endgc", "endgroup"],
    react: "🎉",
    desc: "Remove all non-admin members from the group.",
    category: "group",
    filename: __filename,
},           
async (conn, mek, m, { from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("*🔴 Only the bot owner can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to execute this command.*");

        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));

        if (nonAdminParticipants.length === 0) return reply("*✔️ There are no non-admin members to remove.*");

        reply(`*♻️ Starting to remove ${nonAdminParticipants.length} non-admin members...*`);

        for (let participant of nonAdminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply("*✔️ Successfully removed all non-admin members from the group.*");
    } catch (e) {
        console.error("Error removing non-admin users:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 An error occurred while trying to remove non-admin members. Please try again.*");
    }
});

//----------------- remove only admins -----------------
cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "endadmins", "deladmins"],
    react: "🎉",
    desc: "Remove all admin members from the group, excluding the bot and bot owner.",
    category: "group",
    filename: __filename,
},           
async (conn, mek, m, { from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("*🔴 Only the bot owner can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to execute this command.*");

        const allParticipants = groupMetadata.participants;
        const adminParticipants = allParticipants.filter(member => groupAdmins.includes(member.id) && member.id !== conn.user.id && member.id !== `${botOwner}@s.whatsapp.net`);

        if (adminParticipants.length === 0) return reply("*✔️ There are no admin members to remove.*");

        reply(`*♻️ Starting to remove ${adminParticipants.length} admin members, excluding the bot and bot owner...*`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply("*✔️ Successfully removed all admin members from the group, excluding the bot and bot owner.*");
    } catch (e) {
        console.error("Error removing admins:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 An error occurred while trying to remove admins. Please try again.*");
    }
});

//---------- remove admins and memeber both -------
cmd({
    pattern: "removeall",
    alias: ["evacuate", "emptygroup", "wipegroup"],
    react: "🎉",
    desc: "Remove all members and admins from the group, excluding the bot and bot owner.",
    category: "group",
    filename: __filename,
},           
async (conn, mek, m, { from, isGroup, senderNumber, groupMetadata, isBotAdmins, reply }) => {
    try {
        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("*🔴 Only the bot owner can use this command.*");
        if (!isBotAdmins) return reply("*🔴 I need to be an admin to execute this command.*");

        const allParticipants = groupMetadata.participants;
        const participantsToRemove = allParticipants.filter(
            participant => participant.id !== conn.user.id && participant.id !== `${botOwner}@s.whatsapp.net`
        );

        if (participantsToRemove.length === 0) return reply("*✔️ No members to remove after excluding the bot and bot owner.*");

        reply(`*♻️ Starting to remove ${participantsToRemove.length} members, excluding the bot and bot owner...*`);

        for (let participant of participantsToRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

        reply("*✔️ Successfully removed all members, excluding the bot and bot owner, from the group.*");
    } catch (e) {
        console.error("Error removing members:", e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply("*🔴 An error occurred while trying to remove members. Please try again.*");
    }
});