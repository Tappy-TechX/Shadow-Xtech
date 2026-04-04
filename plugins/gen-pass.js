const crypto = require("crypto");
const { cmd } = require("../command");

cmd({
  pattern: "gpass",
  desc: "Generate a strong password.",
  category: "other",
  react: '🔐',
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  try {
    // ♻️ Loading reaction
    await conn.sendMessage(from, {
      react: { text: "♻️", key: m.key }
    });

    // Password length (default 12)
    const passwordLength = args[0] ? parseInt(args[0]) : 12;

    // Validate length
    if (isNaN(passwordLength) || passwordLength < 8) {
      // ❌ Error reaction
      await conn.sendMessage(from, {
        react: { text: "❌", key: m.key }
      });
      return reply("*🔴 Please provide a valid length for the password (Minimum 8 Characters).*");
    }

    // Password generator
    const generatePassword = (length) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        password += chars[randomIndex];
      }
      return password;
    };

    // Generate password
    const generatedPassword = generatePassword(passwordLength);

    // ✅ Success reaction
    await conn.sendMessage(from, {
      react: { text: "✅", key: m.key }
    });

    // Send password
    await conn.sendMessage(from, {
      text: `🔐 *Your Strong Password* 🔐\n\n${generatedPassword}\n\n> © *Powered By Shadow-Xtech🔒*`
    }, {
      quoted: quoted
    });

  } catch (error) {
    console.error(error);

    // ❌ Error reaction
    await conn.sendMessage(from, {
      react: { text: "❌", key: m.key }
    });

    reply(`*🔴 Error generating password: ${error.message}*`);
  }
});