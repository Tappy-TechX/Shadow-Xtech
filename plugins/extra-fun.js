const { cmd } = require("../command");
const config = require('../config');

cmd({
    pattern: "tod",
    desc: "Truth or Dare game using API! 🎲",
    category: "fun",
    react: "🎲",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❗ Please type `truth` or `dare`!\nExample: .tod truth");

    let userChoice = q.toLowerCase();
    if (userChoice !== "truth" && userChoice !== "dare") {
        return reply("❌ Invalid choice! Use `truth` or `dare`.");
    }

    try {
        // API endpoint
        let url = `https://api.truthordare.online/api/${userChoice}`;

        // Fetch from API
        let res = await fetch(url);
        let data = await res.json();

        // The API returns the prompt in data.question
        let prompt = data.question || "Hmm... no prompt found! Try again.";

        reply(`🎲 *${userChoice.toUpperCase()} for ${m.pushName || "Friend"}:*\n🙂 ${prompt}`);
    } catch (err) {
        console.error(err);
        reply("⚠️ Oops! Something went wrong fetching the prompt. Try again later.");
    }
});
//------------------------------------------------------
cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, { args, reply }) => {
  try {
    if (args.length < 1 || !mek.mentionedJid || mek.mentionedJid.length === 0) {
      return reply("*_🐦 Please mention a user to calculate their aura._*\n*_🧩 Usage: `.aura @user`_*");
    }

    let user = mek.mentionedJid[0];
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Special case for DEV
    if (user === specialNumber) {
      return reply(`──────────────────
• *👤 User: @${user.split("@")[0]}*
• *💀 Score: 999999+ 🗿*
• *📊 Progress: ██████████ 100%*
──────────────────`);
    }

    // Generate random aura score (1 - 1000)
    let auraScore = Math.floor(Math.random() * 1000) + 1;
    let percentage = Math.floor((auraScore / 1000) * 100);
    const totalBars = 10; // 10 blocks, each = 10%

    // Calculate how many bars should be filled
    let filledBarsTarget = Math.floor(percentage / 10); // e.g., 60% → 6 bars

    // Send initial message with 0 bars
    let sentMsg = await conn.sendMessage(mek.chat, {
      text: `──────────────────
• *👤 User: @${user.split("@")[0]}*
• *💀 Score: ${auraScore}/1000*
• *📊 Progress: ${"░".repeat(totalBars)} 0%*
──────────────────`,
      mentions: [user]
    }, { quoted: mek });

    // Animate bars step by step
    for (let i = 1; i <= filledBarsTarget; i++) {
      let progressBar = "█".repeat(i) + "░".repeat(totalBars - i);
      let currentPercent = i * 10;

      // Edit the message
      await conn.sendMessage(mek.chat, {
        text: `──────────────────
• *👤 User: @${user.split("@")[0]}*
• *💀 Score: ${auraScore}/1000*
• *📊 Progress: ${progressBar} ${currentPercent}%*
──────────────────`,
        mentions: [user]
      }, { quoted: sentMsg });

      // Delay between each bar fill
      await new Promise(resolve => setTimeout(resolve, 400)); // 400ms per bar
    }

  } catch (error) {
    console.log(error);
    reply(`*_🔴 Error: ${error.message}_*`);
  }
});

