const { cmd } = require("../command");
const config = require('../config');

cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate the compatibility score between two users.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 2) {
      return reply("Please mention two users to calculate compatibility.\nUsage: `.compatibility @user1 @user2`");
    }

    let user1 = m.mentionedJid[0]; 
    let user2 = m.mentionedJid[1]; 

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random compatibility score (between 1 to 1000)
    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

    // Check if one of the mentioned users is the special number
    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000; // Special case for DEV number
      return reply(`💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}+/1000 💖`);
    }

    // Send the compatibility message
    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}/1000 💖`,
      mentions: [user1, user2],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

  cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 1) {
      return reply("Please mention a user to calculate their aura.\nUsage: `.aura @user`");
    }

    let user = m.mentionedJid[0]; 
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random aura score (between 1 to 1000)
    let auraScore = Math.floor(Math.random() * 1000) + 1;

    // Check if the mentioned user is the special number
    if (user === specialNumber) {
      auraScore = 999999; // Special case for DEV number
      return reply(`💀 Aura of @${user.split('@')[0]}: ${auraScore}+ 🗿`);
    }

    // Send the aura message
    await conn.sendMessage(mek.chat, {
      text: `💀 Aura of @${user.split('@')[0]}: ${auraScore}/1000 🗿`,
      mentions: [user],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

cmd({
    pattern: "roast",
    desc: "Roast someone in Hindi",
    category: "fun",
    react: "🔥",
    filename: __filename,
    use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
    let roasts = [
        "You're not stupid; you just have bad luck thinking.", "You're like a cloud. When you disappear, it’s a beautiful day.", "You have something on your chin... no, the third one down.", "You're the reason the gene pool needs a lifeguard.", "You bring everyone so much joy… when you leave the room.", "You're not the dumbest person alive, but you better hope they don't die.", "Your secrets are always safe with me. I never even listen when you tell me them.", "You have something on your face: stupidity.", "You're proof even evolution takes a break sometimes.", "You're like a software update. Whenever I see you, I think, 'Not now.'", "Your face makes onions cry.", "You're so fake, Barbie is jealous.", "You have something stuck between your teeth… like your foot.", "You're not ugly. You're just… aesthetically challenged.", "If I had a dollar for every smart thing you said, I’d be broke.", "You're as useless as the 'g' in lasagna.", "You're like a light switch — always getting turned off.", "You're as sharp as a marble.", "You're the human version of a participation award.", "You're about as useful as a screen door on a submarine.", "You're like a cloud of toxic gas — everyone avoids you.", "You’re the reason shampoo bottles have instructions.", "You're the type of person who'd trip over a wireless connection.", "You're the human equivalent of a typo.", "You have something no one else does — absolutely no talent.", "You're as welcome as a pop-up ad.", "You're like a broken pencil — pointless.", "You are proof that even evolution can go in reverse.", "You bring everyone together… in a group chat complaining about you.", "You're not completely useless — you can still serve as a bad example.", "You're like a phone with no signal — lost and useless.", "You're like a selfie stick at a funeral — just wrong.", "You talk like you have a limited data plan for intelligence.", "You're so slow, it’s like buffering in real life.", "You're the human version of a blue screen error.", "You're the kind of person who claps when the plane lands.", "You're like a math book — full of problems.", "Your brain is on airplane mode.", "You're like expired milk — no one wants you, and you stink.", "You're like Wi-Fi at a festival — unreliable and annoying.", "You're like a door without a handle — hard to deal with and useless.", "You're not even bad… you're just unnecessary.", "You're like if lag was a person.", "You're the plot twist no one asked for.", "You're the loading screen of my life.", "You’re like an unskippable ad — annoying and pointless.", "You're the kind of person autocorrect gives up on.", "You’re the reason group projects fail.", "You have something computers don’t — bugs in your brain.", "You're like a Chrome tab — always slowing things down.", "You're like a song stuck on repeat — annoying and never-ending.", "You're more disappointing than a sequel.", "You're as confusing as a TikTok trend.", "You're the lag in every game.", "You're like a soft drink with no fizz — flat and useless.", "You bring nothing to the table but crumbs.", "You're the NPC everyone skips talking to.", "You’re like a pop quiz — unwanted and unprepared.", "You're like an online exam — stressful and full of errors.", "You're not a vibe, you're a virus.", "You're the background noise of life.", "You’re like an update no one wanted — buggy and unnecessary.", "You're the reason earphones have left and right labels.", "You're like a TikTok ad — nobody likes you but you still show up.", "You're the captcha nobody solves.", "You're the lag that ruins the game.", "You're as broken as Internet Explorer.", "You're like an uncharged phone — dead and useless.", "You're like a forgotten password — always in the way.", "You're the kind of error that crashes systems.", "You have the personality of a buffering wheel.", "You're like a group chat on mute — nobody wants to hear from you.", "You're the part of the code that causes bugs.", "You're the reason we need a debug mode for life.", "You're like a leaked password — exposed and irrelevant.", "You’re the error 404 of personalities.", "You're more confusing than a JavaScript callback.", "You're like an incognito tab — here, but useless.", "You're like a selfie taken in the dark — pointless.", "You're the reboot no one asked for.", "You're the kind of person who would unplug a wireless router.", "You're as outdated as Flash Player.", "You belong in the recycle bin.", "You're the kind of file that always gets corrupted.", "You're like a system update that never finishes.", "You're the lag in the livestream.", "You're as invisible as a shadow in the dark.", "You're like an MP3 player in 2025 — unnecessary.", "You're like a voice note from a stranger — ignored and deleted.", "You're the reason we need airplane mode in life.", "You're as awkward as a silent Zoom call.", "You crash harder than my code on the first run.", "You're like a spam email — instantly discarded.", "You're the kind of friend people mute.", "You couldn't pour water out of a boot with instructions on the heel.", "You're like CTRL + ALT + DEL — only useful when something's wrong.", "You're like a screenshot of a blank screen — useless.", "You're the tab I always close first.", "You're the offline mode of conversation.", "You're like a Terms of Service agreement — no one reads or respects you.", "You're the default ringtone of life — annoying and forgettable.", "You have the appeal of a failed captcha.", "You're the bug in my otherwise perfect script.", "You're like a forgotten password — frustrating and useless.", "You're the spam in my inbox.", "You're like Java — nobody really likes dealing with you.", "You're the kind of echo nobody listens to.", "You're a full stop in the sentence of progress.", "You're like a pop-up blocker for productivity.", "You're the cooldown period in life’s game — slowing everyone down.", "You're the typo in every perfect sentence.", "You're as slow as dial-up internet.", "You're like a downloaded PDF that won’t open.", "You're like a random reboot — inconvenient and disruptive.", "You're the bad Wi-Fi signal of social life.", "You're the 'skip intro' button of friendship.", "You're more extra than RAM in a toaster.", "You're the wrong answer on a multiple-choice test.", "You're like an old meme — out of touch and embarrassing.", "You're the static on the radio of life.", "You're the crash log of my peace.", "You're the settings nobody customizes.", "You're like a fax machine in 2025 — irrelevant.", "You're like a deep-fried meme — overdone and unwanted.", "You're as useful as a read receipt in ghosting.", "You're the Discord ping at 3AM.", "You're like a 'next episode' autoplay with no story.", "You're the unfunny guy who thinks he's the group clown.", "You're the lag spike in real life.", "You're like that one friend who doesn’t bring food to the party.", "You're like a Google search with no results.", "You're as predictable as a TikTok dance.", "You're the 'skip ad' button that doesn't work.", "You're the USB plug that never fits on the first try.", "You're like a cracked screen — annoying and hard to ignore.", "You're a power outage at a LAN party.", "You're the error message no one understands.", "You're the last pick in dodgeball — and it shows.", "You're the left sock that’s always missing.", "You're the reason I check 'mute notifications' twice.", "You're the loud sneeze in a silent classroom.", "You're a failed simulation.", "You're not even a glitch in the matrix — just a bug in beta."
];               
        
    let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

    if (!mentionedUser) {
        return reply("Usage: .roast @user (Tag someone to roast them!)");
    }

    let target = `@${mentionedUser.split("@")[0]}`;
    
    // Sending the roast message with the mentioned user
    let message = `${target} :\n *${randomRoast}*\n> This is all for fun, don't take it seriously!`;
    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser] }, { quoted: mek });
});

