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

    await conn.sendMessage(from, {
      react: { text: "🎨", key: mek.key }
    });

    const input = (q || "").toLowerCase();

    // ─────────────────────────────
    // SHOW FONT LIST
    // ─────────────────────────────
    if (!input || input === "list") {
      let list = Object.keys(FONT_MAPS)
        .map(f => `• ${f}`)
        .join("\n");

      return reply(
        `🎨 *Available Fonts:*\n\n${list}\n\n` +
        `🟢 Use:\n.font bold\n.font script\n.font on\n.font off`
      );
    }

    // ─────────────────────────────
    // TURN ON FONT SYSTEM
    // ─────────────────────────────
    if (input === "on") {
      config.AUTO_FONT = "gothic";

      return reply(
        "🟢 Font system *ENABLED*\n" +
        "Default font set to *gothic*"
      );
    }

    // ─────────────────────────────
    // TURN OFF FONT SYSTEM
    // ─────────────────────────────
    if (input === "off") {
      config.AUTO_FONT = "off";

      return reply(
        "🔴 Font system *DISABLED*\n" +
        "Back to normal text mode"
      );
    }

    // ─────────────────────────────
    // VALIDATE FONT STYLE
    // ─────────────────────────────
    if (!FONT_MAPS[input]) {
      await conn.sendMessage(from, {
        react: { text: "❌", key: mek.key }
      });

      return reply("❌ Invalid font style. Use .font list");
    }

    // ─────────────────────────────
    // SET FONT
    // ─────────────────────────────
    config.AUTO_FONT = input;

    await conn.sendMessage(from, {
      react: { text: "✅", key: mek.key }
    });

    return reply(
      `✅ Font changed to *${input}*\n` +
      `🧠 Current mode: ${config.AUTO_FONT}`
    );
  }
);