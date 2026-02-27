const axios = require('axios');
const config = require('../config')
const {cmd , commands} = require('../command')
const googleTTS = require('google-tts-api')

const axios = require("axios");

//--------------------trt-command-----------------------
cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages (e.g., .trt es Hello or .trt fr-es Bonjour)",
    react: "⚡",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) 
            return reply("❗ Please provide a language code and text.\nUsage: .trt [lang code] [text]");

        const args = q.trim().split(" ");
        const firstArg = args[0].toLowerCase();

        // Help command
        if (firstArg === "help") {
            const helpMsg = `
🌍 *SHADOW-XTECH Translation Help* 🌍

Usage:
• .trt [target language code] [text] - Translate text to the target language
  Example: .trt es Hello world

• .trt [source-target language code] [text] - Translate from specific source to target
  Example: .trt fr-es Bonjour
  Example: .trt auto-en Hola

• Supported Languages (Codes):
  English: en
  Spanish: es
  French: fr
  German: de
  Italian: it
  Portuguese: pt
  Russian: ru
  Chinese: zh
  Japanese: ja
  Arabic: ar
  Hindi: hi

💡 Tip: Use language codes only.`;
            return reply(helpMsg.trim());
        }

        if (args.length < 2)
            return reply("❗ Please provide both language code(s) and text to translate.");

        let sourceLang = "auto";
        let targetLang = args[0].toLowerCase();

        // Check for source-target format (e.g., fr-es)
        if (targetLang.includes("-")) {
            const parts = targetLang.split("-");
            if (parts.length === 2) {
                sourceLang = parts[0];
                targetLang = parts[1];
            }
        }

        const textToTranslate = args.slice(1).join(" ");

        // Prepare request body for LibreTranslate
        const body = {
            q: textToTranslate,
            source: sourceLang, // explicit or auto
            target: targetLang,
            format: "text"
        };

        const response = await axios.post(
            "https://libretranslate.com/translate",
            body,
            { headers: { "Content-Type": "application/json" } }
        );

        const translation = response.data.translatedText || "❌ Translation failed";

        const translationMessage = `
⚡ *SHADOW-XTECH Translation* ⚡

🔤 *Original*: ${textToTranslate}
🔠 *Translated*: ${translation}
🌐 *From*: ${sourceLang.toUpperCase()} → *To*: ${targetLang.toUpperCase()}
💡 *Powered by LibreTranslate API*
        `;

        return reply(translationMessage.trim());
    } catch (err) {
        console.error("Translate Error:", err);
        return reply("⚠️ An error occurred while translating your text. Please try again later 🤕");
    }
});

//----------------------tts-comman----------------------

cmd({
    pattern: "tts",
    desc: "Convert text to speech with multiple languages and speed options",
    category: "download",
    react: "👧",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, args, q }) => {
    try {
        // Help message
        const helpMessage = `
⚡ *TTS Command Help* ⚡

Usage:
tts <lang> <text> [slow/fast]

Options:
- <lang> : Language code (e.g., en, hi, fr, es)
- <text> : Text to convert to speech
- [slow/fast] : Optional speed (default is fast)

Examples:
- tts en Hello world
- tts hi नमस्ते दुनिया slow
- tts fr Bonjour tout le monde fast
`;

        // If no arguments or 'help' is requested, send help
        if (!q || args[0].toLowerCase() === 'help') {
            return reply(helpMessage);
        }

        // Default settings
        let lang = 'en';       // default language
        let slow = false;      // default speed

        // Extract options if user provided (format: tts <lang> <text> [slow/fast])
        const firstArg = args[0];
        if (firstArg && firstArg.length === 2) {
            lang = firstArg.toLowerCase();
            args.shift(); // remove language from args
        }

        // Check if user wants slow or fast
        if (args[args.length - 1]?.toLowerCase() === 'slow') {
            slow = true;
            args.pop();
        } else if (args[args.length - 1]?.toLowerCase() === 'fast') {
            slow = false;
            args.pop();
        }

        const text = args.join(' ');
        if (!text) return reply("⚠️ Please provide text to convert to speech.\nUse `tts help` for usage.");

        // Generate TTS URL
        const url = googleTTS.getAudioUrl(text, {
            lang: lang,
            slow: slow,
            host: 'https://translate.google.com',
        });

        // Send as PTT
        await conn.sendMessage(from, {
            audio: { url: url },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Something went wrong while generating the TTS. Try again later.");
    }
});