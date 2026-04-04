const { cmd, commands } = require('../command');  
const config = require('../config');  
const prefix = config.PREFIX;  
const fs = require('fs');  
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');  
const { writeFileSync } = require('fs');  
const path = require('path');  
  
cmd({  
  pattern: "newgc",  
  react: "🌐",           
  category: "group",  
  desc: "Create a new group and add participants.",  
  filename: __filename,  
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, reply }) => {  
  try {  
    // ♻️ Loading reaction  
    await conn.sendMessage(from, {   
      react: { text: "♻️", key: mek.key }   
    });  
  
    if (!body) {  
      return reply(`*🔴 Usage:* !newgc group_name;number1,number2,...`);  
    }  
  
    const [groupName, numbersString] = body.split(";");  
      
    if (!groupName || !numbersString) {  
      return reply(`*🔴 Usage:* !newgc group_name;number1,number2,...`);  
    }  
  
    const participantNumbers = numbersString.split(",").map(number => `${number.trim()}@s.whatsapp.net`);  
  
    const group = await conn.groupCreate(groupName, participantNumbers);  
    console.log('Created group with id: ' + group.id);  
  
    const inviteLink = await conn.groupInviteCode(group.id);  
  
    await conn.sendMessage(group.id, { text: 'Hello there!' });  
  
    // ✅ Success reaction  
    await conn.sendMessage(from, {   
      react: { text: "✅", key: mek.key }   
    });  
  
    reply(`*✔️ Group created successfully!*\n🌐 Invite link: https://chat.whatsapp.com/${inviteLink}\n📨 Welcome message sent.`);  
  
  } catch (e) {  
    console.error("NewGC command error:", e);  
  
    // ❌ Error reaction  
    await conn.sendMessage(from, {   
      react: { text: "❌", key: mek.key }   
    });  
  
    reply(`*🔴 An error occurred while creating the group.*\n_Error:_ ${e.message}`);  
  }  
});