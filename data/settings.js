const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../data");
const file = path.join(dir, "settings.json");

// ensure folder exists
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

let cache = null;

function load() {
    if (cache) return cache;

    if (!fs.existsSync(file)) {
        const init = { global: {}, users: {} };
        fs.writeFileSync(file, JSON.stringify(init, null, 2));
        cache = init;
        return cache;
    }

    cache = JSON.parse(fs.readFileSync(file));
    return cache;
}

function save(data) {
    cache = data;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 🔥 GLOBAL SETTINGS
function getGlobal(key) {
    return load().global[key];
}

// 🔥 SELF-HEALING SET (IMPORTANT FIX)
function setGlobal(key, value) {
    const db = load();
    db.global[key] = value;
    save(db);
}

// USER SETTINGS
function getUser(jid, key) {
    return load().users?.[jid]?.[key];
}

function setUser(jid, key, value) {
    const db = load();
    if (!db.users[jid]) db.users[jid] = {};
    db.users[jid][key] = value;
    save(db);
}

module.exports = {
    getGlobal,
    setGlobal,
    getUser,
    setUser
};
