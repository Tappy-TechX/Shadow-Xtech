const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' message for fun.",
    category: "fun",
    filename: __filename,
    react: "📀"
},
async (conn, mek, m, {
    from, senderNumber, reply
}) => {
    try {

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

        // 📀 Initial reaction (command trigger)
        await conn.sendMessage(from, {
            react: { text: "🛜", key: mek.key }
        });

        // ⏳ Loading reaction  
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

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

        // ✅ Success reaction  
        await conn.sendMessage(from, {
            react: { text: "💿", key: mek.key }
        });

    } catch (e) {
        console.error(e);

        // ❌ Error reaction  
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply(`❌ *Error:* ${e.message}`);
    }
});