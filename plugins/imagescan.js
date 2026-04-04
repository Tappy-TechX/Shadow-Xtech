const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "imagescan",
  alias: ["scanimg", "analyzeimg"],
  react: '🔍',
  desc: "Scan and analyze images using AI",
  category: "utility",
  use: ".imagescan [reply to image]",
  filename: __filename
}, async (client, message, { reply, react, quoted }) => {
  try {
    if (react) await react('♻️'); // Loading reaction

    const quotedMsg = quoted || message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.startsWith('image/')) {
      if (react) await react('❌');
      return reply("*Please reply to an image file (JPEG/PNG)*");
    }

    const mediaBuffer = await quotedMsg.download();

    // Prepare FormData for Image Describer API
    const form = new FormData();
    form.append("image", mediaBuffer, "image.jpg");
    form.append("prompt", "Describe what is happening in this image");

    const descResponse = await axios.post(
      "https://imagedescriber.online/api/openapi-v2/describe-image",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer LUflpvk003W5d4Rud4BZ8Wx5pseladzs6AeyUhpkQIOI+h4WluSvPgLsYyj0v5nZjfqvlvAIOCmIfguN5HageUU5wtO1r1CuOIDJMrVXYvXJT3T3wgE5u7IhBaPbMMAcgZePxxiXm3AsAXWLTKXicHK/rRiHM2oE2SdgQaBkQUlpOJcusU9fUNM=`
        }
      }
    );

    if (!descResponse.data || !descResponse.data.data) {
      if (react) await react('❌');
      return reply("*Error: Failed to analyze image*");
    }

    if (react) await react('✅'); // Success reaction

    const description = descResponse.data.data.content || "No description available";
    await reply(`🔍 *Image Analysis Results*\n\n${description}\n\n> © Powered by Shadow-Xtech`);

  } catch (error) {
    console.error('Image Scan Error:', error);
    if (react) await react('❌');
    await reply(`*🔴 Error: ${error.message || error}*`);
  }
});