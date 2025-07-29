const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

// --- CONFIGURATION ---

// Array of random image URLs for the menu
const MENU_IMAGES = [
    'https://files.catbox.moe/og4tsk.jpg',
    'https://files.catbox.moe/95n1x6.jpg',
    'https://files.catbox.moe/0w7hqx.jpg',
    'https://files.catbox.moe/3hrxbh.jpg',
    'https://files.catbox.moe/etqc8k.jpg'
];

// Quoted Contact Object
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Menu-Frame | Verified ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:SCIFI\nORG:Shadow-Xtech BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

// Fancy loading messages
const LOADING_MESSAGES = [
    "Initializing connection...🌐",
    "Establishing Bot commands...📂",
    "Verifying credentials...😂",
    "Connecting to WhatsApp API...🗝️",
    "Preparing menu...🆔",
    "Redirecting to commands...📜",
    "Connecting to servers...🛰️",
    "Fetching command list...📝",
    "Authenticating user...👤",
    "Compiling menu...⚙️",
    "Displaying menu now...✅",
    "Waking up the bot...😴",
    "Brewing some coffee...☕",
    "Checking for updates...🔄",
    "Loading all modules...📦",
    "Unleashing the menu...💥",
    "Accessing mainframe...💻",
    "Decrypting command protocols...🛡️",
    "Calibrating response time...⚡",
    "Generating menu interface...🎨",
    "Welcome, user...👋"
];

// Random audio URLs for the menu
const MENU_AUDIO_URLS = [
    'https://files.catbox.moe/ddmjyy.mp3',
    'https://files.catbox.moe/mexjrq.mp3',
    'https://files.catbox.moe/4yqp5m.mp3',
    'https://files.catbox.moe/k41qij.mp3'
];

