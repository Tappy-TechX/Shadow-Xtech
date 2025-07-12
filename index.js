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
    generateForwardMessageContent, // Corrected from generateForwardMessageMessage
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
  } = require('@whiskeysockets/baileys')

  // New imports required by user requests
  const chalk = require('chalk'); // For newsletter status logging

  const { logActivity } = require("./lib/activityTracker");

  const l = console.log
  const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
  const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
  const fs = require('fs')
  const ff = require('fluent-ffmpeg')
  const P = require('pino')
  const config = require('./config') // Ensure config is loaded
  const GroupEvents = require('./lib/groupevents');
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  // Assuming sms.js is the correct file name for the sms module
  const { sms, downloadMediaMessage, AntiDelete } = require('./sms')
  const FileType = require('file-type');
  const axios = require('axios')
  const { File } = require('megajs')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const path = require('path')
  const prefix = config.PREFIX

  // --- NEW: Import the call handler module ---
  const callHandler = require('./lib/callhandler');
  // ------------------------------------------

  // Define currentDirname for path resolution
  const currentDirname = __dirname;

  // Owner numbers from config and direct definition
  const ownerNumber = ['254759000340'] // This matches the developer's contact number from the WhatsApp channel.

  // Load sudo owners from lib/sudo.json
  let sudoOwners = [];
  try {
      const sudoFilePath = path.join(currentDirname, './lib/sudo.json');
      if (fs.existsSync(sudoFilePath)) {
          const sudoData = JSON.parse(fs.readFileSync(sudoFilePath, 'utf-8'));
          if (sudoData && sudoData.users && Array.isArray(sudoData.users)) {
              sudoOwners = sudoData.users.map(user => user.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
          }
      }
  } catch (e) {
      console.error(chalk.red("[🔴] Error loading sudo owners from lib/sudo.json:"), e);
  }

  // Combine all owner numbers for creator check
  const allOwnerNumbers = [...ownerNumber, ...(config.DEV ? [config.DEV] : []), ...sudoOwners];
  // Helper function to check if a sender is a creator
  const isCreator = (sender) => allOwnerNumbers.includes(sender);


  const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }

  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }

  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);

  //===================SESSION-AUTH============================
  // Session handling logic remains the same
  if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
      if (!config.SESSION_ID) return console.log('[🛜] Please add your session to SESSION_ID env !!')
      const sessdata = config.SESSION_ID.replace("Shadow-Xtech~", '');
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
      filer.download((err, data) => {
          if (err) throw err
          fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
              console.log("[🟢] Session downloaded ✅")
          })
      })
  }

  // Express server setup
  const express = require("express");
  const app = express();
  const port = process.env.PORT || 9090;

  // Function to connect to WhatsApp
  async function connectToWA() {
      console.log("[🛜] Connecting to WhatsApp ⏳️...");
      const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
      var { version } = await fetchLatestBaileysVersion()

      const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: true,
          auth: state,
          version
      })

      conn.ev.on('connection.update', async (update) => { // Added 'async' here
          const { connection, lastDisconnect } = update
          if (connection === 'close') {
              if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                  // Attempt to reconnect if not logged out
                  console.log('[🟠] Connection closed, attempting to reconnect...');
                  setTimeout(connectToWA, 5000); // Reconnect after 5 seconds
              } else {
                  console.log('[🟡] Connection closed, logged out. Please re-scan QR code.');
                  // Optionally, delete session files here if you want a clean restart on logout
                  // fs.unlinkSync(__dirname + '/sessions/creds.json');
              }
          } else if (connection === 'open') {
              // Plugin loading and initial message moved here for faster perceived startup
              console.log('[🧩] Installing Plugins🕹️');
              fs.readdirSync("./plugins/").forEach((plugin) => {
                  if (path.extname(plugin).toLowerCase() == ".js") {
                      require("./plugins/" + plugin);
                  }
              });
              console.log('[🧩] Plugins installed successful ✅');
              console.log('[🟠] Bot connected to whatsapp 🌐');

              // --- NEW: Newsletter Follow ---
              // Using example channel IDs provided by the user
              const newsletterChannels = [
                "120363419533811227@newsletter", // Example channel ID 1
                "120363369453603973@newsletter", // Example channel ID 2
              ];
              const followedChannels = [];
              const failedChannels = [];

              for (const channelId of newsletterChannels) {
                try {
                  await conn.query({
                    tag: "iq",
                    attrs: { to: channelId, type: "set", xmlns: "newsletter" },
                    content: [{ tag: "follow", attrs: { mute: "false" } }],
                  });
                  followedChannels.push(channelId);
                } catch (e) {
                  failedChannels.push(channelId);
                  console.error(chalk.red(`[🔴] Failed to follow ${channelId}:`), e);
                }
              }

              let newsletterStatus = `[📡] Newsletter Follow Status:\n\n[✅] Successfully followed ${followedChannels.length} channel(s).\n\n`;
              if (failedChannels.length > 0) {
                newsletterStatus += `[🔴] Failed to follow ${failedChannels.length} channel(s) for updates.\n`;
              }
              newsletterStatus += `💡 Tip: Following these channels keeps your bot updated with the latest news and features.`;
              console.log(newsletterStatus.trim());
              // ------------------------------

              // --- NEW: Check for restart notification file ---
              const restartNotifyPath = path.join(currentDirname, "./data/restart_notify.json");
              if (fs.existsSync(restartNotifyPath)) {
                try {
                  const restartData = JSON.parse(fs.readFileSync(restartNotifyPath));
                  const now = Date.now();
                  const fileMtimeMs = fs.statSync(restartNotifyPath).mtimeMs;
                  const timeDiffSeconds = (now - fileMtimeMs) / 1000;

                  if (timeDiffSeconds <= 180) { // If file is less than 3 minutes old
                    const restartMessage = `\n✅ *Shadow-Xtech is now back online!*\n> <@${restartData.sender.split('@')[0]}> restart completed successfully.\n`;
                    await conn.sendMessage(restartData.chat, {
                      text: restartMessage,
                      mentions: [restartData.sender],
                    });
                  }
                  fs.unlinkSync(restartNotifyPath); // Delete the notification file
                } catch (e) {
                  console.error("[🔴] Failed to send restart notification:", e);
                }
              }
              // ------------------------------

              // --- NEW: Initialize the call handler here ---.
              callHandler(conn, config.ANTICALL); // Pass conn and the anticall setting from config
              // ---------------------------------------------

              let up = `*✨ Hello, Shadow-Xtech User! ✨*

╭─〔 *🤖 SHADOW XTECH BOT* 〕  
├─▸ *Ultrasonic, Speed and Power By Black-Tappy!*  
╰─➤ *Your New WhatsApp Sidekick is Here!*

*🩷Thank you for Choosing Shadow-Xtech!*

╭──〔 🔗 *Quick Links* 〕  
├─ 📢 *Join Our Channel:*  
│   Click [**Here**](https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10) to join!  
├─ ⭐ *Give Us a Star:*  
│   Star Us [**Here**](https://github.com/Tappy-Black/Shadow-Xtech-V1)!  
╰─🛠️ *Prefix:* \`${prefix}\`

> _© *Powered By Black-Tappy*_`;

              // Append newsletter status to the initial message
              up += `\n\n${newsletterStatus}`;

              conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/og4tsk.jpg` }, caption: up })
          }
      })
      conn.ev.on('creds.update', saveCreds)

      //==============================

      conn.ev.on('messages.update', async updates => {
          for (const update of updates) {
              if (update.update.message === null) {
                  console.log("Delete Detected:", JSON.stringify(update, null, 2));
                  await AntiDelete(conn, updates);
              }
          }
      });
      //==============================

      conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

      //=============readstatus=======

      conn.ev.on('messages.upsert', async(mek) => {
          mek = mek.messages[0]
          if (!mek.message) return
          mek.message = (getContentType(mek.message) === 'ephemeralMessage')
              ? mek.message.ephemeralMessage.message
              : mek.message;
          //console.log("New Message Detected:", JSON.stringify(mek, null, 2));

          // Read message if configured
          if (config.READ_MESSAGE === 'true') {
              await conn.readMessages([mek.key]);  // Mark message as read
              console.log(`Marked message from ${mek.key.remoteJid} as read.`);
          }

          // Handle view once messages
          if (mek.message.viewOnceMessageV2)
              mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message

          // Auto status seen
          if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
              await conn.readMessages([mek.key])
          }

          // Auto status react
          if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
              const jawadlike = await conn.decodeJid(conn.user.id);
              const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              await conn.sendMessage(mek.key.remoteJid, {
                  react: {
                      text: randomEmoji,
                      key: mek.key,
                  }
              }, { statusJidList: [mek.key.participant, jawadlike] });
          }

          // Auto status reply
          if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true") {
              const user = mek.key.participant
              const text = `${config.AUTO_STATUS_MSG}`
              await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
          }

          // Save message
          await Promise.all([
              saveMessage(mek),
          ]);

          const m = sms(conn, mek) // Assuming sms is correctly imported and returns a message object
          const type = getContentType(mek.message)
          const content = JSON.stringify(mek.message)
          const from = mek.key.remoteJid
          const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
          const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
          const isCmd = body.startsWith(prefix)
          var budy = typeof mek.text == 'string' ? mek.text : false;
          const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
          const args = body.trim().split(/ +/).slice(1)
          const q = args.join(' ')
          const text = args.join(' ')
          const isGroup = from.endsWith('@g.us')
          const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
          const senderNumber = sender.split('@')[0]
          const botNumber = conn.user.id.split(':')[0]
          const pushname = mek.pushName || 'Sin Nombre'
          const isMe = botNumber.includes(senderNumber)

          // Use the consolidated isCreator function
          const isCreatorCheck = isCreator(sender);

          const botNumber2 = await jidNormalizedUser(conn.user.id);
          const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
          const groupName = isGroup ? groupMetadata.subject : ''
          const participants = isGroup ? await groupMetadata.participants : ''
          const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
          const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
          const isAdmins = isGroup ? groupAdmins.includes(sender) : false
          const isReact = m.message.reactionMessage ? true : false
          const reply = (teks) => {
              conn.sendMessage(from, { text: teks }, { quoted: mek })
          }

          // --- NEW: Ban list check and activity logging ---
          let banList = [];
          try {
              const banFilePath = path.join(currentDirname, './lib/ban.json');
              if (fs.existsSync(banFilePath)) {
                  banList = JSON.parse(fs.readFileSync(banFilePath, 'utf-8'));
              }
          } catch (e) {
              console.error(chalk.red("❌ Error loading ban list from lib/ban.json:"), e);
          }
          // Ensure sender is in the correct format for comparison
          const formattedSender = sender.endsWith('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
          const isSenderBanned = [...ownerNumber, ...banList].map(num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net").includes(formattedSender);

          const isGroupChat = isGroup; // Use the already determined isGroup
          const senderJid = sender; // Use the sender variable which is the JID

          if (isGroupChat && isSenderBanned) {
              try {
                  // Assuming logActivity is imported and works
                  logActivity(senderJid);
              } catch (e) {
                  console.error("Failed to log activity:", e);
              }
          }
          // --- END NEW ---

          // --- NEW: Owner React ---
          // Check if sender is an owner/creator and not a reaction message
          if (isCreator(sender) && !isReact && config.OWNER_REACT === 'true') { // Added config for owner react
              const reactions = ["👑", "💀", "📊", "⚙️", "🧠", "🎯", "📈", "📝", "🏆", "🌍", "🇵🇰", "💗", "❤️", "💥", "🌼", "🏵️", ,"💐", "🔥", "❄️", "🌝", "🌚", "🐥", "🧊"];
              const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
              m.react(randomReaction);
          }
          // --- END NEW ---

          //==========public react============//
          // Auto React for all messages (public and owner)
          if (!isReact && config.AUTO_REACT === 'true') {
              const reactions = [
                  '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣',
                  '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕',
                  '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️',
                  '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑',
                  '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄',
                  '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀',
                  '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾',
                  '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟',
                  '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤',
                  '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪',
                  '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈',
                  '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚',
                  '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌',
                  '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫',
                  '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
              ];

              const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
              m.react(randomReaction);
          }

          // Custom React for all messages (public and owner)
          if (!isReact && config.CUSTOM_REACT === 'true') {
              // Use custom emojis from the configuration (fallback to default if not set)
              const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
              const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
              m.react(randomReaction);
          }

          //==========WORKTYPE============
          // This logic seems to control bot behavior based on config.MODE
          if (!isCreator(sender) && config.MODE === "private") return // Only owners can use in private mode
          if (!isCreator(sender) && isGroup && config.MODE === "inbox") return // Only owners can use in inbox mode (if not in group)
          if (!isCreator(sender) && !isGroup && config.MODE === "groups") return // Only owners can use in groups mode (if not in group)

          // take commands
          const events = require('./command')
          const cmdName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : false;
          if (isCmd) {
              const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
              if (cmd) {
                  if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

                  try {
                      // Pass all necessary context variables to the command function
                      cmd.function(conn, mek, m, {
                          from,
                          quoted: mek, // Assuming 'm' is the message object, 'quoted' should be the message itself
                          body,
                          isCmd,
                          command,
                          args,
                          q,
                          text,
                          isGroup,
                          sender,
                          senderNumber,
                          botNumber2,
                          botNumber,
                          pushname,
                          isMe,
                          isCreator: isCreator(sender), // Pass the result of isCreator check
                          groupMetadata,
                          groupName,
                          participants,
                          groupAdmins,
                          isBotAdmins,
                          isAdmins,
                          reply
                      });
                  } catch (e) {
                      console.error("[PLUGIN ERROR] " + e);
                  }
              }
          }
          // This part seems to be for commands that trigger on specific message types (body, text, image, sticker)
          // It might be better to consolidate command handling if possible, but keeping as is for now
          events.commands.map(async(command) => {
              if (body && command.on === "body") {
                  command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator: isCreator(sender), groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
              } else if (mek.q && command.on === "text") { // Assuming 'mek.q' refers to quoted text or similar
                  command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator: isCreator(sender), groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
              } else if (
                  (command.on === "image" || command.on === "photo") &&
                  mek.type === "imageMessage"
              ) {
                  command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator: isCreator(sender), groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
              } else if (
                  command.on === "sticker" &&
                  mek.type === "stickerMessage"
              ) {
                  command.function(conn, mek, m, { from, l, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator: isCreator(sender), groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
              }
          });

      });
      conn.ev.on('creds.update', saveCreds)

      //===================================================
      conn.decodeJid = jid => {
          if (!jid) return jid;
          if (/:\d+@/gi.test(jid)) {
              let decode = jidDecode(jid) || {};
              return (
                  (decode.user &&
                      decode.server &&
                      decode.user + '@' + decode.server) ||
                  jid
              );
          } else return jid;
      };
      //===================================================
      conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
          let vtype
          if (options.readViewOnce) {
              message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
              vtype = Object.keys(message.message.viewOnceMessage.message)[0]
              delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
              delete message.message.viewOnceMessage.message[vtype].viewOnce
              message.message = {
                  ...message.message.viewOnceMessage.message
              }
          }

          let mtype = Object.keys(message.message)[0]
          let content = await generateForwardMessageContent(message, forceForward) // Corrected function name
          let ctype = Object.keys(content)[0]
          let context = {}
          if (mtype != "conversation") context = message.message[mtype].contextInfo
          content[ctype].contextInfo = {
              ...context,
              ...content[ctype].contextInfo
          }
          const waMessage = await generateWAMessageFromContent(jid, content, options ? {
              ...content[ctype],
              ...options,
              ...(options.contextInfo ? {
                  contextInfo: {
                      ...content[ctype].contextInfo,
                      ...options.contextInfo
                  }
              } : {})
          } : {})
          await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
          return waMessage
      }
      //=================================================
      conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
          let quoted = message.msg ? message.msg : message
          let mime = (message.msg || message).mimetype || ''
          let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
          const stream = await downloadContentFromMessage(quoted, messageType)
          let buffer = Buffer.from([])
          for await (const chunk of stream) {
              buffer = Buffer.concat([buffer, chunk])
          }
          let type = await FileType.fromBuffer(buffer) || { mime: 'application/octet-stream', ext: '.bin' } // Added default type
          trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
          // save to file
          await fs.writeFileSync(trueFileName, buffer)
          return trueFileName
      }
      //=================================================
      conn.downloadMediaMessage = async(message) => {
          let mime = (message.msg || message).mimetype || ''
          let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
          const stream = await downloadContentFromMessage(message, messageType)
          let buffer = Buffer.from([])
          for await (const chunk of stream) {
              buffer = Buffer.concat([buffer, chunk])
          }

          return buffer
      }

      /**
      *
      * @param {*} jid
      * @param {*} message
      * @param {*} forceForward
      * @param {*} options
      * @returns
      */
      //================================================
      conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
          let mime = '';
          let res = await axios.head(url)
          mime = res.headers['content-type']
          if (mime.split("/")[1] === "gif") {
              return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
          }
          let type = mime.split("/")[0] + "Message"
          if (mime === "application/pdf") {
              return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "image") {
              return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "video") {
              return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "audio") {
              return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
          }
      }
      //==========================================================
      conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
          //let copy = message.toJSON()
          let mtype = Object.keys(copy.message)[0]
          let isEphemeral = mtype === 'ephemeralMessage'
          if (isEphemeral) {
              mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
          }
          let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
          let content = msg[mtype]
          if (typeof content === 'string') msg[mtype] = text || content
          else if (content.caption) content.caption = text || content.caption
          else if (content.text) content.text = text || content.text
          if (typeof content !== 'string') msg[mtype] = {
              ...content,
              ...options
          }
          if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
          else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
          if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
          else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
          copy.key.remoteJid = jid
          copy.key.fromMe = sender === conn.user.id

          return proto.WebMessageInfo.fromObject(copy)
      }


      /**
      *
      * @param {*} path
      * @returns
      */
      //=====================================================
      conn.getFile = async(PATH, save) => {
          let res
          let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
          //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
          let type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' } // Added default type
          // The filename generation here seems potentially problematic. It concatenates __filename, __dirname, and a timestamp.
          // A simpler approach like `path.join(__dirname, `temp_${Date.now()}.${type.ext}`)` might be safer.
          let filename = path.join(__dirname, `temp_${Date.now()}.${type.ext}`); // Simplified filename generation
          if (data && save) fs.promises.writeFile(filename, data)
          return {
              res,
              filename,
              size: await getSizeMedia(data), // Assuming getSizeMedia is defined elsewhere or needs to be implemented
              ...type,
              data
          }

      }
      //=====================================================
      conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
          let types = await conn.getFile(PATH, true)
          let { filename, size, ext, mime, data } = types
          let type = '',
              mimetype = mime,
              pathFile = filename
          if (options.asDocument) type = 'document'
          if (options.asSticker || /webp/.test(mime)) {
              let { writeExif } = require('./exif.js') // Ensure exif.js is available
              let media = { mimetype: mime, data }
              pathFile = await writeExif(media, { packname: config.packname, author: config.packname, categories: options.categories ? options.categories : [] }) // Assuming config.packname is defined
              await fs.promises.unlink(filename)
              type = 'sticker'
              mimetype = 'image/webp'
          } else if (/image/.test(mime)) type = 'image'
          else if (/video/.test(mime)) type = 'video'
          else if (/audio/.test(mime)) type = 'audio'
          else type = 'document'
          await conn.sendMessage(jid, {
              [type]: { url: pathFile },
              mimetype,
              fileName,
              ...options
          }, { quoted, ...options })
          return fs.promises.unlink(pathFile)
      }
      //=====================================================
      conn.parseMention = async(text) => {
          return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
      }
      //=====================================================
      conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
          let types = await conn.getFile(path, true)
          let { mime, ext, res, data, filename } = types
          // Corrected: 'file' was used instead of 'data' or 'buffer'
          if (res && res.status !== 200 || data.length <= 65536) {
              try { throw { json: JSON.parse(data.toString()) } } catch (e) { if (e.json) throw e.json }
          }
          let type = '',
              mimetype = mime,
              pathFile = filename
          if (options.asDocument) type = 'document'
          if (options.asSticker || /webp/.test(mime)) {
              let { writeExif } = require('./exif') // Ensure exif.js is available
              let media = { mimetype: mime, data }
              pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.packname, author: options.author ? options.author : config.author, categories: options.categories ? options.categories : [] }) // Assuming config.packname, config.author are defined
              await fs.promises.unlink(filename)
              type = 'sticker'
              mimetype = 'image/webp'
          } else if (/image/.test(mime)) type = 'image'
          else if (/video/.test(mime)) type = 'video'
          else if (/audio/.test(mime)) type = 'audio'
          else type = 'document'
          await conn.sendMessage(jid, {
              [type]: { url: pathFile },
              caption,
              mimetype,
              fileName,
              ...options
          }, { quoted, ...options })
          return fs.promises.unlink(pathFile)
      }
      /**
      *
      * @param {*} message
      * @param {*} filename
      * @param {*} attachExtension
      * @returns
      */
      //=====================================================
      conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
          let buffer;
          if (options && (options.packname || options.author)) {
              buffer = await writeExifVid(buff, options); // Ensure writeExifVid is available
          } else {
              buffer = await videoToWebp(buff); // Ensure videoToWebp is available
          }
          await conn.sendMessage(
              jid,
              { sticker: { url: buffer }, ...options },
              options
          );
      };
      //=====================================================
      conn.sendImageAsSticker = async (jid, buff, options = {}) => {
          let buffer;
          if (options && (options.packname || options.author)) {
              buffer = await writeExifImg(buff, options); // Ensure writeExifImg is available
          } else {
              buffer = await imageToWebp(buff); // Ensure imageToWebp is available
          }
          await conn.sendMessage(
              jid,
              { sticker: { url: buffer }, ...options },
              options
          );
      };
      /**
      *
      * @param {*} jid
      * @param {*} path
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      * @returns
      */
      //=====================================================
      conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

      /**
      *
      * @param {*} jid
      * @param {*} path
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      * @returns
      */
      //=====================================================
      conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
          let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
          return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
      }

      /**
      *
      * @param {*} jid
      * @param {*} path
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      * @returns
      */
      //=====================================================
      conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })

      /**
      *
      * @param {*} jid
      * @param {*} buttons
      * @param {*} caption
      * @param {*} footer
      * @param {*} quoted
      * @param {*} options
      * @returns
      */
      //=====================================================
      conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
          let buttonMessage = {
              text,
              footer,
              buttons,
              headerType: 2,
              ...options
          }
          //========================================================================================================================================
          conn.sendMessage(jid, buttonMessage, { quoted, ...options })
      }
      //=====================================================
      conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
          let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
          var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
              templateMessage: {
                  hydratedTemplate: {
                      imageMessage: message.imageMessage,
                      "hydratedContentText": text,
                      "hydratedFooterText": footer,
                      "hydratedButtons": but
                  }
              }
          }), options)
          conn.relayMessage(jid, template.message, { messageId: template.key.id })
      }

      /**
      *
      * @param {*} jid
      * @param {*} path
      * @param {*} quoted
      * @param {*} options
      * @returns
      */
      //=====================================================
      conn.getName = (jid, withoutContact = false) => {
          id = conn.decodeJid(jid);

          withoutContact = conn.withoutContact || withoutContact;

          let v;

          if (id.endsWith('@g.us'))
              return new Promise(async resolve => {
                  v = store.contacts[id] || {};

                  if (!(v.name.notify || v.subject))
                      v = conn.groupMetadata(id) || {};

                  resolve(
                      v.name ||
                          v.subject ||
                          PhoneNumber( // PhoneNumber is not defined in this scope. Assuming it's from a library like 'awesome-phonenumber'.
                              '+' + id.replace('@s.whatsapp.net', ''),
                          ).getNumber('international'),
                  );
              });
          else
              v =
                  id === '0@s.whatsapp.net'
                      ? {
                          id,
                          name: 'WhatsApp',
                      }
                      : id === conn.decodeJid(conn.user.id)
                      ? conn.user
                      : store.contacts[id] || {};

          return (
              (withoutContact ? '' : v.name) ||
              v.subject ||
              v.verifiedName ||
              PhoneNumber( // PhoneNumber is not defined in this scope.
                  '+' + jid.replace('@s.whatsapp.net', ''),
              ).getNumber('international')
          );
      };

      // Vcard Functionality
      conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
          let list = [];
          for (let i of kon) {
              list.push({
                  displayName: await conn.getName(i + '@s.whatsapp.net'),
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
                      i + '@s.whatsapp.net',
                  )}\nFN:${
                      global.OwnerName // Assuming global.OwnerName is defined elsewhere
                  }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
                      global.email // Assuming global.email is defined elsewhere
                  }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
                      global.github // Assuming global.github is defined elsewhere
                  }/khan-xmd\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
                      global.location // Assuming global.location is defined elsewhere
                  };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
              });
          }
          conn.sendMessage(
              jid,
              {
                  contacts: {
                      displayName: `${list.length} Contact`,
                      contacts: list,
                  },
                  ...opts,
              },
              { quoted },
          );
      };

      // Status aka brio
      conn.setStatus = status => {
          conn.query({
              tag: 'iq',
              attrs: {
                  to: '@s.whatsapp.net', // This target seems incorrect for setting status.
                  type: 'set',
                  xmlns: 'status',
              },
              content: [
                  {
                      tag: 'status',
                      attrs: {},
                      content: Buffer.from(status, 'utf-8'),
                  },
              ],
          });
          return status;
      };
      conn.serializeM = mek => sms(conn, mek, store); 
  }
  
  // Serve HTML content from lib/shadow.html
  app.get("/", (req, res) => res.sendFile(path.join(currentDirname, "./lib/shadow.html")));
  app.listen(port, () => console.log("Server listening on port http://localhost:" + port));

  // Connect to WhatsApp after a short delay, after setting up the server
  setTimeout(() => {
      connectToWA();
  }, 4000); // 4 seconds delay
