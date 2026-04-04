const { cmd } = require("../command");
const axios = require("axios");
const { sendButtons } = require("gifted-btns");

// Quoted contact for button context
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: "⚙️ Channel | Info 🚀",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:SCIFI
ORG:Shadow-Xtech BOT;
TEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001
END:VCARD`,
    },
  },
};

// Helper: WhatsApp readmore
const generateReadMore = (text, maxLength = 200) => {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return `\n\n📄 *Description:*\n${trimmed}`;
  const visible = trimmed.slice(0, maxLength);
  const hidden = trimmed.slice(maxLength);
  const readmore = "\u200B".repeat(4000); // triggers WhatsApp "Read More"
  return `\n\n📄 *Description:*\n${visible}${readmore}${hidden}`;
};

cmd(
  {
    pattern: "cid",
    alias: ["newsletter", "id"],
    react: "📡",
    desc: "Get WhatsApp Channel info from link",
    category: "whatsapp",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply, sender, GiftedTechApi, GiftedApiKey, react }) => {
    try {
      const input = q?.trim();
      if (!input) {
        await react("❌");
        return reply(
          `❌ Provide a channel link.\nUsage: *cid* https://whatsapp.com/channel/KEY`
        );
      }

      const channelMatch = input.match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
      if (!channelMatch) {
        await react("❌");
        return reply(
          "❌ Invalid channel link. Provide a valid WhatsApp channel link.\nExample: https://whatsapp.com/channel/ABC123"
        );
      }

      await react("🔍");
      const inviteKey = channelMatch[1];
      const channelUrl = `https://whatsapp.com/channel/${inviteKey}`;

      // Fetch channel metadata
      const meta = await Gifted.newsletterMetadata("invite", inviteKey);
      if (!meta || !meta.id) {
        await react("❌");
        return reply("❌ Could not fetch channel info. The link may be invalid or the channel no longer exists.");
      }

      const channelJid = meta.id;
      const tm = meta.thread_metadata || {};
      const name = tm.name?.text || "Unknown Channel";
      const rawDesc = tm.description?.text || "";
      const verification = tm.verification || "";
      const isVerified = verification === "VERIFIED";
      const stateType = meta.state?.type || "";
      const isActive = stateType === "ACTIVE";
      const subCount = parseInt(tm.subscribers_count || "0", 10);
      const followers =
        subCount >= 1_000_000
          ? `${(subCount / 1_000_000).toFixed(1)}M`
          : subCount >= 1_000
          ? `${(subCount / 1_000).toFixed(1)}K`
          : subCount > 0
          ? subCount.toLocaleString()
          : "N/A";

      // Fetch channel picture via API
      let picUrl = null;
      try {
        const apiUrl = `${GiftedTechApi}/api/stalk/wachannel?apikey=${GiftedApiKey}&url=${encodeURIComponent(channelUrl)}`;
        const apiRes = await axios.get(apiUrl, { timeout: 10000 });
        picUrl = apiRes.data?.result?.img || null;
      } catch (apiErr) {
        console.error("cid pic error:", apiErr.message);
      }

      const descSection = generateReadMore(rawDesc);

      const text =
        `📢 *Channel Info*\n\n` +
        `🔖 *Name:* ${name}\n` +
        `🟢 *Status:* ${isActive ? "Active" : stateType || "Unknown"}\n` +
        `${isVerified ? "✅ *Verified:* Yes\n" : "❌ *Verified:* No\n"}` +
        `👥 *Followers:* ${followers}\n` +
        `🆔 *JID:* \`${channelJid}\`` +
        descSection;

      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "🏷️ Copy JID",
            copy_code: channelJid,
          }),
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🌐 Follow Channel",
            url: channelUrl,
            merchant_url: channelUrl,
          }),
        },
      ];

      const sendOpts = {
        text,
        footer: "> Powered By Shadow-Xtech",
        buttons,
        quoted: quotedContact,
      };

      if (picUrl) {
        sendOpts.image = { url: picUrl };
      }

      await sendButtons(conn, from, sendOpts);
      await react("✅");
    } catch (error) {
      console.error("cid error:", error);
      await react("❌");
      await reply(`❌ Error fetching channel info: ${error.message}`);
    }
  }
);