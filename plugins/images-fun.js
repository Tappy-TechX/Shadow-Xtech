const config = require('../config')
const axios = require('axios');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fs = require('fs');
var imgmsg = "*Give me a anime name !*"
var descgs = "It gives details of given anime name."
var cants = "I cant find this anime."

//--------------------------------------------------------
cmd({  
    pattern: "garl",  
    alias: ["imgloli"],  
    react: '😎',  
    desc: "Download anime loli images.",  
    category: "anime",  
    use: '.loli',  
    filename: __filename  
},  
async (conn, mek, m, { from, reply }) => {  
    try {  

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });  

        // 📡 Fetch loli image
        let res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon');  

        let wm = `*😎 Random Garl Image*\n\n> *© Powered By Shadow-Xtech*`;  

        // 📤 Send image
        await conn.sendMessage(from, { 
            image: { url: res.data.data[0].urls.original }, 
            caption: wm
        }, { quoted: mek });  

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });  

    } catch (e) {  
        console.log(e);  

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });  

        reply(`*🔴 Error Fetching Loli Image: ${e.message}*`);  
    }  
});

//--------------------------------------------------------
cmd({  
    pattern: "waifu",  
    alias: ["imgwaifu"],  
    react: '💫',  
    desc: "Download anime waifu images.",  
    category: "anime",  
    use: '.waifu',  
    filename: __filename  
},  
async (conn, mek, m, { from, reply }) => {  
    try {  

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });  

        // 📡 Fetch waifu image
        let res = await axios.get('https://api.waifu.pics/sfw/waifu');  

        let wm = `*🩵 Random Waifu Image*\n\n> *© Powered By Shadow-Xtech*`;  

        // 📤 Send image
        await conn.sendMessage(from, { 
            image: { url: res.data.url }, 
            caption: wm
        }, { quoted: mek });  

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });  

    } catch (e) {  
        console.log(e);  

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });  

        reply(`*🔴 Error Fetching Waifu Image: ${e.message}*`);  
    }  
});

//--------------------------------------------------------
cmd({  
    pattern: "neko",  
    alias: ["imgneko"],  
    react: '💫',  
    desc: "Download anime neko images.",  
    category: "anime",  
    use: '.neko',  
    filename: __filename  
},  
async (conn, mek, m, { from, reply }) => {  
    try {  

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });  

        // 📡 Fetch neko image
        let res = await axios.get('https://api.waifu.pics/sfw/neko');  

        let wm = `*🩷 Random Neko image*\n\n> *© Powered By Shadow-Xtech*`;  

        // 📤 Send image
        await conn.sendMessage(from, { 
            image: { url: res.data.url }, 
            caption: wm
        }, { quoted: mek });  

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });  

    } catch (e) {  
        console.log(e);  

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });  

        reply(`*🔴 Error Fetching Neko Image: ${e.message}*`);  
    }  
});
  
//--------------------------------------------------------
cmd({  
    pattern: "megumin",  
    alias: ["imgmegumin"],  
    react: '💕',  
    desc: "Download anime megumin images.",  
    category: "anime",  
    use: '.megumin',  
    filename: __filename  
},  
async(conn, mek, m,{ from, reply }) => {  
    try {  

        // ♻️ Loading reaction  
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });  

        // 📡 Fetch random megumin image  
        let res = await axios.get('https://api.waifu.pics/sfw/megumin');  

        let wm = `*❤️‍🔥 Random Megumin Image*\n\n> *© Powered By Shadow-Xtech*`;  

        // 📤 Send image  
        await conn.sendMessage(from, { 
            image: { url: res.data.url }, 
            caption: wm
        }, { quoted: mek });  

        // ✅ Success reaction  
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });  

    } catch (e) {  
        console.log(e);  

        // ❌ Error reaction  
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });  

        reply(`*🔴 Error Fetching Megumin Image: ${e.message}*`);  
    }  
});

//--------------------------------------------------------
cmd({
    pattern: "maid",
    alias: ["imgmaid"],
    react: '💫',
    desc: "Download anime maid images.",
    category: "anime",
    use: '.maid',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        // 📡 Fetch random maid image
        let res = await axios.get('https://api.waifu.im/search/?included_tags=maid');

        let wm = `*😎 Random Maid Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, { 
            image: { url: res.data.images[0].url }, 
            caption: wm
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Maid Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "awoo",
    alias: ["imgawoo"],
    react: '😎',
    desc: "Download anime awoo images.",
    category: "anime",
    use: '.awoo',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        // 📡 Fetch random awoo image
        let res = await axios.get('https://api.waifu.pics/sfw/awoo');

        let wm = `*😎 Random Awoo Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, { 
            image: { url: res.data.url }, 
            caption: wm
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Awoo Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "shinobu",
    desc: "Fetch a random Shinobu image.",
    category: "anime",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        // 📡 Fetch Shinobu image
        const apiUrl = "https://api.waifu.pics/sfw/shinobu";
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🌸Random Shinobu Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Shinobu Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl1",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl2",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl3",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl4",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "animegirl5",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, { 
            react: { text: "♻️", key: mek.key } 
        });

        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: data.url },
            caption: `*🩷 Random Animegirl Image*\n\n> *© Powered By Shadow-Xtech*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { 
            react: { text: "✅", key: mek.key } 
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { 
            react: { text: "❌", key: mek.key } 
        });

        reply(`*🔴 Error Fetching Anime Girl Image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime1",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime2",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime3",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime4",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "anime5",
    desc: "Get random anime image",
    category: "anime",
    react: "⛱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🔄 Loading reaction
        await conn.sendMessage(from, { react: { text: "♻️", key: mek.key } });

        // 📡 Fetch random anime image
        const res = await axios.get("https://api.waifu.pics/sfw/waifu");

        let dec = `*🩷 Random Anime Image*\n\n> *© Powered By Shadow-Xtech*`;

        // 📤 Send image
        await conn.sendMessage(from, {
            image: { url: res.data.url },
            caption: dec
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });

        reply(`*🔴 Error fetching anime image: ${e.message}*`);
    }
});

//--------------------------------------------------------
cmd({
    pattern: "dog",
    desc: "Fetch a random dog image.",
    category: "fun",
    react: "🐶",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // ♻️ Loading reaction
        await conn.sendMessage(from, {
            react: { text: "♻️", key: mek.key }
        });

        const apiUrl = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 📤 Send dog image with NEW caption
        await conn.sendMessage(from, {
            image: { url: data.message },
            caption: `*🐶 Random Dog Image*\n\n> © Powered By Shadow-Xtech`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.log(e);

        // ❌ Error reaction
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        reply(`*🔴 Error fetching dog image: ${e.message}*`);
    }
});