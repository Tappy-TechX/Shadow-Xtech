const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "antiedit_db.json");

function loadDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(
            DB_PATH,
            JSON.stringify(
                {
                    settings: {
                        antiEdit: true
                    },
                    messages: {}
                },
                null,
                2
            )
        );
    }

    return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getDB() {
    return loadDB();
}

function updateDB(data) {
    saveDB(data);
}

module.exports = {
    DB_PATH,
    getDB,
    updateDB
};