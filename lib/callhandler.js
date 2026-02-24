const settingsManager = require('./settingsmanager');

module.exports = (conn) => {

    conn.ev.on('call', async (callData) => {

        if (!settingsManager.getSetting("ANTICALL")) {
            console.log("[ANTICALL] Feature OFF.");
            return;
        }

        const action = settingsManager.getSetting("ANTICALL_ACTION") || "reject";
        const message = settingsManager.getSetting("ANTICALL_MESSAGE") || 
        "🚫 *Auto Call Rejection!*\n\nPlease do not call this bot.";

        for (const call of callData) {

            if (call.status === 'offer') {

                const callerId = call.from;

                // Always reject first
                await conn.rejectCall(call.id, callerId);

                // If action = block
                if (action === "block") {
                    await conn.updateBlockStatus(callerId, "block");
                    console.log(`[ANTICALL] Blocked ${callerId}`);
                }

                // Send custom message
                await conn.sendMessage(callerId, { text: message });

                console.log(`[ANTICALL] ${action.toUpperCase()} call from ${callerId}`);
            }
        }
    });

    console.log("[ANTICALL] Advanced call handler loaded.");
};
