// ================= IMPORTS =================
const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
proto,
generateForwardMessageContent,
generateWAMessageFromContent,
jidDecode,
downloadContentFromMessage,
fetchLatestBaileysVersion,
Browsers
} = require("@whiskeysockets/baileys")

const fs = require("fs")
const path = require("path")
const os = require("os")
const axios = require("axios")
const P = require("pino")
const util = require("util")
const express = require("express")

const config = require("./config")
const prefix = config.PREFIX

const { sms, AntiDelete } = require("./lib")
const { getBuffer, getGroupAdmins } = require("./lib/functions")
const GroupEvents = require("./lib/groupevents")
const { loadSession } = require("./lib/session")

// ================= OWNER =================
const ownerNumber = ["18494967948"]

// ================= TEMP =================
const tempDir = path.join(os.tmpdir(), "shadow-temp")
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

setInterval(() => {
fs.readdir(tempDir, (err, files) => {
if (err) return
files.forEach(f => fs.unlinkSync(path.join(tempDir, f)))
})
}, 300000)

// ================= SERVER =================
const app = express()
const port = process.env.PORT || 9090

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"./lib/shadow.html"))
})

app.listen(port,()=>{
console.log("🌐 Server running on port "+port)
})

// ================= CONNECT =================
async function connectToWA(){

await loadSession(config.SESSION_ID)

console.log("Connecting to WhatsApp...")

const { state, saveCreds } = await useMultiFileAuthState("./session")
const { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
logger:P({level:"silent"}),
browser:Browsers.macOS("Firefox"),
auth:state,
version,
syncFullHistory:true
})

// ================= CONNECTION =================
conn.ev.on("connection.update",(update)=>{
const {connection,lastDisconnect} = update

if(connection==="close"){
if(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut){
console.log("Reconnecting...")
connectToWA()
}
}

if(connection==="open"){

console.log("Shadow-Xtech Connected")

// load plugins
fs.readdirSync("./plugins").forEach(p=>{
if(p.endsWith(".js")) require("./plugins/"+p)
})

let up = `
╭───────────────╮
  SHADOW-XTECH CONNECTED
  DEV : TAPPY-TECHX
  STATUS : ONLINE
  PREFIX : ${config.PREFIX}
  MODE : ${config.MODE}
  TYPE : ${config.PREFIX}menu
╰───────────────╯
`

conn.sendMessage(conn.user.id,{
image:{url:"https://files.catbox.moe/2mnw2r.jpg"},
caption:up
})
}

})

conn.ev.on("creds.update",saveCreds)

// ================= ANTI DELETE =================
conn.ev.on("messages.update", async updates=>{
for(const update of updates){
if(update.update.message === null){
await AntiDelete(conn,updates)
}
}
})

// ================= GROUP EVENTS =================
conn.ev.on("group-participants.update",update=>{
GroupEvents(conn,update)
})

// ================= MESSAGE =================
conn.ev.on("messages.upsert", async(mek)=>{
mek = mek.messages[0]
if(!mek.message) return

mek.message = getContentType(mek.message)==="ephemeralMessage"
? mek.message.ephemeralMessage.message
: mek.message

if(config.READ_MESSAGE==="true"){
await conn.readMessages([mek.key])
}

// ===== BODY =====
const type = getContentType(mek.message)
const from = mek.key.remoteJid

const body =
type==="conversation" ? mek.message.conversation :
type==="extendedTextMessage" ? mek.message.extendedTextMessage.text :
type==="imageMessage" ? mek.message.imageMessage.caption || "" :
type==="videoMessage" ? mek.message.videoMessage.caption || "" : ""

const isCmd = body.startsWith(prefix)

const command = isCmd
? body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
: ""

const args = body.trim().split(/ +/).slice(1)
const text = args.join(" ")

const isGroup = from.endsWith("@g.us")

const sender = mek.key.fromMe
? conn.user.id
: mek.key.participant || mek.key.remoteJid

const senderNumber = sender.split("@")[0]
const isOwner = ownerNumber.includes(senderNumber)

const m = sms(conn,mek)
const isReact = m.message?.reactionMessage ? true : false

// ================= OWNER REACT =================
if(senderNumber.includes("254756360306") && !isReact){

const reactions=[
"👑","🔥","💎","⚡","📊","🎯","🏆","💀","🌍","💥"
]

const random = reactions[Math.floor(Math.random()*reactions.length)]

m.react(random)

}

// ================= PUBLIC AUTO REACT =================
if(!isReact && config.AUTO_REACT==="true"){

const reactions=[
"❤️","🔥","💐","🌼","💥","🎯","💎","🌍","🚀","📈"
]

const random = reactions[Math.floor(Math.random()*reactions.length)]

m.react(random)

}

// ================= CUSTOM REACT =================
if(!isReact && config.CUSTOM_REACT==="true"){

const reactions = (config.CUSTOM_REACT_EMOJIS || "🙂,😂,🔥,❤️").split(",")

const random = reactions[Math.floor(Math.random()*reactions.length)]

m.react(random)

}

// ================= MODE =================
if(!isOwner && config.MODE==="private") return
if(!isOwner && isGroup && config.MODE==="inbox") return
if(!isOwner && !isGroup && config.MODE==="groups") return

// ================= COMMANDS =================
const events = require("./command")

if(isCmd){

const cmd = events.commands.find(
c => c.pattern === command || (c.alias && c.alias.includes(command))
)

if(cmd){

try{

cmd.function(conn,mek,m,{
from,
body,
args,
text,
isGroup,
sender,
senderNumber
})

}catch(e){

console.log("PLUGIN ERROR",e)

}

}

}

})

// ================= HELPERS =================
conn.sendText = (jid,text,quoted="")=>{
return conn.sendMessage(jid,{text},{quoted})
}

conn.downloadMediaMessage = async(message)=>{
const type = message.mtype.replace(/Message/,"")
const stream = await downloadContentFromMessage(message,type)

let buffer = Buffer.from([])

for await(const chunk of stream){
buffer = Buffer.concat([buffer,chunk])
}

return buffer
}

conn.decodeJid = jid => jidDecode(jid) || jid

conn.serializeM = mek => sms(conn,mek)

}

// ================= START =================
setTimeout(()=>{
connectToWA()
},4000)