const { cmd } = require('../command');    
const config = require("../config");    

// Full bad words list
const badWords = [
  // English swear words
  "fuck", "f*ck", "f#ck", "fuk", "fck", "shit", "sh*t", "sh1t", "damn", "hell", "asshole", "a**hole",
  "bitch", "b*tch", "b i t c h", "bastard", "cock", "c*ck", "pussy", "p*ssy",

  // Sexual / NSFW words
  "sex", "s3x", "s*x", "s#x", "porn", "p0rn", "nude", "n00d", "dick", "d1ck", "boobs", "b00bs",
  "horny", "slut", "whore",

  // Insults / general abuse
  "idiot", "moron", "stupid", "loser", "dumb", "retard",

  // Short forms / acronyms
  "wtf", "omg", "lmao",

  // Local slurs
  "huththa", "pakaya", "ponnaya", "hutto", "mia",

  // Misc variations
  "phuck", "fk", "shyt", "sh1t", "f u c k", "s e x"
];

// Common leet/symbol replacements
const normalizationMap = {
  '4': 'a',
  '@': 'a',
  '3': 'e',
  '1': 'i',
  '!': 'i',
  '0': 'o',
  '$': 's',
  '5': 's',
  '+': 't',
  '*': ''
};

// Normalize message: lowercase, replace symbols, remove spaces
function normalizeText(text) {
  return text
    .toLowerCase()
    .split('')
    .map(char => normalizationMap[char] || char)
    .join('')
    .replace(/\s+/g, '')   // remove spaces
    .replace(/[^a-z]/g, ''); // remove any remaining non-letters
}

// Anti-Bad Words System
cmd({    
  'on': "body"    
}, async (conn, m, store, {    
  from,    
  body,    
  isGroup,    
  isAdmins,    
  isBotAdmins,    
  reply    
}) => {    
  try {    
    if (!isGroup || isAdmins || !isBotAdmins) return;    

    const normalizedMessage = normalizeText(body);
    const containsBadWord = badWords.some(word => normalizeText(word).length > 0 && normalizedMessage.includes(normalizeText(word)));    

    if (containsBadWord && config.ANTI_BAD_WORD === "true") {    
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });    
      await conn.sendMessage(from, { 'text': "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { 'quoted': m });    
    }    
  } catch (error) {    
    console.error(error);    
    reply("An error occurred while processing the message.");    
  }    
});