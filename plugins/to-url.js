const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: '🖇',
  desc: "Convert media to Catbox URL",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  let tempFilePath;
  try {
    // Get quoted message or self
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType) {
      throw "Please reply to an image, video, or audio file.";
    }

    // Download media and save temp file
    const mediaBuffer = await quotedMsg.download();
    tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Determine file extension
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else if (mimeType.includes('image/gif')) extension = '.gif';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    if (!extension) extension = path.extname(tempFilePath) || '.bin';

    const fileName = `file${extension}`;

    // Prepare form for Catbox upload
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    // Upload to Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data || !response.data.includes("https://")) {
      throw "Upload failed. Catbox returned an unexpected response.";
    }

    const mediaUrl = response.data;

    // Identify media type
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Video';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    // Reply in hacker style
    await reply(
      "```[ FILE UPLOAD SUCCESS ]```\n" +
      "```========================```" + "\n" +
      `📁 TYPE   : ${mediaType}\n` +
      `📦 SIZE   : ${formatBytes(mediaBuffer.length)}\n` +
      `🌐 LINK   :\n${mediaUrl}\n` +
      "```========================```\n" +
      `> Uploaded by: [SHADOW-XTECH ⚡ SYSTEM]`
    );

  } catch (error) {
    console.error(error);
    await reply(`❌ Error: ${error.message || error}`);
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

// Helper to format byte sizes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
