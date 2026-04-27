const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

// === AI Chatbot Event Handler ===
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    // Only reply if AI is ON, it's NOT a command, NOT a group, and NOT from the bot itself
    if (config.AUTO_AI === "true" && !isCmd && !isGroup && !message.key.fromMe && body) {
      
      // Realistic "typing..." presence
      await client.sendPresenceUpdate('composing', from);

      // Fetch response from Yupra AI Copilot API
      const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(body)}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const data = await response.json();

      if (data.status && data.result) {
        const aiReply = data.result;

        // Send clean, natural reply
        await client.sendMessage(from, {
          text: aiReply
        }, { quoted: message });
      } else {
        await client.sendMessage(from, { text: "⚠️ AI API did not return a result. Try again later." }, { quoted: message });
      }
    }
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    await client.sendMessage(from, { text: `⚠️ Chatbot error: ${error.message}` }, { quoted: message });
  }
});

// === Chatbot Toggle Command ===
cmd({
  pattern: "chatbot",
  alias: ["autoai", "aichat"],
  desc: "Toggle Auto AI Chatbot feature",
  category: "owner",
  react: "🤖",
  filename: __filename,
  fromMe: true
},
async (client, message, m, { isOwner, from, args }) => {
  try {
    if (!isOwner) return client.sendMessage(from, { text: "🚫 *Owner-only command!*" }, { quoted: message });

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🤖", additionalInfo = "";

    switch (action) {
      case 'on':
        if (config.AUTO_AI === "true") {
          statusText = "📌 AI Chatbot is already *ENABLED*!";
          reaction = "ℹ️";
        } else {
          config.AUTO_AI = "true";
          statusText = "✅ AI Chatbot has been *ENABLED*!";
          reaction = "✅";
          additionalInfo = "I will now reply to all private messages 💬";
        }
        break;

      case 'off':
        if (config.AUTO_AI === "false") {
          statusText = "📌 AI Chatbot is already *DISABLED*!";
          reaction = "ℹ️";
        } else {
          config.AUTO_AI = "false";
          statusText = "❌ AI Chatbot has been *DISABLED*!";
          reaction = "❌";
          additionalInfo = "Auto-replies are now turned off 🔇";
        }
        break;

      default:
        statusText = `📌 Chatbot Status: ${config.AUTO_AI === "true" ? "✅ *ENABLED*" : "❌ *DISABLED*"}`;
        additionalInfo = config.AUTO_AI === "true" ? "Ready to chat 🤖" : "Standing by 💤";
        break;
    }

    // Send simple text status message
    await client.sendMessage(from, {
      text: `${statusText}\n${additionalInfo}`
    }, { quoted: message });

    // React to original command
    await client.sendMessage(from, { react: { text: reaction, key: message.key } });

  } catch (error) {
    console.error("❌ Chatbot command error:", error);
    await client.sendMessage(from, { text: `⚠️ Error: ${error.message}` }, { quoted: message });
  }
});
