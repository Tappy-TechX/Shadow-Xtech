const config = require("../config");

// ─────────────────────────────
// BASE FONT BUILDER
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

// ─────────────────────────────
// SMALL CAPS
// ─────────────────────────────
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
// FONT MAPS
// ─────────────────────────────
const FONT_MAPS = {
  // BASIC
  bold: buildMap(0x1D400, 0x1D41A, 0x1D7CE),
  italic: buildMap(0x1D434, 0x1D44E, null),
  bold_italic: buildMap(0x1D468, 0x1D482, null),

  script: buildMap(0x1D49C, 0x1D4B6, null),
  fraktur: buildMap(0x1D504, 0x1D51E, null),
  bold_fraktur: buildMap(0x1D56C, 0x1D586, null),
  double_struck: buildMap(0x1D538, 0x1D552, 0x1D7D8),

  // SANS
  sans: buildMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
  sans_bold: buildMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
  sans_italic: buildMap(0x1D608, 0x1D622, null),
  sans_bold_italic: buildMap(0x1D63C, 0x1D656, null),

  monospace: buildMap(0x1D670, 0x1D68A, 0x1D7F6),

  // DECORATIVE
  fullwidth: buildMap(0xFF21, 0xFF41, 0xFF10),
  small_caps: smallCaps(),

  // ─────────────────────────────
  // SUPERSCRIPT
  // ─────────────────────────────
  superscript: {
    a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ",
    f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ᶦ", j: "ʲ",
    k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ",
    p: "ᵖ", q: "ᑫ", r: "ʳ", s: "ˢ", t: "ᵗ",
    u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
    A: "ᴬ", B: "ᴮ", C: "ᶜ", D: "ᴰ", E: "ᴱ",
    F: "ᶠ", G: "ᴳ", H: "ᴴ", I: "ᴵ", J: "ᴶ",
    K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ", O: "ᴼ",
    P: "ᴾ", Q: "Q", R: "ᴿ", S: "ˢ", T: "ᵀ",
    U: "ᵁ", V: "ⱽ", W: "ᵂ", X: "ˣ", Y: "ʸ", Z: "ᶻ",
    0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴",
    5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹"
  },

  // ─────────────────────────────
  // SUBSCRIPT
  // ─────────────────────────────
  subscript: {
    a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ",
    k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ",
    p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ",
    v: "ᵥ", x: "ₓ",
    0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄",
    5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉"
  }
};

// ─────────────────────────────
// APPLY FONT
// ─────────────────────────────
function applyFont(text) {
  const style = config.AUTO_FONT;
  if (!style || style === "off") return text;

  const map = FONT_MAPS[style];
  if (!map) return text;

  return [...text]
    .map(ch => map[ch] || ch)
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