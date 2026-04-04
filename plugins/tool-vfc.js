const fs = require('fs');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: 'savecontact',
    alias: ["vcf","scontact","savecontacts"],
    desc: 'Save active contacts with readable usernames',
    category: 'tools',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isOwner, reply, groupMetadata }) => {
    try {
        if (!isGroup) return reply("*_📛 This command is for groups only._*");
        if (!isOwner) return reply("*_📛 This command is for the owner only_*");

        const participants = groupMetadata.participants;
        let vcard = '';
        let index = 1;
        let validContacts = 0;

        for (let participant of participants) {
            const number = participant.id.split("@")[0];
            
            // Check if number is a valid WhatsApp account
            const isActive = await conn.isOnWhatsApp(number + "@s.whatsapp.net").catch(() => false);
            if (!isActive) continue;

            validContacts++;
            const name = participant.notify || participant.name || number; 
            vcard += 
`BEGIN:VCARD
VERSION:3.0
FN:[${index++}] ${name} (${number})
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD
`;
        }

        if (validContacts === 0) return reply("*👤 No active WhatsApp contacts found in this group.*");

        const filename = './contacts.vcf';
        reply(`*📂 Saving ${validContacts} active WhatsApp contacts...*`);

        fs.writeFileSync(filename, vcard.trim());
        await sleep(2000);

        await conn.sendMessage(from, {
            document: fs.readFileSync(filename),
            mimetype: 'text/vcard',
            fileName: 'Shadow-Xtech.vcf',
            caption: `*✔️ Done saving.*\n👥 *Group Name:* *${groupMetadata.subject}*\n*🟢 Active Contacts:* *${validContacts}*\n> *© Powered by Shadow-Xtech*`
        }, { quoted: mek });

        fs.unlinkSync(filename); // Cleanup
    } catch (err) {
        reply(err.toString());
    }
});