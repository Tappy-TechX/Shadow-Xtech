const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("*❌ Failed to fetch a joke. Please try again.*");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *© Powered by Shadow-Xtech*`;

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("*⚠️ An error occurred while fetching the joke. Please try again.*");
  }
});

// flirt

cmd({
  pattern: "flirt",
  desc: "Send a random flirt message 💘",
  category: "fun",
  react: "😘",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    // Fetch flirt message from API
    const res = await axios.get("https://api.popcat.xyz/flirt");
    const flirt = res.data.flirt;

    // Send message with footer
    await conn.sendMessage(from, {
      text: `💘 *Flirt Message*\n\n${flirt}\n\n> *© Powered by Shadow-Xtech*`
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply("*Sorry, something went wrong while fetching the truth question. Please try again later.*");
  }
});

//truth

cmd({
    pattern: "truth",
    alias: ["truthquestion"],
    desc: "Get a random truth question from the API.",
    react: "🔥",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        const truthText = `${json.result}`;
        await conn.sendMessage(from, { 
            text: truthText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in truth command:", error);
        reply("*Sorry, something went wrong while fetching the truth question. Please try again later.*");
    }
});

// dare

cmd({
    pattern: "dare",
    alias: ["truthordare"],
    desc: "Get a random dare from the API.",
    react: "❄️",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // API Key
        const shizokeys = 'shizo';

        // Fetch dare text from the API
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        // Format the dare message
        const dareText = `${json.result}`;

        // Send the dare to the chat
        await conn.sendMessage(from, { 
            text: dareText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in dare command:", error);
        reply("*Sorry, something went wrong while fetching the dare. Please try again later.*");
    }
});

cmd({
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  react: "💮",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = response.data.text;

    if (!fact) {
      return reply("*❌ Failed to fetch a fun fact. Please try again.*");
    }

    const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> *© Powered by Shadow-Xtech*`;

    return reply(factMessage);
  } catch (error) {
    console.error("❌ Error in fact command:", error);
    return reply("*⚠️ An error occurred while fetching a fun fact. Please try again later.*");
  }
});

cmd({
    pattern: "pickupline",
    alias: ["pickup"],
    desc: "Get a random pickup line from the API.",
    react: "💬",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch pickup line from the API
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        // Log the API response (for debugging purposes)
        console.log('JSON response:', json);

        // Format the pickup line message
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *© Powered By Shadow-Xtech*`;

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("*Sorry, something went wrong while fetching the pickup line. Please try again later.*");
    }
});

// character 

cmd({
    pattern: "character",
    alias: ["char"],
    desc: "Check the character of a user.",
    react: "🔥",
    category: "fun",
    filename: __filename,
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) {
            return reply("*🔴 This command works only in groups!*");
        }

        // Get mentioned or replied user
        const mentionedUser =
            m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
            m.quoted?.sender;

        if (!mentionedUser) {
            return reply("*⚠️ Tag or reply to someone to check their character!*");
        }

        // Character traits list
        const traits = [
            "Sigma 🐺",
            "Generous 💖",
            "Grumpy 😒",
            "Overconfident 😎",
            "Obedient 🙇",
            "Good 😇",
            "Simp 🥺",
            "Kind 😊",
            "Patient 🧘",
            "Pervert 😏",
            "Cool 🧊",
            "Helpful 🤝",
            "Brilliant 🧠",
            "Hot 🔥",
            "Gorgeous 💎",
            "Cute 🐣"
        ];

        // Random selection
        const trait = traits[Math.floor(Math.random() * traits.length)];
        const percentage = Math.floor(Math.random() * 100) + 1;

        // Message style upgrade
        const message = `
⚡ *CHARACTER SCAN* ⚡

👤 *User: @${mentionedUser.split("@")[0]}*
🔥 *Trait: ${trait}*
📊 *XP: ${percentage}%*

⚡ *Scan Complete* ⚡
        `.trim();

        await conn.sendMessage(
            from,
            {
                text: message,
                mentions: [mentionedUser],
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("Character Command Error:", e);
        reply("*❌ Something went wrong. Try again later.*");
    }
});

cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Repeat a message a specified number of times.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("*📌 Use this command for Example: .repeat 10,I love you*");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 300) {
      return reply("*📌 Please specify a valid number between 1 and 300.*");
    }

    if (!message) {
      return reply("*📌 Please provide a message to repeat.*");
    }

    const repeatedMessage = Array(count).fill(message).join("\n");

    reply(`🔄 Repeated ${count} times:\n\n${repeatedMessage}`);
  } catch (error) {
    console.error("❌ Error in repeat command:", error);
    reply("*🔴 An error occurred while processing your request.*");
  }
});

cmd({
  pattern: "send",
  desc: "Send a message multiple times, one by one.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply, senderNumber }) => {
  try {
    const botOwner = conn.user.id.split(":")[0]; // Get bot owner's number

    if (senderNumber !== botOwner) {
      return reply("*📌 Only the bot owner can use this command.*");
    }

    if (!args[0]) {
      return reply("*📌 Use this command for Example: . send 10,I love you*");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 100) {
      return reply("*📌 Please specify a valid number between 1 and 100.*");
    }

    if (!message) {
      return reply("*📌 Please provide a message to send.");
    }

    reply(`*⏳ Sending "${message}" ${count} times. This may take a while...*`);

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(m.from, { text: message }, { quoted: m });
      await sleep(1000); // 1-second delay
    }

    reply(`*✅ Successfully sent the message ${count} times.*`);
  } catch (error) {
    console.error("❌ Error in ask command:", error);
    reply("*🔴 An error occurred while processing your request.*");
  }
});

cmd({
  pattern: "readmore",
  desc: "Create a read more message",
  category: "tools",
  react: "📖",
  filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!args.length) {
      return reply("*📌 Please provide text*\n\n*Example: .readmore Hello | Hidden text*");
    }

    // Split text using |
    const text = args.join(" ").split("|");
    if (text.length < 2) {
      return reply("*❌ Use format: text | hidden text*");
    }

    const visible = text[0].trim();
    const hidden = text[1].trim();

    // Invisible characters to trigger "Read More"
    const readMore = String.fromCharCode(8206).repeat(4000);

    const message = `${visible}${readMore}${hidden}`;

    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply("*❌ Error creating read more message*");
  }
});