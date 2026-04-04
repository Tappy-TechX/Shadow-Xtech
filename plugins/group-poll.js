const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "poll",
  category: "group",
  desc: "Create a poll with a question and options in the group.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, participants, prefix, reply }) => {
  try {
    // ♻️ Loading reaction
    await conn.sendMessage(from, { 
      react: { text: "♻️", key: mek.key } 
    });

    if (!isGroup) return reply("*🔴 This command can only be used in groups.*");

    // Split body into question and options
    let [question, optionsString] = body.split(";");
    if (!question || !optionsString) {
      return reply(`*🔴 Usage:* ${prefix}poll question;option1,option2,option3...`);
    }

    let options = optionsString.split(",").map(o => o.trim()).filter(Boolean);
    if (options.length < 2) {
      return reply("*🔴 Please provide at least two options for the poll.*");
    }

    // 📡 Send poll
    await conn.sendMessage(from, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1,
        toAnnouncementGroup: true,
      }
    }, { quoted: mek });

    // ✅ Success reaction
    await conn.sendMessage(from, { 
      react: { text: "✅", key: mek.key } 
    });

    reply("*✔️ Poll created successfully!*");

  } catch (e) {
    console.error("Poll command error:", e);

    // ❌ Error reaction
    await conn.sendMessage(from, { 
      react: { text: "❌", key: mek.key } 
    });

    reply(`*🔴 An error occurred while creating the poll.*\n_Error:_ ${e.message}`);
  }
});