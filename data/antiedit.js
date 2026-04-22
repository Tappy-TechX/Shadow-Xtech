const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

const AntiEditDB = DATABASE.define('AntiEdit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: 1,
    },
    gc_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    dm_status: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    tableName: 'antiedit',
    timestamps: false,
    hooks: {
        beforeCreate: r => r.id = 1,
        beforeBulkCreate: rs => rs.forEach(r => r.id = 1),
    },
});

let init = false;

async function initializeAntiEditSettings() {
    if (init) return;

    await AntiEditDB.sync();

    await AntiEditDB.findOrCreate({
        where: { id: 1 },
        defaults: { gc_status: false, dm_status: false },
    });

    init = true;
}

// set
async function setAnti(type, status) {
    await initializeAntiEditSettings();

    const data = await AntiEditDB.findByPk(1);

    if (type === "gc") data.gc_status = status;
    if (type === "dm") data.dm_status = status;

    await data.save();
    return true;
}

// get
async function getAnti(type) {
    await initializeAntiEditSettings();

    const data = await AntiEditDB.findByPk(1);

    return type === "gc" ? data.gc_status : data.dm_status;
}

// all
async function getAllAntiEditSettings() {
    await initializeAntiEditSettings();

    const data = await AntiEditDB.findByPk(1);

    return {
        gc_status: data.gc_status,
        dm_status: data.dm_status
    };
}

module.exports = {
    AntiEditDB,
    initializeAntiEditSettings,
    setAnti,
    getAnti,
    getAllAntiEditSettings
};