const { cmd } = require('../command');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

cmd({
    pattern: "topdf",
    alias: ["pdf"],
    use: '.topdf',
    desc: "Convert provided text to a PDF file with customizable font, color, alignment, and optional filename.",
    react: "📄",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) 
            return reply("*📌 Please provide the text to convert. Example: .topdf Your text here | size=16 | color=#0000FF | align=center | name=MyPDF*");

        // Default options
        let fontSize = 14;
        let fontColor = '#000000';
        let align = 'left';
        let fileName = 'ShadowAI.pdf'; // Default PDF name

        // Parse options (using | as separator)
        const parts = q.split('|').map(p => p.trim());
        const text = parts[0]; // main text

        for (let i = 1; i < parts.length; i++) {
            if (parts[i].startsWith('size=')) fontSize = parseInt(parts[i].split('=')[1]) || fontSize;
            if (parts[i].startsWith('color=')) fontColor = parts[i].split('=')[1] || fontColor;
            if (parts[i].startsWith('align=')) {
                const val = parts[i].split('=')[1];
                if (['left','center','right','justify'].includes(val)) align = val;
            }
            if (parts[i].startsWith('name=')) {
                const val = parts[i].split('=')[1];
                if (val) fileName = val.endsWith('.pdf') ? val : `${val}.pdf`;
            }
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName,
                caption: `📄 PDF created successfully!\n> © Created by Shadow-Xtech 💜`
            }, { quoted: mek });
        });

        // Add title
        doc.fontSize(fontSize + 6).fillColor(fontColor).text("📄 SHADOW-XTECH PDF", { align: 'center' });
        doc.moveDown(1);

        // Add main text
        doc.fontSize(fontSize).fillColor(fontColor).text(text, { align, lineGap: 4 });

        doc.end();

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});