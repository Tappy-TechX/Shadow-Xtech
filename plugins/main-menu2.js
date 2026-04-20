const { cmd } = require('../command');
const config = require('../config');
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
} = require("gifted-baileys");

cmd({
  pattern: "menu2",
  alias: ["allmenu2", "fullmenu2"],
  desc: "Interactive menu",
  category: "menu",
  react: "📜",
  filename: __filename,
},
async (conn, mek, m, { from }) => {

  const sections = [
    {
      title: "📥 Download Menu",
      text: `facebook
tiktok
instagram
spotify
play
ytmp3
ytmp4
movie`,
      image: "https://files.catbox.moe/eubadj.mp4"
    },
    {
      title: "👥 Group Menu",
      text: `antilink
kick
promote
demote
tagall
hidetag
grouplink`,
      image: "https://files.catbox.moe/eubadj.mp4"
    },
    {
      title: "🎭 Reaction Menu",
      text: `hug
kiss
slap
pat
smile
wave
dance`,
      image: "https://files.catbox.moe/eubadj.mp4"
    },
    {
      title: "🎨 Logo Maker",
      text: `neonlight
blackpink
naruto
dragonball
hacker
galaxy`,
      image: "https://files.catbox.moe/eubadj.mp4"
    },
    {
      title: "🤖 AI Menu",
      text: `ai
gpt
bot
define
imagine
deep`,
      image: "https://files.catbox.moe/eubadj.mp4"
    },
    {
      title: "⚡ Main Menu",
      text: `ping
alive
owner
repo
runtime
weather`,
      image: "https://files.catbox.moe/eubadj.mp4"
    }
  ];

  const cards = await Promise.all(
    sections.map(async (sec) => ({
      header: {
        title: `⚙️ ${config.BOT_NAME}`,
        hasMediaAttachment: true,
        videoMessage: (
          await generateWAMessageContent(
            { video: { url: sec.image } },
            { upload: conn.waUploadToServer }
          )
        ).videoMessage,
      },
      body: {
        text: `*${sec.title}*\n\n${sec.text}`,
      },
      footer: {
        text: `> ${config.OWNER_NAME}`,
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy Menu",
              copy_code: sec.text,
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "Repository",
              url: "https://github.com/",
            }),
          },
        ],
      },
    }))
  );

  const message = generateWAMessageFromContent(
    from,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `📜 *${config.BOT_NAME} MENU*\n\n👑 Owner: ${config.OWNER_NAME}\n⚙️ Prefix: ${config.PREFIX}`,
            },
            footer: {
              text: `🚀 Version ${config.version}`,
            },
            carouselMessage: { cards },
          },
        },
      },
    },
    { quoted: mek }
  );

  await conn.relayMessage(from, message.message, {
    messageId: message.key.id,
  });

});