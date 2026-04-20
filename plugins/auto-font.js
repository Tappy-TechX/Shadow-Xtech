const { cmd } = require("../command");
const config = require("../config");
const { FONT_MAPS } = require("../lib/font");

cmd(
  {
    pattern: "font",
    desc: "Change bot font style",
    category: "settings",
    react: "🎨",
    filename: __filename
  },
  async (conn, mek, m, { from, q, reply }) => {

    // reaction
    await conn.sendMessage(from, {
      react: { text: "🎨", key: mek.key }
    });

    // no input
    if (!q) {
      let list = Object.keys(FONT_MAPS)
        .map(f => `• ${f}`)
        .join("\n");

      return reply(
        `🎨 *Font Styles Available:*\n\n${list}\n\nUse:\n.font bold`
      );
    }

    const style = q.toLowerCase();

    if (!FONT_MAPS[style] && style !== "off") {
      await conn.sendMessage(from, {
        react: { text: "❌", key: mek.key }
      });
      return reply("❌ Invalid font style");
    }

    // 🔥 IMPORTANT FIX (persistent runtime change)
    config.AUTO_FONT = style;

    await conn.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });

    return reply(`✅ Font changed to *${style}*`);
  }
);
