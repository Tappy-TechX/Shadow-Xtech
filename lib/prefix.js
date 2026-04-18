const fs = require('fs');
const path = require('path');

// Path to prefix storage
const PREFIX_FILE = path.join(__dirname, 'prefix.json');

// Default prefix
const DEFAULT_PREFIX = '.';
const NO_PREFIX = 'none';

// Ensure file exists
if (!fs.existsSync(PREFIX_FILE)) {
  fs.writeFileSync(
    PREFIX_FILE,
    JSON.stringify({ prefix: DEFAULT_PREFIX }, null, 2)
  );
}

// Read prefix from file
function getRawPrefix() {
  try {
    const raw = fs.readFileSync(PREFIX_FILE, 'utf8');
    if (!raw.trim()) throw new Error('Empty file');

    const data = JSON.parse(raw);
    return data.prefix || DEFAULT_PREFIX;
  } catch (err) {
    fs.writeFileSync(
      PREFIX_FILE,
      JSON.stringify({ prefix: DEFAULT_PREFIX }, null, 2)
    );
    return DEFAULT_PREFIX;
  }
}

// Get usable prefix
function getPrefix() {
  const raw = getRawPrefix();
  return raw === NO_PREFIX ? '' : raw;
}

// Set prefix
function setPrefix(newPrefix) {
  try {
    const value =
      newPrefix === '' || newPrefix.toLowerCase() === NO_PREFIX
        ? NO_PREFIX
        : newPrefix;

    if (value !== NO_PREFIX && value.length > 3) return false;

    fs.writeFileSync(
      PREFIX_FILE,
      JSON.stringify({ prefix: value }, null, 2)
    );

    return true;
  } catch (err) {
    console.error('Prefix set error:', err);
    return false;
  }
}

// Reset prefix
function resetPrefix() {
  try {
    fs.writeFileSync(
      PREFIX_FILE,
      JSON.stringify({ prefix: DEFAULT_PREFIX }, null, 2)
    );
    return true;
  } catch (err) {
    console.error('Prefix reset error:', err);
    return false;
  }
}

// Check prefixless mode
function isPrefixless() {
  return getRawPrefix() === NO_PREFIX;
}

module.exports = {
  getPrefix,
  getRawPrefix,
  setPrefix,
  resetPrefix,
  isPrefixless,
  DEFAULT_PREFIX,
  NO_PREFIX,
};