//------------------------------------------------------  
cmd({
    pattern: "roast",
    desc: "Roast someone",
    category: "fun",
    react: "🔥",
    filename: __filename,
    use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
    let roasts = [  
    "You're not stupid; you just have bad luck thinking 🤯",  
    "You're like a cloud ☁️. When you disappear, it’s a beautiful day 🌞",  
    "You have something on your chin... no, the third one down 😬",  
    "You're the reason the gene pool needs a lifeguard 🏊‍♂️",  
    "You bring everyone so much joy… when you leave the room 😂",  
    "You're not the dumbest person alive, but you better hope they don't die 😅",  
    "Your secrets are always safe with me 🤐. I never even listen when you tell me them",  
    "You have something on your face: stupidity 🤦‍♂️",  
    "You're proof even evolution takes a break sometimes 🐒",  
    "You're like a software update 💻. Whenever I see you, I think, 'Not now ⏳.'",  
    "Your face makes onions cry 🧅",  
    "You're so fake, Barbie is jealous 🪆",  
    "You have something stuck between your teeth… like your foot 🦶",  
    "You're not ugly. You're just… aesthetically challenged 🎨",  
    "If I had a dollar 💵 for every smart thing you said, I’d be broke 😏",  
    "You're as useless as the 'g' in lasagna 🍝",  
    "You're like a light switch — always getting turned off 💡",  
    "You're as sharp as a marble ⚪",  
    "You're the human version of a participation award 🏅",  
    "You're about as useful as a screen door on a submarine 🛳️",  
    "You're like a cloud of toxic gas ☁️ — everyone avoids you",  
    "You’re the reason shampoo bottles have instructions 🧴",  
    "You're the type of person who'd trip over a wireless connection 📶",  
    "You're the human equivalent of a typo ✏️",  
    "You have something no one else does — absolutely no talent 😬",  
    "You're as welcome as a pop-up ad 📢",  
    "You're like a broken pencil ✏️ — pointless",  
    "You are proof that even evolution can go in reverse 🔄",  
    "You bring everyone together… in a group chat complaining about you 📱",  
    "You're not completely useless — you can still serve as a bad example 😎",  
    "You're like a phone with no signal 📵 — lost and useless",  
    "You're like a selfie stick at a funeral 🤳 — just wrong",  
    "You talk like you have a limited data plan for intelligence 📉",  
    "You're so slow 🐢, it’s like buffering in real life ⏳",  
    "You're the human version of a blue screen error 💻",  
    "You're the kind of person who claps when the plane lands ✈️",  
    "You're like a math book ➗ — full of problems 📚",  
    "Your brain is on airplane mode 🛫",  
    "You're like expired milk 🥛 — no one wants you, and you stink 🤢",  
    "You're like Wi-Fi at a festival 📶 — unreliable and annoying",  
    "You're like a door without a handle 🚪 — hard to deal with and useless",  
    "You're not even bad… you're just unnecessary 🙄",  
    "You're like if lag was a person 🐌",  
    "You're the plot twist no one asked for 🔀",  
    "You're the loading screen of my life ⏳",  
    "You’re like an unskippable ad 📺 — annoying and pointless",  
    "You're the kind of person autocorrect gives up on 🤖",  
    "You’re the reason group projects fail 📝",  
    "You have something computers don’t — bugs in your brain 🐛",  
    "You're like a Chrome tab 🌐 — always slowing things down",  
    "You're like a song stuck on repeat 🔁 — annoying and never-ending",  
    "You're more disappointing than a sequel 🎬",  
    "You're as confusing as a TikTok trend 🎵",  
    "You're the lag in every game 🎮",  
    "You're like a soft drink with no fizz 🥤 — flat and useless",  
    "You bring nothing to the table but crumbs 🍞",  
    "You're the NPC everyone skips talking to 👤",  
    "You’re like a pop quiz ❌ — unwanted and unprepared",  
    "You're like an online exam 🖥️ — stressful and full of errors",  
    "You're not a vibe, you're a virus 🦠",  
    "You're the background noise of life 🎶",  
    "You’re like an update no one wanted — buggy and unnecessary 🐞",  
    "You're the reason earphones have left and right labels 🎧",  
    "You're like a TikTok ad 📱 — nobody likes you but you still show up",  
    "You're the captcha nobody solves 🔒",  
    "You're the lag that ruins the game ⏱️",  
    "You're as broken as Internet Explorer 🌐",  
    "You're like an uncharged phone 🔋 — dead and useless",  
    "You're like a forgotten password 🔑 — always in the way",  
    "You're the kind of error that crashes systems ⚠️",  
    "You have the personality of a buffering wheel 🔄",  
    "You're like a group chat on mute 🔇 — nobody wants to hear from you",  
    "You're the part of the code that causes bugs 🐞",  
    "You're the reason we need a debug mode for life 🛠️",  
    "You're like a leaked password — exposed and irrelevant 🔓",  
    "You’re the error 404 of personalities 🕵️‍♂️",  
    "You're more confusing than a JavaScript callback 💻",  
    "You're like an incognito tab 🕵️ — here, but useless",  
    "You're like a selfie taken in the dark 🤳 — pointless",  
    "You're the reboot no one asked for 🔄",  
    "You're the kind of person who would unplug a wireless router 🔌",  
    "You're as outdated as Flash Player ⚡",  
    "You belong in the recycle bin 🗑️",  
    "You're the kind of file that always gets corrupted 💾",  
    "You're like a system update that never finishes ⏳",  
    "You're the lag in the livestream 🎥",  
    "You're as invisible as a shadow in the dark 🌑",  
    "You're like an MP3 player in 2025 🎵 — unnecessary",  
    "You're like a voice note from a stranger 📩 — ignored and deleted",  
    "You're the reason we need airplane mode in life ✈️",  
    "You're as awkward as a silent Zoom call 🎥",  
    "You crash harder than my code on the first run 💻",  
    "You're like a spam email 📧 — instantly discarded",  
    "You're the kind of friend people mute 🔇",  
    "You couldn't pour water out of a boot with instructions on the heel 👢",  
    "You're like CTRL + ALT + DEL — only useful when something's wrong ⌨️",  
    "You're like a screenshot of a blank screen 🖼️ — useless",  
    "You're the tab I always close first ❌",  
    "You're the offline mode of conversation 📴",  
    "You're like a Terms of Service agreement 📄 — no one reads or respects you",  
    "You're the default ringtone of life 🎶 — annoying and forgettable",  
    "You have the appeal of a failed captcha 🔒",  
    "You're the bug in my otherwise perfect script 🐛",  
    "You're like a forgotten password 🔑 — frustrating and useless",  
    "You're the spam in my inbox 📧",  
    "You're like Java ☕ — nobody really likes dealing with you",  
    "You're the kind of echo nobody listens to 🔊",  
    "You're a full stop in the sentence of progress .",  
    "You're like a pop-up blocker for productivity 🚫",  
    "You're the cooldown period in life’s game ⏱️ — slowing everyone down",  
    "You're the typo in every perfect sentence ✏️",  
    "You're as slow as dial-up internet 🐌",  
    "You're like a downloaded PDF that won’t open 📄",  
    "You're like a random reboot 🔄 — inconvenient and disruptive",  
    "You're the bad Wi-Fi signal of social life 📶",  
    "You're the 'skip intro' button of friendship ⏩",  
    "You're more extra than RAM in a toaster 🖥️",  
    "You're the wrong answer on a multiple-choice test ❌",  
    "You're like an old meme 🖼️ — out of touch and embarrassing",  
    "You're the static on the radio of life 📻",  
    "You're the crash log of my peace 💥",  
    "You're the settings nobody customizes ⚙️",  
    "You're like a fax machine in 2025 📠 — irrelevant",  
    "You're like a deep-fried meme 🍟 — overdone and unwanted",  
    "You're as useful as a read receipt in ghosting 📩",  
    "You're the Discord ping at 3AM 🔔",  
    "You're like a 'next episode' autoplay with no story 📺",  
    "You're the unfunny guy who thinks he's the group clown 🤡",  
    "You're the lag spike in real life 🐢",  
    "You're like that one friend who doesn’t bring food to the party 🍕",  
    "You're like a Google search with no results 🔍",  
    "You're as predictable as a TikTok dance 🎵",  
    "You're the 'skip ad' button that doesn't work ⏭️",  
    "You're the USB plug that never fits on the first try 🔌",  
    "You're like a cracked screen 📱 — annoying and hard to ignore",  
    "You're a power outage at a LAN party ⚡",  
    "You're the error message no one understands ⚠️",  
    "You're the last pick in dodgeball 🏐 — and it shows",  
    "You're the left sock that’s always missing 🧦",  
    "You're the reason I check 'mute notifications' twice 🔔",  
    "You're the loud sneeze in a silent classroom 🤧",  
    "You're a failed simulation 🖥️",  
    "You're not even a glitch in the matrix — just a bug in beta 🐞"  
];               
        
    let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

    if (!mentionedUser) {
        return reply("*_🫟 Usage: .roast @user (Tag someone to roast them!)_*");
    }

    let target = `@${mentionedUser.split("@")[0]}`;
    
    // Sending the roast message with the mentioned user
    let message = `${target} :\n *${randomRoast}*\n> This is all for fun, don't take it seriously!`;
    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser] }, { quoted: mek });
});