// --- END OF CONFIGURATION ---

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await reply("📜 Fetching commands... Please wait a moment!");

        // Select dynamic values
        const selectedImageUrl = MENU_IMAGES[Math.floor(Math.random() * MENU_IMAGES.length)];
        const randomLoadingMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        const selectedAudioUrl = MENU_AUDIO_URLS[Math.floor(Math.random() * MENU_AUDIO_URLS.length)];

        // Compose menu caption (truncated for brevity in this snippet, but you can include full menu)
        const menuCaption = `╭──⭘💈 *${config.BOT_NAME}* 💈─·⭘
┆ ◦ 
┆ ◦ • 👑 Owner : *${config.OWNER_NAME}*
┆ ◦ • ⚙️ Prefix : *[${config.PREFIX}]*
┆ ◦ • 🌐 Platform : *Heroku*
┆ ◦ • 📦 Version : ${config.version}
┆ ◦ • ⏱️ Runtime : *_${runtime(process.uptime())}_*
┆ ◦ • 🎲 Mode : *${config.MODE}*
┆ ◦ • 🎀 Dev : *Black-Tappy*
┆ ◦ • 🚀 Version : *4.0.0 Mᴇᴛᴀ*
╰────────────────┈⊷
> ${randomLoadingMessage}
╭──·๏[📥 *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*📥]
┆ ◦ 
┆ ◦  🟦 facebook
┆ ◦  📁 mediafire
┆ ◦  🎵 tiktok
┆ ◦  🎶 tiktokdl
┆ ◦  🎧 tt
┆ ◦  🎼 ttdl
┆ ◦  🐦 twitter
┆ ◦  📷 insta
┆ ◦  📸 ig
┆ ◦  🎦 instagram 
┆ ◦  📦 apk
┆ ◦  🖼️ img
┆ ◦  🌄 imgscan
┆ ◦  🌇 imagine
┆ ◦  🌅 imagine 2 
┆ ◦  🌃 imagine 3
┆ ◦  🌆 flux
┆ ◦  🌉 flux-ai
┆ ◦  🪙 ad
┆ ◦  💸 blur
┆ ◦  💵 grey
┆ ◦  💴 invert
┆ ◦  💶 jail
┆ ◦  💷 imgjoke
┆ ◦  💳 nokia
┆ ◦  💎 rmbg
┆ ◦  🧻 wanted
┆ ◦  ▶️ ringtone 
┆ ◦  📌 pins
┆ ◦  🔵 pindl
┆ ◦  📍 pinterestdl
┆ ◦  🎶 spotify
┆ ◦  🎧 play
┆ ◦  🎧 song
┆ ◦  🎧 song 2
┆ ◦  📸 video
┆ ◦  🎬 video 2
┆ ◦  📺 mp4
┆ ◦  🎵 ytmp3
┆ ◦  📹 ytmp4
┆ ◦  🎬 movie
┆ ◦  ☁️ gdrive
┆ ◦  🌐 tourl
┆ ◦  🔹 tiny
┆ ◦  🎁 shazam
┆ ◦  🪩 news
┆ ◦  🪀 xstalk
┆ ◦  📶 ytpost
┆ ◦  ⚜️ yts
┆ ◦  🍁 ytstalk
┆ ◦ 
╰────┈⊷

╭──·๏[👥 *ɢʀᴏᴜᴘ ᴍᴇɴᴜ* 👥]
┆ ◦ 
┆ ◦  ❌ antilink 
┆ ◦  👑 adminevents
┆ ◦  🤴 admin
┆ ◦  🤬 antibadword
┆ ◦  📛 antilink-kick
┆ ◦  🚫 deletelink
┆ ◦  🟢 online 
┆ ◦  💏 couplepp
┆ ◦  📶 requestlist 
┆ ◦  ⚜️ acceptall
┆ ◦  ❔ leave
┆ ◦  ❕ out
┆ ◦  🐔 poll
┆ ◦  🔚 endgc
┆ ◦  🔗 grouplink
┆ ◦  🚪 kickall
┆ ◦  🚷 kickall2
┆ ◦  🚫 kickall3
┆ ◦  ➕ add
┆ ◦  ➖ remove
┆ ◦  👢 kick
┆ ◦  ⬆️ promote
┆ ◦  ⬇️ demote
┆ ◦  🚮 dismiss
┆ ◦  🔄 revoke
┆ ◦  👋 setgoodbye
┆ ◦  🎉 setwelcome
┆ ◦  🗑️ delete
┆ ◦  🖼️ getpic
┆ ◦  ℹ️ ginfo
┆ ◦  ⏳ disappear on
┆ ◦  ⏳ disappear off
┆ ◦  ⏳ disappear 7D,24H
┆ ◦  📝 allreq
┆ ◦  ✏️ updategname
┆ ◦  📝 updategdesc
┆ ◦  📩 joinrequests
┆ ◦  📨 newgc
┆ ◦  🏃 nikal
┆ ◦  🔇 mute
┆ ◦  🔊 unmute
┆ ◦  🔒 lockgc
┆ ◦  🔓 unlockgc
┆ ◦  📩 invite
┆ ◦  #️⃣ tag
┆ ◦  🏷️ hidetag
┆ ◦  @️⃣ tagall
┆ ◦  👔 tagadmins
╰───┈⊷

╭──·๏[🎭 *ʀᴇᴀᴄᴛɪᴏɴ ᴍᴇɴᴜ* 🎭]
┆ ◦ 
┆ ◦  👊 bully @tag
┆ ◦  🤗 cuddle @tag
┆ ◦  😢 cry @tag
┆ ◦  🤗 hug @tag
┆ ◦  🐺 awoo @tag
┆ ◦  💋 kiss @tag
┆ ◦  👅 lick @tag
┆ ◦  🖐️ pat @tag
┆ ◦  😏 smug @tag
┆ ◦  🔨 bonk @tag
┆ ◦  🚀 yeet @tag
┆ ◦  😊 blush @tag
┆ ◦  😄 smile @tag
┆ ◦  👋 wave @tag
┆ ◦  ✋ highfive @tag
┆ ◦  🤝 handhold @tag
┆ ◦  🍜 nom @tag
┆ ◦  🦷 bite @tag
┆ ◦  🤗 glomp @tag
┆ ◦  👋 slap @tag
┆ ◦  💀 kill @tag
┆ ◦  😊 happy @tag
┆ ◦  😉 wink @tag
┆ ◦  👉 poke @tag
┆ ◦  💃 dance @tag
┆ ◦  😬 cringe @tag
┆ ◦ 
╰─┈⊷

╭──·๏[🎨 *ʟᴏɢᴏ ᴍᴀᴋᴇʀ* 🎨]
┆ ◦
┆ ◦  💡 neonlight
┆ ◦  🎀 blackpink
┆ ◦  🐉 dragonball
┆ ◦  🍭 deadpool
┆ ◦  😹 cat
┆ ◦  🧃 thor
┆ ◦  💸 angelwings
┆ ◦  💡 bulb
┆ ◦  🎭 3dcomic
┆ ◦  🇺🇸 america
┆ ◦  🍥 naruto
┆ ◦  😢 sadgirl
┆ ◦  ☁️ clouds
┆ ◦  🚀 futuristic
┆ ◦  📜 3dpaper
┆ ◦  ✏️ eraser
┆ ◦  🌇 sunset
┆ ◦  🍃 leaf
┆ ◦  🌌 galaxy
┆ ◦  💀 sans
┆ ◦  💥 boom
┆ ◦  💻 hacker
┆ ◦  😈 devilwings
┆ ◦  🇳🇬 nigeria
┆ ◦  💡 bulb
┆ ◦  👼 angelwings
┆ ◦  ♈ zodiac
┆ ◦  💎 luxury
┆ ◦  🎨 paint
┆ ◦  ❄️ frozen
┆ ◦  🏰 castle
┆ ◦  🖋️ tatoo
┆ ◦  🔫 valorant
┆ ◦  🐻 bear
┆ ◦  🔠 typography
┆ ◦  🎂 birthday
┆ ◦ 
╰─┈⊷

╭──·๏[👑 *ᴏᴡɴᴇʀ ᴍᴇɴᴜ* 👑]
┆ ◦ 
┆ ◦  👑 owner
┆ ◦  📜 menu
┆ ◦  📑 allmenu
┆ ◦  🎀 fullmenu
┆ ◦  📊 vv
┆ ◦  📸 vv2
┆ ◦  📋 listcmd
┆ ◦  📦 repo
┆ ◦  🚫 block
┆ ◦  ✅ unblock
┆ ◦  🖼️ fullpp
┆ ◦  🖼️ setpp
┆ ◦  🔄 restart
┆ ◦  ⏹️ shutdown
┆ ◦  🔄 updatecmd
┆ ◦  ⚒️ setprefix 
┆ ◦  ⚙️ mode
┆ ◦  🟢 alwaysonline 
┆ ◦  💬 autotyping 
┆ ◦  🎧 autorecording 
┆ ◦  📷 autostatusview 
┆ ◦  💚 autostatusreact 
┆ ◦  🔁 autostatusreply
┆ ◦  ❤️ autoreact
┆ ◦  📚 autoread
┆ ◦  🔊 autovoice
┆ ◦  📨 autoreply
┆ ◦  ✴️ autosticker 
┆ ◦  ❌ antilink 
┆ ◦  🗑️ antidelete 
┆ ◦  ⛔ delete
┆ ◦  🚮 clearchats
┆ ◦  💚 alive
┆ ◦  🏓 ping
┆ ◦  🆔 gjid
┆ ◦  🆔 jid
┆ ◦  📖 bible
┆ ◦ 
╰─┈⊷

╭──·๏[🎉 *ғᴜɴ ᴍᴇɴᴜ* 🎉]
┆ ◦ 
┆ ◦  🤪 happy
┆ ◦  🤬 angry
┆ ◦  💻 hack
┆ ◦  💘 ship
┆ ◦  ♂️ boy
┆ ◦  ♀️ girl
┆ ◦  👨‍❤️‍👨 marige
┆ ◦  ❤️ heart
┆ ◦  😔 sad
┆ ◦  😠 anger
┆ ◦  😳 shy
┆ ◦  😂 emoji
┆ ◦  🧐 moon
┆ ◦  😕 confused 
┆ ◦  🖼️ setpp
┆ ◦  🥵 hot
┆ ◦  🏃 nikal
┆ ◦  👨‍❤️‍💋‍👨 compatibility 
┆ ◦  💯 compliment 
┆ ◦  💒 lovetest
┆ ◦  💖 romance 
┆ ◦  👨‍👩‍👦 motivate
┆ ◦  🤗 roast
┆ ◦  🏃 nikal
┆ ◦  🎱 8ball
┆ ◦  💀 aura
┆ ◦ 
╰─┈⊷

╭──·๏[🔄 *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ* 🔄]
┆ ◦ 
┆ ◦  🏷️ sticker2image 
┆ ◦  🏷️ stickertoimage
┆ ◦  😀 emojimix
┆ ◦  😁 emix
┆ ◦  ✨ fancy
┆ ◦  🖼️ take
┆ ◦  🎵 tomp3
┆ ◦  📸 sss
┆ ◦  🗣️ tts
┆ ◦  🌐 trt
┆ ◦  🔢 convert
┆ ◦  🔤 dbinary
┆ ◦  🔗 toptt
┆ ◦  🌐 tourl
┆ ◦  🔁 repeat
┆ ◦  📖 topdf
┆ ◦  👤 profile 
┆ ◦  💚 support
┆ ◦ 
╰─┈⊷

╭──·๏[🤖 *ᴀɪ ᴍᴇɴᴜ*🤖]
┆ ◦ 
┆ ◦  🧠 ai
┆ ◦  ♍ aivoice
┆ ◦  🤖 bot
┆ ◦  🔵 gpt
┆ ◦  📦 seek-ai
┆ ◦  🌈 deep
┆ ◦  🎧 dj
┆ ◦  👑 blacktappy
┆ ◦  🤵 define
┆ ◦  🔍 bing
┆ ◦  🎨 imagine
┆ ◦  🖼️ imagine2
┆ ◦ 
╰─┈⊷

╭──·๏[⚡*ᴍᴀɪɴ ᴍᴇɴᴜ* ⚡]
┆ ◦ 
┆ ◦  🏓 ping
┆ ◦  🚀 version
┆ ◦  📡 countryinfo
┆ ◦  💚 alive
┆ ◦  ⏱️ runtime
┆ ◦  ⏳ uptime
┆ ◦  📦 repo
┆ ◦  👑 owner
┆ ◦  📜 menu
┆ ◦  📜 listcmd
┆ ◦  🔁 convert
┆ ◦  ⚙️ setsudo
┆ ◦  ❌ delsudo
┆ ◦  🔖 listsudo
┆ ◦  ⏫ update
┆ ◦  ↕️ env
┆ ◦  🔄 restart
┆ ◦  🫆 prvacymenu
┆ ◦  🔞 adultmenu
┆ ◦  Ⓜ️ msg
┆ ◦  🖥️ connect-msg 
┆ ◦  👤 profile
┆ ◦  🌡️ weather
┆ ◦ 
╰─┈⊷

╭──·๏[🎎 *ᴀɴɪᴍᴇ ᴍᴇɴᴜ* 🎎] 
┆ ◦ 
┆ ◦  🫧 anime
┆ ◦  🌈 anime 1
┆ ◦  🌊 anime 2
┆ ◦  🌀 anime 3
┆ ◦  ⚡ anime 4
┆ ◦  💧 anime 5
┆ ◦  🔥 animegirl 
┆ ◦  ☀️ animegirl 1
┆ ◦  🌫️ animegirl 2
┆ ◦  ⛅ animegirl 3
┆ ◦  ⭐ animegirl 4
┆ ◦  🌌 animegirl 5
┆ ◦  ✅ truth
┆ ◦  😨 dare
┆ ◦  🐶 dog
┆ ◦  🐺 awoo
┆ ◦  👧 garl
┆ ◦  👰 waifu
┆ ◦  🐱 neko
┆ ◦  🧙 megumin
┆ ◦  🐱 neko
┆ ◦  👗 maid
┆ ◦  👧 loli
┆ ◦  📰 animenews
┆ ◦  🦊 foxgirl
┆ ◦  🍥 naruto
┆ ◦ 
╰─┈⊷

╭──·๏[ℹ️*ᴏᴛʜᴇʀ ᴍᴇɴᴜ* ℹ️]
┆ ◦ 
┆ ◦  🟢 poststatus
┆ ◦  ⚪ post
┆ ◦  📅 cid(channel-info)
┆ ◦  🔢 chr(channel-react)
┆ ◦  🎲 quote
┆ ◦  🪙 randomwallpaper
┆ ◦  🎨 wallpaper
┆ ◦  ℹ️ jid
┆ ◦  💻 getpp
┆ ◦  🎲 rw
┆ ◦  💑 pair
┆ ◦  💑 pair2
┆ ◦  ✨ fancy
┆ ◦  🎨 logo <text>
┆ ◦  📖 define
┆ ◦  📰 news
┆ ◦  🎬 movie
┆ ◦  ☀️ weather
┆ ◦  📦 nsfw
┆ ◦  📩 send
┆ ◦  💾 save
┆ ◦  🗞️ wikipedia
┆ ◦  🌐 get
┆ ◦  🔑 gpass
┆ ◦  👤 githubstalk
┆ ◦  🔍 yts
┆ ◦  📧 tempmail
┆ ◦  💌 checkmail
┆ ◦  ✉️ tempnum
┆ ◦  📩 templist
┆ ◦  📮 otpbox
┆ ◦ 
╰─┈⊷
> ${config.DESCRIPTION}`;

        // Send menu image
        await conn.sendMessage(from, {
            image: { url: selectedImageUrl },
            caption: menuCaption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: quotedContact });

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: selectedAudioUrl },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: quotedContact });

    } catch (e) {
        console.error("Menu Command Error:", e);
        reply(`❌ An error occurred while displaying the menu. Please try again later.`);
    }
});