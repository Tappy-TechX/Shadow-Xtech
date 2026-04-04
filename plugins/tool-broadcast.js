const { cmd, commands } = require('../command');  
const config = require('../config');  
const prefix = config.PREFIX;  
const fs = require('fs');  
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');  
const { writeFileSync } = require('fs');  
const path = require('path');  
  
cmd({  
  pattern: "broadcast",  
  category: "group",  
  desc: "Bot makes a broadcast in all groups",  
  react: "✔️", 
  filename: __filename,  
  use: "<text for broadcast.>"  
}, async (conn, mek, m, { q, isGroup, isAdmins, reply }) => {  
  try {  
    // ✔️ Loading reaction at start  
    await conn.sendMessage(m.chat, { react: { text: "✔️", key: mek.key } });  
  
    if (!isGroup) {  
      await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });  
      return reply("*🔴 This command can only be used in groups!*");  
    }  
  
    if (!isAdmins) {  
      await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });  
      return reply("*🔴 You need to be an admin to broadcast in this group!*");  
    }  
  
    if (!q) {  
      await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });  
      return reply("*🔴 Provide text to broadcast in all groups!*");  
    }  
  
    let allGroups = await conn.groupFetchAllParticipating();  
    let groupIds = Object.keys(allGroups);  
  
    await reply(`*📢 Sending Broadcast To ${groupIds.length} Groups...*\n*⏳ Estimated Time: ${groupIds.length * 1.5} seconds*`);  
  
    for (let groupId of groupIds) {  
      try {  
        await sleep(1500);  
        await conn.sendMessage(groupId, { text: q });  
      } catch (err) {  
        console.log(`❌ Failed to send broadcast to ${groupId}:`, err);  
      }  
    }  
  
    // ✅ Success reaction  
    await conn.sendMessage(m.chat, { react: { text: "✅", key: mek.key } });  
  
    return reply(`*✅ Successfully sent broadcast to ${groupIds.length} groups!*`);  
      
  } catch (err) {  
    // ❌ Error reaction  
    await conn.sendMessage(m.chat, { react: { text: "❌", key: mek.key } });  
  
    await m.error(`*🔴 Error: ${err}\n\nCommand: broadcast*`, err);  
  }  
});