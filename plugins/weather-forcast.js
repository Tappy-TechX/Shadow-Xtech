/**  
 * 🌤️ WEATHER COMMAND  
 * Plugin: weather.js  
 * Place in: ./popkid/weather.js  
 * Creator: POPKID XMD  
 * Uses: wttr.in (FREE — no API key needed)  
 */  
  
const { cmd } = require('../command');  
const axios = require('axios');  
  
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
  
// =====================  
// WEATHER ICONS MAP  
// =====================  
const weatherIcons = {  
    'Sunny': '☀️', 'Clear': '🌙', 'Partly cloudy': '⛅',  
    'Cloudy': '☁️', 'Overcast': '🌫️', 'Mist': '🌫️',  
    'Patchy rain possible': '🌦️', 'Light rain': '🌧️',  
    'Moderate rain': '🌧️', 'Heavy rain': '⛈️',  
    'Thundery outbreaks possible': '⛈️', 'Blowing snow': '❄️',  
    'Blizzard': '🌨️', 'Fog': '🌁', 'Freezing fog': '🌁',  
    'Light snow': '🌨️', 'Heavy snow': '❄️', 'Ice pellets': '🧊',  
    'Light drizzle': '🌦️', 'Freezing drizzle': '🌧️',  
    'Torrential rain shower': '🌊', 'default': '🌡️'  
};  
  
const getWeatherIcon = (condition) => {  
    for (const key of Object.keys(weatherIcons)) {  
        if (condition.toLowerCase().includes(key.toLowerCase())) return weatherIcons[key];  
    }  
    return weatherIcons['default'];  
};  
  
// =====================  
// WIND DIRECTION  
// =====================  
const getWindDir = (deg) => {  
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];  
    return dirs[Math.round(deg / 45) % 8];  
};  
  
// =====================  
// UV INDEX LABEL  
// =====================  
const getUVLabel = (uv) => {  
    if (uv <= 2) return '🟢 Low';  
    if (uv <= 5) return '🟡 Moderate';  
    if (uv <= 7) return '🟠 High';  
    if (uv <= 10) return '🔴 Very High';  
    return '🟣 Extreme';  
};  
  
// =====================  
// WEATHER COMMAND  
// =====================  
cmd({  
    pattern: "weather2",  
    alias: ["w", "forecast", "temp"],  
    react: "🌤️",  
    category: "tools",  
    desc: "Get detailed weather for any city",  
    filename: __filename  
},  
async (conn, mek, m, { from, args, text, reply, sender }) => {  
    try {  
        if (!text) {  
            return reply(`  
╭─❖ 🌤️ *WEATHER* ❖─╮  
│  
│ ⚠️ Please provide a city!  
│  
│ 📌 *Usage:*  
│ .weather Nairobi  
│ .weather London  
│ .weather New York  
│  
╰──────────────────❖  
`.trim());  
        }  
  
        const city = text.trim();  
  
        const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;  
        const { data } = await axios.get(url, { timeout: 10000 });  
  
        const current = data.current_condition[0];  
        const location = data.nearest_area[0];  
        const weather = data.weather[0];  
  
        const cityName = location.areaName[0].value;  
        const country = location.country[0].value;  
        const region = location.region[0]?.value || '';  
  
        const conditionText = current.weatherDesc[0].value;  
        const icon = getWeatherIcon(conditionText);  
  
        const tempC = current.temp_C;  
        const tempF = current.temp_F;  
        const feelsC = current.FeelsLikeC;  
        const feelsF = current.FeelsLikeF;  
        const humidity = current.humidity;  
        const windKmph = current.windspeedKmph;  
        const windDir = current.winddir16Point;  
        const visibility = current.visibility;  
        const uvIndex = current.uvIndex;  
        const pressure = current.pressure;  
        const cloudCover = current.cloudcover;  
        const precipMM = current.precipMM;  
  
        const maxC = weather.maxtempC;  
        const minC = weather.mintempC;  
        const sunrise = weather.astronomy[0].sunrise;  
        const sunset = weather.astronomy[0].sunset;  
        const moonPhase = weather.astronomy[0].moon_phase;  
  
        const hourly = weather.hourly;  
        const slots = [hourly[2], hourly[4], hourly[6]];  
  
        const forecastLine = slots.map(h => {  
            const t = parseInt(h.time) / 100;  
            const label = t === 6 ? '🌅 6AM' : t === 12 ? '☀️ 12PM' : '🌆 6PM';  
            return `│  ${label} → ${h.tempC}°C  ${getWeatherIcon(h.weatherDesc[0].value)}`;  
        }).join('\n');  
  
        const message = `  
╭══════════════════╗  
  ${icon} *WEATHER REPORT*  
╚══════════════════╝  
  
📍 *${cityName}${region ? ', ' + region : ''}, ${country}*  
  
╭─❖ *CURRENT CONDITIONS* ❖  
│  
│ ${icon} *${conditionText}*  
│ 🌡️ *Temp:* ${tempC}°C / ${tempF}°F  
│ 🤔 *Feels Like:* ${feelsC}°C / ${feelsF}°F  
│ 📊 *High/Low:* ${maxC}°C / ${minC}°C  
│  
╭─❖ *ATMOSPHERE* ❖  
│  
│ 💧 *Humidity:* ${humidity}%  
│ 🌬️ *Wind:* ${windKmph} km/h ${windDir}  
│ 👁️ *Visibility:* ${visibility} km  
│ 🌡️ *Pressure:* ${pressure} hPa  
│ ☁️ *Cloud Cover:* ${cloudCover}%  
│ 🌧️ *Precipitation:* ${precipMM} mm  
│ ☀️ *UV Index:* ${getUVLabel(uvIndex)}  
│  
╭─❖ *SUN & MOON* ❖  
│  
│ 🌅 *Sunrise:* ${sunrise}  
│ 🌇 *Sunset:* ${sunset}  
│ 🌙 *Moon Phase:* ${moonPhase}  
│  
╭─❖ *TODAY'S FORECAST* ❖  
│  
${forecastLine}  
│  
╰──────────────────❖  
  
> 🤖 *POPKID XMD* | Weather powered by wttr.in  
`.trim();  
  
        await conn.sendMessage(  
            from,  
            {  
                text: message,  
                contextInfo: {  
                    mentionedJid: [sender],  
                    forwardingScore: 999,  
                    isForwarded: true,  
                    forwardedNewsletterMessageInfo: {  
                        newsletterJid: '120363369453603973@newsletter',  
                        newsletterName: "𝐒ʜᴀᴅᴏᴡ-𝐗ᴛᴇᴄʜ",  
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
  
    } catch (err) {  
        console.error("Weather Error:", err);  
  
        if (err?.response?.status === 404 || err?.message?.includes('404')) {  
            return reply(`❌ City *"${text}"* not found!\nPlease check the spelling and try again.`);  
        }  
  
        reply(`❌ Failed to fetch weather.\nTry again in a moment.`);  
    }  
});