cmd({
    pattern: "8ball",
    desc: "Magic 8-Ball gives answers",
    category: "fun",
    react: "🎱",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Ask a yes/no question! Example: .8ball Will I be rich?");
    
    let responses = [
        "Yes!", "No.", "Maybe...", "Definitely!", "Not sure.", 
        "Ask again later.", "I don't think so.", "Absolutely!", 
        "No way!", "Looks promising!"
    ];
    
    let answer = responses[Math.floor(Math.random() * responses.length)];
    
    reply(`🎱 *Magic 8-Ball says:* ${answer}`);
});

cmd({
    pattern: "compliment",
    desc: "Give a nice compliment",
    category: "fun",
    react: "😊",
    filename: __filename,
    use: "@tag (optional)"
}, async (conn, mek, m, { reply }) => {
    let compliments = [
        "You're amazing just the way you are! 💖",
        "You light up every room you walk into! 🌟",
        "Your smile is contagious! 😊",
        "You're a genius in your own way! 🧠",
        "You bring happiness to everyone around you! 🥰",
        "You're like a human sunshine! ☀️",
        "Your kindness makes the world a better place! ❤️",
        "You're unique and irreplaceable! ✨",
        "You're a great listener and a wonderful friend! 🤗",
        "Your positive vibes are truly inspiring! 💫",
        "You're stronger than you think! 💪",
        "Your creativity is beyond amazing! 🎨",
        "You make life more fun and interesting! 🎉",
        "Your energy is uplifting to everyone around you! 🔥",
        "You're a true leader, even if you don’t realize it! 🏆",
        "Your words have the power to make people smile! 😊",
        "You're so talented, and the world needs your skills! 🎭",
        "You're a walking masterpiece of awesomeness! 🎨",
        "You're proof that kindness still exists in the world! 💕",
        "You make even the hardest days feel a little brighter! ☀️"
    ];

    let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
    let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

    let message = mentionedUser 
        ? `${sender} complimented ${target}:\n😊 *${randomCompliment}*`
        : `${sender}, you forgot to tag someone! But hey, here's a compliment for you:\n😊 *${randomCompliment}*`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
});

