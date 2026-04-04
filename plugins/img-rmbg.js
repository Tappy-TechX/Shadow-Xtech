const axios = require("axios");  
const FormData = require('form-data');  
const fs = require('fs');  
const os = require('os');  
const path = require("path");  
const { cmd } = require("../command");  

// Helper function to format bytes  
function formatBytes(bytes) {  
  if (bytes === 0) return '0 Bytes';  
  const k = 1024;  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];  
  const i = Math.floor(Math.log(bytes) / Math.log(k));  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];  
}  

cmd({  
  pattern: "rmbg",  
  alias: ["removebg"],  
  react: '📸', // initial loading reaction  
  desc: "Scan and remove bg from images",  
  category: "img_edit",  
  use: ".rmbg [reply to image]",  
  filename: __filename  
}, async (conn, message, m,  { reply, react }) => {  
  try {  
    // Set loading reaction  
    if (react) await react('♻️');  

    const quotedMsg = message.quoted ? message.quoted : message;  
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';  

    if (!mimeType || !mimeType.startsWith('image/')) {  
      if (react) await react('❌');  
      return reply("*Please reply to an image file (JPEG/PNG)*");  
    }  

    const mediaBuffer = await quotedMsg.download();  
    const fileSize = formatBytes(mediaBuffer.length);  

    let extension = '';  
    if (mimeType.includes('image/jpeg')) extension = '.jpg';  
    else if (mimeType.includes('image/png')) extension = '.png';  
    else {  
      if (react) await react('❌');  
      return reply("*Unsupported image format. Please use JPEG or PNG*");  
    }  

    const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);  
    fs.writeFileSync(tempFilePath, mediaBuffer);  

    // Upload to Catbox  
    const form = new FormData();  
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);  
    form.append('reqtype', 'fileupload');  

    const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {  
      headers: form.getHeaders()  
    });  

    const imageUrl = uploadResponse.data;  
    fs.unlinkSync(tempFilePath);  

    if (!imageUrl) {  
      if (react) await react('❌');  
      throw "*Failed to upload image to Catbox*";  
    }  

    // Remove background using remove.bg API  
    const apiForm = new FormData();  
    apiForm.append('image_url', imageUrl);  
    apiForm.append('size', 'auto');  

    const bgResponse = await axios.post("https://api.remove.bg/v1.0/removebg", apiForm, {  
      headers: {  
        ...apiForm.getHeaders(),  
        'X-Api-Key': 'BgqG6cjSQ2i2e2XVzjbXntda'  
      },  
      responseType: "arraybuffer"  
    });  

    if (!bgResponse || !bgResponse.data) {  
      if (react) await react('❌');  
      return reply("*Error: remove.bg API did not return a valid image.*");  
    }  

    const imageBuffer = Buffer.from(bgResponse.data, "binary");  

    await conn.sendMessage(m.chat, {  
      image: imageBuffer,  
      caption: `*Background removed successfully!*\n\n> © *Powered by Shadow-Xtech*`  
    });  

    // Set success reaction  
    if (react) await react('✅');  

  } catch (error) {  
    console.error("Rmbg Error:", error);  
    if (react) await react('❌');  
    reply(`*An error occurred: ${error.response?.data?.errors?.[0]?.title || error.message || "Unknown error"}*`);  
  }  
});