//------------------------------------------------------
cmd({
    pattern: "8ball",
    desc: "Magic 8-Ball gives fun answers with a shake effect",
    category: "fun",
    react: "🎱",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❗ Please ask a yes/no question!\nExample: .8ball Will I ace my exams?");

    let responses = [
        "Yes! 🙄", "No. 😂", "Maybe... 🤔", "Definitely! 😎", "Not sure. 🤷‍♂️", 
        "Ask again later. ⏳", "I don't think so. 🙅‍♂️", "Absolutely! 💯", 
        "No way! 🤦", "Looks promising! 🌟", "Signs point to yes! 🔮",
        "Better not tell you now... 🕵️", "Concentrate and ask again. 🧘‍♂️"
    ];

    let user = m.pushName || "Friend";

    // Show shaking effect
    let shakingMessage = await reply("🎱 Shaking the Magic 8-Ball... 🔄");

    // Wait 2 seconds before showing the answer
    setTimeout(() => {
        let answer = responses[Math.floor(Math.random() * responses.length)];
        conn.sendMessage(from, { text: `🎱 *Magic 8-Ball* for ${user}:\n${answer}` }, { quoted: shakingMessage });
    }, 2000);
});

//------------------------------------------------------
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
        ? `*${sender} complimented ${target}:*\n😊 *${randomCompliment}*`
        : `*${sender}, you forgot to tag someone! But hey, here's a compliment for you:*\n😊 *${randomCompliment}*`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
});

