const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { promisify } = require('util')
const zlib = require('zlib')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
const axios = require('axios')
const { File } = require('megajs')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ['255767862457']

const cmdLogger = {
  info: (msg) => console.log(`[ INFO ] ${msg}`),
  success: (msg) => console.log(`[ SUCCESS ] ${msg}`),
  warning: (msg) => console.log(`[ WARN ] ${msg}`),
  error: (msg) => console.error(`[ ERROR ] ${msg}`)
}

// Ensure temp directory exists
const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

//=================== SESSION-AUTH (POPKID~ FORMAT FIXED) ============================
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function loadGiftedSession() {
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    
    // If credentials already exist, we skip extraction
    if (fs.existsSync(credsPath)) return true;

    if (config.SESSION_ID && config.SESSION_ID.startsWith("POPKID~")) {
        const compressedBase64 = config.SESSION_ID.substring("POPKID~".length);
        try {
            const compressedBuffer = Buffer.from(compressedBase64, 'base64');
            // Check for GZIP Magic Numbers (0x1f 0x8b)
            if (compressedBuffer[0] === 0x1f && compressedBuffer[1] === 0x8b) {
                const gunzip = promisify(zlib.gunzip);
                const decompressedBuffer = await gunzip(compressedBuffer);
                
                // Write file SYNCHRONOUSLY to ensure it exists before Baileys starts
                fs.writeFileSync(credsPath, decompressedBuffer.toString('utf-8'));
                
                // Small delay to ensure the file system has registered the file (Crucial for some hosts)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                cmdLogger.success("Session restored from POPKID~ format âœ…");
                return true;
            }
        } catch (error) { 
            cmdLogger.error("Failed to decompress POPKID session ID");
            return false; 
        }
    } else {
        cmdLogger.warning('No valid POPKID~ SESSION_ID found in config.');
    }
    return false;
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

let conn 
const statusReactCache = new Map();
const statusReactCooldown = 3000; 

async function connectToWA() {
  try {
    // Phase 1: Restore Session before anything else
    await loadGiftedSession();

    cmdLogger.info("Connecting to WhatsApp â³ï¸...");

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: true, // Set to true to see QR if session fails
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      if (qr) {
        console.log('[ ðŸ” ] QR Code generated. Scan if session failed.')
        qrcode.generate(qr, { small: true })
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        if (shouldReconnect) {
          console.log('[ â™»ï¸ ] Reconnecting...')
          setTimeout(() => connectToWA(), 5000)
        }
      } else if (connection === 'open') {
        console.log('Nova XMD Connected successfully âœ…')
        
        // Load Plugins
        const pluginFiles = fs.readdirSync("./plugins/").filter(file => file.endsWith(".js"));
        for (const file of pluginFiles) {
            require("./plugins/" + file);
        }

        const startMess = {
            image: { url: 'https://files.catbox.moe/og4tsk.jpg' },
            caption: `*ð—¡ð—¢ð—©ð—” ð—«ð— ð—— ð—œð—¦ ð—”ð—Ÿð—œð—©ð—˜*\n\nPrefix: ${config.PREFIX}\nOwner: ${config.OWNER_NAME}\nMode: ${config.MODE}`,
            contextInfo: { forwardedNewsletterMessageInfo: { newsletterJid: '120363369453603973@newsletter', newsletterName: "POKID-XMD" } }
        }
        await conn.sendMessage(conn.user.id, startMess)
      }
    })

    // Auto-Bio Clock Logic
    setInterval(async () => {
        if (config.AUTO_BIO === "true") {
            const date = new Date().toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi' });
            const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' });
            const bioText = `ðŸ›¡ï¸  Xmd Bot ðŸ¤– Live Now\nðŸ“… ${date}\nâ° ${time}`;
            try { await conn.setStatus(bioText); } catch (err) {}
        }
    }, 60000);

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('messages.upsert', async(mek) => {
      mek = mek.messages[0]
      if (!mek.message) return
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      
      // Status View/React
      if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        if (config.AUTO_STATUS_SEEN === "true") await conn.readMessages([mek.key])
        if (config.AUTO_STATUS_REACT === "true") {
           const now = Date.now();
           if (now - (statusReactCache.get(mek.key.participant) || 0) > statusReactCooldown) {
               await conn.sendMessage('status@broadcast', { react: { text: "â¤ï¸", key: mek.key } }, { statusJidList: [mek.key.participant, conn.user.id.split(':')[0] + '@s.whatsapp.net'] })
               statusReactCache.set(mek.key.participant, now);
           }
        }
        return
      }
      
      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const from = mek.key.remoteJid
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
      const isCmd = body.startsWith(config.PREFIX)
      const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ').shift().toLowerCase() : ''
      const args = body.trim().split(/ +/).slice(1)
      const q = args.join(' ')
      const isOwner = ownerNumber.includes(mek.sender.split('@')[0]) || mek.key.fromMe
      const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek })

      // Master Eval
      if (isOwner && body.startsWith('%')) {
          try { reply(util.format(eval(body.slice(1)))) } catch (e) { reply(util.format(e)) }
          return
      }

      // Mode Handler
      if(!isOwner && config.MODE === "private") return

      // Plugin Router
      const events = require('./command')
      if (isCmd) {
        const cmd = events.commands.find((c) => c.pattern === command || (c.alias && c.alias.includes(command)))
        if (cmd) {
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
          try { cmd.function(conn, mek, m, {from, body, isCmd, command, args, q, isOwner, reply}) } catch (e) { console.error(e) }
        }
      }
    })

    // RESTORE ALL ORIGINAL MEDIA HELPERS
    conn.getFile = async(PATH, save) => {
        let res, data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? fs.readFileSync(PATH) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' }
        let filename = path.join(__dirname, new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return { res, filename, size: Buffer.byteLength(data), ...type, data }
    }

    conn.downloadMediaMessage = async(message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        return buffer
    }

    conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                displayName: await conn.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:${config.OWNER_NAME}\nitem1.TEL;waid=${i}:${i}\nEND:VCARD`
            })
        }
        conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    conn.setStatus = (status) => {
        conn.query({ tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' }, content: [{ tag: 'status', attrs: {}, content: Buffer.from(status, 'utf-8') }] })
        return status
    }

  } catch (error) {
    console.error('Connection Error:', error)
    setTimeout(() => connectToWA(), 5000)
  }
}

app.get("/", (req, res) => res.send("POPKID XMD IS ACTIVE âœ…"))
app.listen(port, () => console.log(`Server running on port ${port}`))
setTimeout(() => connectToWA(), 5000)
