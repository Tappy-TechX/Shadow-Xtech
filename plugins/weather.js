const axios = require('axios');
const { cmd } = require('../command');

const apiKey = '2d61a72574c11c4f36173b627f8cb177';
const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

// Quoted Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Weather | System 🌍",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001
END:VCARD`
    }
  }
};

// Helpers
function getFlagEmoji(code) {
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
}

function getWeatherEmoji(condition) {
  const map = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️"
  };
  return map[condition] || "🌡️";
}

function getAQIText(aqi) {
  const levels = {
    1: "🟢 Good",
    2: "🟡 Fair",
    3: "🟠 Moderate",
    4: "🔴 Poor",
    5: "🟣 Very Poor"
  };
  return levels[aqi] || "Unknown";
}

function tempBar(temp) {
  const max = 50;
  const percentage = Math.min(Math.max(temp, 0), max);
  const filled = Math.round((percentage / max) * 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function smartAdvice(temp, condition) {
  if (condition.includes("Rain")) return "☔ Carry an umbrella.";
  if (condition.includes("Thunderstorm")) return "⚡ Stay indoors if possible.";
  if (temp <= 15) return "🧥 Wear a jacket.";
  if (temp >= 30) return "🥤 Stay hydrated.";
  return "👌 Weather looks comfortable.";
}

// 🌪 Random Severe Alerts
function getRandomSevereAlert() {
  const alerts = [
    "⛈ Severe storm system moving through the area.",
    "🌪 High wind advisory in effect. Stay cautious.",
    "⛈ Thunderstorm activity may intensify.",
    "🌊 Heavy rainfall expected. Risk of flooding.",
    "🌡 Extreme temperature fluctuations detected."
  ];
  return alerts[Math.floor(Math.random() * alerts.length)];
}

cmd({
  pattern: "weather",
  desc: "🌍 Intelligent Weather System",
  react: "🌦️",
  category: "other",
  filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
  try {

    let lat, lon, locationName;

    // 📍 WEATHER ME
    if (
      q?.toLowerCase() === "me" &&
      mek.message?.extendedTextMessage?.contextInfo?.quotedMessage?.locationMessage
    ) {
      const loc = mek.message.extendedTextMessage.contextInfo.quotedMessage.locationMessage;
      lat = loc.degreesLatitude;
      lon = loc.degreesLongitude;
      locationName = "Your Location";
    } else {
      if (!q)
        return reply("❗ Usage:\n.weather Nairobi\nor reply to a location with `.weather me`");

      const geo = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}`
      );

      lat = geo.data.coord.lat;
      lon = geo.data.coord.lon;
      locationName = geo.data.name;
    }

    // CURRENT WEATHER
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = current.data;
    const flag = getFlagEmoji(data.sys.country);
    const emoji = getWeatherEmoji(data.weather[0].main);
    const bar = tempBar(data.main.temp);
    const advice = smartAdvice(data.main.temp, data.weather[0].main);

    // LOCAL TIME
    const localTime = new Date(
      Date.now() + data.timezone * 1000
    ).toUTCString().replace("GMT", "");

    // AQI
    const aqiRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const aqi = aqiRes.data.list[0].main.aqi;

    // Severe Detection
    const realSevere = ["Thunderstorm", "Tornado", "Squall"]
      .includes(data.weather[0].main);

    const randomTrigger = Math.random() < 0.25; // 25% chance

    const severeAlert = (realSevere || randomTrigger)
      ? `\n${getRandomSevereAlert()}`
      : "";

    const message = `
> 🌍 Shadow-Xtech Weather Intelligent
>📍 ${locationName}, ${data.sys.country} ${flag}
> 🕒 ${localTime}
> ${emoji} ${data.weather[0].description}
> 🌡 ${data.main.temp}°C  ${bar}
> 🤗 Feels: ${data.main.feels_like}°C
> 💧 Humidity: ${data.main.humidity}%
> 💨 Wind: ${data.wind.speed} m/s
> 🌬 AQI: ${getAQIText(aqi)}
> 🧠 Advice: ${advice}
> ${severeAlert}
> ⚡ Powered By Shadow-Xtech
`;

    await conn.sendMessage(from, {
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
          renderLargerThumbnail: true
        }
      }
    }, { quoted: quotedContact });

  } catch (err) {
    console.log(err);
    if (err.response?.status === 404) {
      return reply("*_🚫 City not found. Please check the spelling and try again._*");
    }
    return reply("*_🔴 Weather system temporarily unavailable._*");
  }
});