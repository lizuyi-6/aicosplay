require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
});

const logStream = fs.createWriteStream('result.log', { flags: 'w' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function testVL() {
    log('--- Probing Models ---');
    log('Base URL: ' + (process.env.OPENAI_BASE_URL || 'Default'));

    try {
        const list = await openai.models.list();
        log('Available Models: ' + list.data.map(m => m.id).join(', '));
    } catch (e) { log('List models failed: ' + e.message); }

    const candidates = ['qwen-vl-plus', 'qwen-vl-max', 'qwen3-vl-plus'];

    // 50x50 Red Dot PNG
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAVklEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Bw8n0AAd5m5+wAAAABJRU5ErkJggg==";

    for (const m of candidates) {
        log(`\nTesting Model: ${m}`);
        const messages = [
            {
                role: 'user',
                content: [
                    { type: 'text', text: 'Describe this color.' },
                    { type: 'image_url', image_url: { url: base64Image } }
                ]
            }
        ];

        try {
            const completion = await openai.chat.completions.create({
                model: m,
                messages: messages,
            });
            log(`✅ SUCCESS with ${m}`);
            log('Response: ' + completion.choices[0].message.content);
            return;
        } catch (error) {
            log(`❌ FAILED with ${m}: ${error.message}`);
            if (error.response) log('Data: ' + JSON.stringify(error.response.data));
        }
    }
    log('All candidates failed.');
}

testVL();
