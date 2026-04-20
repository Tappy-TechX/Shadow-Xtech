const config = require("../config");

// ─────────────────────────────
// FONT BUILDER
// ─────────────────────────────
function buildMap(upperBase, lowerBase, digitBase) {
  const map = {};

  for (let i = 0; i < 26; i++) {
    const U = String.fromCharCode(65 + i);
    const L = String.fromCharCode(97 + i);

    map[U] = String.fromCodePoint(upperBase + i);
    map[L] = String.fromCodePoint(lowerBase + i);
  }

  if (digitBase !== null) {
    for (let i = 0; i < 10; i++) {
      map[String.fromCharCode(48 + i)] =
        String.fromCodePoint(digitBase + i);
    }
  }

  return map;
}

// SMALL CAPS
const SMALL = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ";

function smallCaps() {
  const m = {};
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(65 + i)] = SMALL[i];
    m[String.fromCharCode(97 + i)] = SMALL[i];
  }
  return m;
}

// ─────────────────────────────
// FONTS
// ─────────────────────────────
const FONT_MAPS = {
  bold: buildMap(0x1D400, 0x1D41A, 0x1D7CE),
  italic: buildMap(0x1D434, 0x1D44E, null),
  bold_italic: buildMap(0x1D468, 0x1D482, null),
  script: buildMap(0x1D49C, 0x1D4B6, null),
  fraktur: buildMap(0x1D504, 0x1D51E, null),
  double_struck: buildMap(0x1D538, 0x1D552, 0x1D7D8),
  sans: buildMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
  monospace: buildMap(0x1D670, 0x1D68A, 0x1D7F6),
  fullwidth: buildMap(0xFF21, 0xFF41, 0xFF10),
  small_caps: smallCaps()
};

// ─────────────────────────────
// APPLY FONT
// ─────────────────────────────
function applyFont(text) {
  const style = config.AUTO_FONT;

  if (!style || style === "off") return text;
  if (!FONT_MAPS[style]) return text;

  const map = FONT_MAPS[style];

  return [...text]
    .map((ch) => map[ch] || ch)
    .join("");
}

// ─────────────────────────────
// GLOBAL MESSAGE TRANSFORM
// ─────────────────────────────
function transformMessage(obj) {
  if (!obj) return obj;

  const style = config.AUTO_FONT;
  if (!style || style === "off") return obj;

  const clone = JSON.parse(JSON.stringify(obj));

  const walk = (o) => {
    if (!o) return;

    for (const key in o) {
      if (typeof o[key] === "string") {
        if (
          ["text", "caption", "title", "body", "description"].includes(key)
        ) {
          o[key] = applyFont(o[key]);
        }
      } else if (typeof o[key] === "object") {
        walk(o[key]);
      }
    }
  };

  walk(clone);
  return clone;
}

// ─────────────────────────────
// CONFIG CONTROL
// ─────────────────────────────
function setFontStyle(style) {
  config.AUTO_FONT = style;
}

function getFontStyle() {
  return config.AUTO_FONT;
}

module.exports = {
  applyFont,
  transformMessage,
  setFontStyle,
  getFontStyle,
  FONT_MAPS
};
