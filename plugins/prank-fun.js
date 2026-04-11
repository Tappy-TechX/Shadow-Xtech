const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' message for fun.",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, {
    from, senderNumber, reply
}) => {
    try {

        // Owner check
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        const steps = [
            '💻 *HACK STARTING...* 💻',
            '*Initializing hacking tools...* 🛠️',
            '*Connecting to remote servers...* 🌐',

            '*[█░░░░░░░░░] 10%* ⏳',
            '*[██░░░░░░░░] 20%* ⌛',
            '*[███░░░░░░░] 30%* ⏳',
            '*[████░░░░░░] 40%* ⌛',
            '*[█████░░░░░] 50%* ⏳',
            '*[██████░░░░] 60%* ⌛',
            '*[███████░░░] 70%* ⏳',
            '*[████████░░] 80%* ⌛',
            '*[█████████░] 90%* ⏳',
            '*[██████████] 100%* ✅',

            '🔒 *System Breach: Successful!* 🔓',
            '🚀 *Command Execution: Complete!* 🎯',
            '*📡 Transmitting data...* 📤',
            '_*🕵️‍♂️ Ensuring stealth..*._ 🤫',
            '*🔧 Finalizing operations...* 🏁',

            '⚠️ *Note:* Demo only.',
            '⚠️ *Ethical hacking only.*',
            '> *SHADOW-XTECH-HACKING-COMPLETE ☣*'
        ];

        // Send initial message
        let msg = await conn.sendMessage(from, {
            text: steps[0]
        }, { quoted: mek });

        // Edit same message repeatedly
        for (let i = 1; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 1000));

            await conn.sendMessage(from, {
                text: steps[i],
                edit: msg.key
            });
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});