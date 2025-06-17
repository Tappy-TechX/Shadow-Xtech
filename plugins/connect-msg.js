// The new "classical" connection message
cmd({
    pattern: "connectmsg", // You might want a different pattern or integrate this into a 'start' or 'welcome' command
    desc: "Display a classical connection message for Shadow-Xtech.",
    category: "info", // Or 'utility', 'welcome'
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { reply, from, prefix }) => {
    try {
        const classicalMessage = `
*📜 A GRAND ANNOUNCEMENT FROM SHADOW XTECH! 📜*

╭─━━━━━━━━━━━━━━━━━━━━━━━━━━━━─╮
┆ ◦  *Behold, dear user, the arrival of Shadow-Xtech Bot!*
┆ ◦  *An embodiment of Simplicity, Speed, and Unyielding Power.*
┆ ◦  *Crafted with precision by Black-Tappy for your digital dominion.*
┆ ◦  *Prepare to embark on a journey with your quintessential WhatsApp Sidekick!*
╰─━━━━━━━━━━━━━━━━━━━━━━━━━━━━─╯

*It is with immense gratitude that we acknowledge your choice of Shadow-Xtech!*
*May your endeavors be swift and your interactions seamless.*

---
╭───〔 🌐 *PATHWAYS TO KNOWLEDGE AND SUPPORT* 〕───╮
│  *📢 The Grand Forum:*
│     Journey forth to our official channel: [**Embark Here**](https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10)
│
│  *⭐ A Mark of Esteem:*
│     Bestow a star upon our humble creation: [**Grant Star**](https://github.com/Tappy-Black/Shadow-Xtech-V1)
│
│  *🛠️ The Sacred Emblem:*
│     Our recognized command prefix: \`${prefix}\`
╰──────────────────────────────────────────────────╯

> _© A Testament to the Craft of Black-Tappy
        `.trim();

        await conn.sendMessage(from, { text: classicalMessage }, { quoted: mek });

    } catch (error) {
        console.error("Error in connection message command: ", error);
        const errorMessage = `
❌ An unforeseen issue arose while preparing the grand announcement.
🛠 *Error Manifestation*:
${error.message}

Kindly convey this anomaly to our artisans or attempt once more.
        `.trim();
        return reply(errorMessage);
    }
});
