const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

// ----------------📇 Quoted Contact-----------------

const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🌦 Weather | Check System ⚙️",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:Shadow-Xtech Weather Bot
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
NOTE:Real-time Weather • Forecast • AQI • Alerts
END:VCARD`
    }
  }
};

const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

// 🌤------------ Weather Command ------------------
cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {

    try {

        if (!q) {
            return reply("❗ Please provide a city name.\nUsage: .weather Nairobi");
        }

        const apiKey = '2d61a72574c11c4f36173b627f8cb177';
        const city = q;

        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        const message = `
🌍 *Weather Information for ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${data.main.temp}°C
🤒 *Feels Like:* ${data.main.feels_like}°C
📉 *Min Temp:* ${data.main.temp_min}°C
📈 *Max Temp:* ${data.main.temp_max}°C
💧 *Humidity:* ${data.main.humidity}%
🌬️ *Wind Speed:* ${data.wind.speed} m/s
🔽 *Pressure:* ${data.main.pressure} hPa
☁️ *Condition:* ${data.weather[0].main}
📝 *Description:* ${data.weather[0].description}

━━━━━━━━━━━━━━━━━━
> © Powered By Black-Tappy
`;

        await conn.sendMessage(from,
            {
                text: message,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363369453603973@newsletter',
                        newsletterName: "𝐒ʜᴀᴅᴏᴡ 𝐗ᴛᴇᴄʜ",
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "🌦 Shadow-Xtech | Intelligent Weather",
                        body: "Smart Advice • Alerts • AQI • GPS",
                        thumbnailUrl: 'https://files.catbox.moe/3l3qgq.jpg',
                        sourceUrl: whatsappChannelLink,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            },
            { quoted: quotedContact }
        );

    } catch (e) {

        console.log(e);

        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }

        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});