cmd({
    pattern: "lovetest",
    desc: "Check love compatibility between two users",
    category: "fun",
    react: "❤️",
    filename: __filename,
    use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
    if (args.length < 2) return reply("Tag two users! Example: .lovetest @user1 @user2");

    let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
    let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

    let lovePercent = Math.floor(Math.random() * 100) + 1; // Generates a number between 1-100

    let messages = [
        { range: [90, 100], text: "💖 *A match made in heaven!* True love exists!" },
        { range: [75, 89], text: "😍 *Strong connection!* This love is deep and meaningful." },
        { range: [50, 74], text: "😊 *Good compatibility!* You both can make it work." },
        { range: [30, 49], text: "🤔 *It’s complicated!* Needs effort, but possible!" },
        { range: [10, 29], text: "😅 *Not the best match!* Maybe try being just friends?" },
        { range: [1, 9], text: "💔 *Uh-oh!* This love is as real as a Bollywood breakup!" }
    ];

    let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

    let message = `💘 *Love Compatibility Test* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
}); 

cmd(
    {
        pattern: "emoji",
        desc: "Convert text into emoji form.",
        category: "fun",
        react: "🙂",
        filename: __filename,
        use: "<text>"
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            // Join the words together in case the user enters multiple words
            let text = args.join(" ");
            
            // Map text to corresponding emoji characters
            let emojiMapping = {
                "a": "🅰️",
                "b": "🅱️",
                "c": "🇨️",
                "d": "🇩️",
                "e": "🇪️",
                "f": "🇫️",
                "g": "🇬️",
                "h": "🇭️",
                "i": "🇮️",
                "j": "🇯️",
                "k": "🇰️",
                "l": "🇱️",
                "m": "🇲️",
                "n": "🇳️",
                "o": "🅾️",
                "p": "🇵️",
                "q": "🇶️",
                "r": "🇷️",
                "s": "🇸️",
                "t": "🇹️",
                "u": "🇺️",
                "v": "🇻️",
                "w": "🇼️",
                "x": "🇽️",
                "y": "🇾️",
                "z": "🇿️",
                "0": "0️⃣",
                "1": "1️⃣",
                "2": "2️⃣",
                "3": "3️⃣",
                "4": "4️⃣",
                "5": "5️⃣",
                "6": "6️⃣",
                "7": "7️⃣",
                "8": "8️⃣",
                "9": "9️⃣",
                " ": "␣", // for space
            };

            // Convert the input text into emoji form
            let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

            // If no valid text is provided
            if (!text) {
                return reply("Please provide some text to convert into emojis!");
            }

            await conn.sendMessage(mek.chat, {
                text: emojiText,
            }, { quoted: mek });

        } catch (error) {
            console.log(error);
            reply(`Error: ${error.message}`);
        }
    }
);
