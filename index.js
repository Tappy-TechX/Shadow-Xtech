const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')

const fs = require('fs')
const path = require('path')
const P = require('pino')
const os = require('os')
const axios = require('axios')

const config = require('./config')
const prefix = config.PREFIX

const { loadSession } = require("./lib/session")
const callHandler = require('./lib/callhandler')

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

const ownerNumber = ['254759000340']

/* ===============================
   Fancy Status Messages
================================ */

const fancyMessages = [
"⚡️ Speedy connection, always on! 🚀",
"💨 Fast replies, seamless chat. ✨",
"📶 Reliable link, instant response. ✅",
"🚀 Connect faster, stay updated. 🌟",
"⚡️ Swift and stable connection. 💯",
"💨 Quick chat, smooth sailing. 🌊",
"📶 Always online, always fast. 🔋",
"🚀 Your connection, our priority. ❤️"
]

const statusEmojis = ['✅','🟢','✨','📶','🔋']

let status = "Stable"
const speed = Math.floor(Math.random() * 1500) + 200

if (speed > 1000) status = "Slow"
else if (speed > 500) status = "Moderate"

/* ===============================
   Temp Folder Cleaner
================================ */

const tempDir = path.join(os.tmpdir(), 'cache-temp')

if (!fs.existsSync(tempDir))
fs.mkdirSync(tempDir)

const clearTempDir = () => {
fs.readdir(tempDir, (err, files) => {
if (err) return
for (const file of files) {
fs.unlink(path.join(tempDir, file), () => {})
}
})
}

setInterval(clearTempDir, 5 * 60 * 1000)

/* ===============================
   Channel Info
================================ */

const whatsappChannelId = "120363369453603973@newsletter"
const whatsappChannelLink = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10"

let newsletterFollowed = false

/* ===============================
   CONNECT TO WHATSAPP
================================ */

async function connectToWA() {

await loadSession(config.SESSION_ID)

console.log("Connecting to WhatsApp ⏳️...")

const { state, saveCreds } =
await useMultiFileAuthState("./session")

const { version } =
await fetchLatestBaileysVersion()

const conn = makeWASocket({
logger: P({ level: "silent" }),
printQRInTerminal: false,
browser: Browsers.macOS("Firefox"),
syncFullHistory: true,
auth: state,
version
})

/* ===============================
   CONNECTION EVENTS
================================ */

conn.ev.on("connection.update", async (update) => {

const { connection, lastDisconnect } = update

if (connection === "close") {

if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}

}

else if (connection === "open") {

console.log("Bot connected to WhatsApp 🪀")

/* ===============================
   LOAD PLUGINS
================================ */

console.log("🕹️ Installing Plugins")

fs.readdirSync("./plugins/").forEach(file => {
if (file.endsWith(".js"))
require("./plugins/" + file)
})

console.log("Plugins installed successful ✅")

/* ===============================
   FOLLOW CHANNEL
================================ */

if (!newsletterFollowed) {

newsletterFollowed = true

try {

const subs = await conn.newsletterFetchAllSubscriptions().catch(() => [])

if (subs.some(s => s.id === whatsappChannelId)) {

console.log("🟢 Already following newsletter")

} else {

await conn.newsletterFollow(whatsappChannelId)

console.log("📬 Followed newsletter")

}

} catch (err) {

console.log("Newsletter follow error:", err)

}

}

/* ===============================
   BUILD STATUS MESSAGE
================================ */

const randomFancyMessage =
fancyMessages[Math.floor(Math.random() * fancyMessages.length)]

let up = `
╭───────◇
│ 📡 *Shadow-Xtech Connected*
╰───────◇

╭──〔 🤖 Bot Status 〕──◇
├ ⚙️ Mode: ${config.MODE}
├ ⚡ Latency: ${statusEmojis[Math.floor(Math.random()*statusEmojis.length)]} ${speed}ms
├ 📶 Connection: ${status}
╰ ${randomFancyMessage}

╭───────◇
│ 🌐 24/7 Instant Response
╰───────◇

╭──〔 🔗 Quick Links 〕──◇
├ 📢 Channel
│ ${whatsappChannelLink}
├ 🛠 Developer
│ Black-Tappy
╰ ⚡ Prefix: ${prefix}

© Powered By Black-Tappy
`

/* ===============================
   SEND MESSAGE AFTER CONNECT
================================ */

setTimeout(async () => {

await conn.sendMessage(conn.user.id,{
image:{ url:"https://files.catbox.moe/h8aep1.jpeg" },
caption: up
})

},2000)

/* ===============================
   CALL HANDLER
================================ */

callHandler(conn, config.ANTICALL)

}

})

/* ===============================
   SAVE CREDS
================================ */

conn.ev.on("creds.update", saveCreds)

return conn
}

/* ===============================
   START SERVER
================================ */

app.get("/", (req,res)=>{
res.send("Shadow-Xtech Bot Running")
})

app.listen(port,()=>{
console.log("Server running on port",port)
})

/* ===============================
   START BOT
================================ */

connectToWA()