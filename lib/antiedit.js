const { loadMessage } = require("./store");

async function handleEdit(conn, updates) {
    for (const update of updates) {
        console.log(
            "ANTI EDIT RAW UPDATE:\n",
            JSON.stringify(update, null, 2)
        );

        const stored = loadMessage(update.key?.id);

        if (stored) {
            console.log(
                "STORED ORIGINAL MESSAGE:\n",
                JSON.stringify(stored.message, null, 2)
            );
        } else {
            console.log("NO STORED MESSAGE FOUND FOR:", update.key?.id);
        }
    }
}

module.exports = { handleEdit };