//------------------------------------------------------
cmd({
    pattern: "rps",
    desc: "Play interactive Best of 3 Rock Paper Scissors! 🪨📄✂️",
    category: "fun",
    react: "✂️",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    let rounds = 3;
    let userScore = 0;
    let botScore = 0;

    const choices = ["rock 🪨", "paper 📄", "scissors ✂️"];

    for (let i = 1; i <= rounds; i++) {
        // Ask user for their choice with buttons
        let buttonMessage = {
            text: `🎮 *Round ${i}*\nChoose your move:`,
            buttons: [
                { buttonId: 'rock', buttonText: { displayText: 'Rock 🪨' }, type: 1 },
                { buttonId: 'paper', buttonText: { displayText: 'Paper 📄' }, type: 1 },
                { buttonId: 'scissors', buttonText: { displayText: 'Scissors ✂️' }, type: 1 },
            ],
            headerType: 1
        };

        let sent = await conn.sendMessage(from, buttonMessage, { quoted: m });

        // Wait for user's button response
        let userMove = await new Promise(resolve => {
            const handler = async (btnM) => {
                if (btnM.key.remoteJid === from && btnM.message?.buttonsResponseMessage) {
                    const choice = btnM.message.buttonsResponseMessage.selectedButtonId;
                    conn.removeListener('message', handler);
                    resolve(choice);
                }
            };
            conn.on('message', handler);
        });

        let userChoice = userMove;
        let botChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];

        // Determine round winner
        let roundResult = "";
        if (userChoice === botChoice) {
            roundResult = "Draw! 🤝";
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            roundResult = "You win this round! 🎉";
            userScore++;
        } else {
            roundResult = "Bot wins this round! 😢";
            botScore++;
        }

        await reply(`*Round ${i}*\n🫱 You: ${userChoice}\n🤖 Bot: ${botChoice}\n${roundResult}`);
    }

    // Final results with emojis
    let finalResult = "";
    if (userScore > botScore) finalResult = `🏆🎉 You won the Best of 3! 🎊🥳`;
    else if (botScore > userScore) finalResult = `😎 Bot wins the Best of 3! 💥👾`;
    else finalResult = `😅 It's a draw overall! 🎯`;

    await reply(`🙂 *Final Score:* You ${userScore} - Bot ${botScore}\n🎲 ${finalResult}`);
});
//------------------------------------------------------
cmd({
    pattern: "coinflip",
    desc: "Flip a coin and guess Heads or Tails! 🪙",
    category: "fun",
    react: "🪙",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❗ Please guess Heads or Tails!\nExample: .coinflip heads", { quoted: mek });

    let userGuess = q.toLowerCase();
    if (!["heads", "tails"].includes(userGuess)) {
        return reply("❌ Invalid guess! Type `heads` or `tails`.", { quoted: mek });
    }

    // Bot flips the coin
    let coinResult = Math.random() < 0.5 ? "heads" : "tails";

    // Determine if user won
    let resultMessage = "";
    if (userGuess === coinResult) {
        resultMessage = `🎉 You guessed it right! It's ${coinResult.toUpperCase()}! 🥳`;
    } else {
        resultMessage = `😢 Sorry, it's ${coinResult.toUpperCase()}. Better luck next time! 😅`;
    }

    await reply(resultMessage, { quoted: mek });
});