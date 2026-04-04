const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { cmd } = require('../command');
const googleTTS = require('google-tts-api');

// ------------------ Translate Command ------------------
cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "⚡",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) 
            return reply("*📌 Please provide a language code and text. Usage: .translate [language code] [text]*");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;
        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;

        const translationMessage = `> *SHADOW-XTECH-TRANSLATION*\n\n` +
                                   `> 🔤 *Original*: ${textToTranslate}\n` +
                                   `> 🔠 *Translated*: ${translation}\n` +
                                   `> 🌐 *Language*: ${targetLang.toUpperCase()}`;

        return reply(translationMessage);
    } catch (e) {
        console.log(e);
        return reply("*⚠️ An error occurred while translating your text. Please try again later 🤕*");
    }
});

// ------------------ TTS Command ------------------
cmd({
    pattern: "tts",
    desc: "Convert text to audio (TTS) with speed options",
    category: "download",
    react: "📂",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `📌 *TTS Usage Guide:*\n\n` +
                `• *Command format: tts <text> | <speed>\n` +
                `• Example: tts Hello world | fast\n` +
                `• Speed options:\n` +
                `   - normal (default)\n` +
                `   - slow\n` +
                `   - fast\n\n` +
                `*Note:* The speed parameter is optional.`
            );
        }

        // Parse text and speed
        let text = q;
        let speedOption = 'normal';
        if (q.includes('|')) {
            const parts = q.split('|').map(p => p.trim());
            text = parts[0];
            speedOption = parts[1].toLowerCase();
        }

        // Generate TTS URL
        const url = googleTTS.getAudioUrl(text, {
            lang: 'en',
            slow: speedOption === 'slow',
            host: 'https://translate.google.com',
        });

        const tempFile = path.join(__dirname, `tts_temp.mp3`);
        const outFile = path.join(__dirname, `tts_out.mp3`);

        // Download audio
        const writer = fs.createWriteStream(tempFile);
        const res = await fetch(url);
        res.body.pipe(writer);
        await new Promise(resolve => writer.on('finish', resolve));

        // Adjust speed if needed
        let ffmpegSpeed = 1; // normal
        if (speedOption === 'fast') ffmpegSpeed = 1.5;
        else if (speedOption === 'slow') ffmpegSpeed = 0.8;

        await new Promise((resolve, reject) => {
            exec(`ffmpeg -y -i "${tempFile}" -filter:a "atempo=${ffmpegSpeed}" "${outFile}"`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Send audio
        await conn.sendMessage(from, { audio: fs.readFileSync(outFile), mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });

        // Cleanup
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outFile);

    } catch (err) {
        console.log(err);
        reply(`❌ Error: ${err}`);
    }
});