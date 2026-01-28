const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:3000/api';

async function run() {
    try {
        console.log('1. Fetching Roles...');
        const rolesRes = await axios.get(`${API_BASE}/roles`);
        const roles = rolesRes.data;
        if (roles.length === 0) throw new Error('No roles found');
        const roleId = roles[0]._id;
        console.log(`   Using Role: ${roles[0].name} (${roleId})`);

        console.log('2. Creating Test Image...');
        const imagePath = path.join(__dirname, 'test_pixel.png');
        const base64Data = "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAVklEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Bw8n0AAd5m5+wAAAABJRU5ErkJggg==";
        fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'));

        console.log('3. Uploading Image...');
        const form = new FormData();
        form.append('image', fs.createReadStream(imagePath));

        const uploadRes = await axios.post(`${API_BASE}/upload`, form, {
            headers: { ...form.getHeaders() }
        });
        const imageUrl = uploadRes.data.imageUrl;
        console.log(`   Upload Success! URL: ${imageUrl}`);

        console.log('4. Sending Chat Message...');
        // Need conversationId? Chat API requires it? 
        // chat.js: const { roleId, conversationId, message, imageUrl } = req.body;
        // If not provided, should I generate one? 
        // Client generates one usually. I'll mock it.
        const conversationId = 'test_conv_' + Date.now();

        const chatPayload = {
            roleId,
            conversationId,
            message: 'What color is this image?',
            imageUrl
        };

        // Note: chat API uses SSE streaming if handled by client logic, but here strict POST returns stream?
        // My server code: `res.write(...)`. 
        // Axios might buffer or error on stream if not handled?
        // But the first chunk might arrive.
        // I'll use responseType: 'stream' to handle SSE.

        const chatRes = await axios.post(`${API_BASE}/chat`, chatPayload, {
            responseType: 'stream'
        });

        console.log('   Chat Request Sent. Reading stream...');

        chatRes.data.on('data', (chunk) => {
            const str = chunk.toString();
            console.log(`   Received Chunk: ${str.trim()}`);
            if (str.includes('"error"')) {
                console.error('SERVER RETURNED ERROR EVENT');
            }
        });

        chatRes.data.on('end', () => {
            console.log('   Stream Ended.');
        });

    } catch (e) {
        console.error('❌ Test Failed:', e.message);
        if (e.response) {
            console.error('   Status:', e.response.status);
            console.error('   Data:', e.response.data);
            if (e.response.data && e.response.data.on) {
                // If data is stream
                e.response.data.on('data', d => console.error('   Stream Error Data:', d.toString()));
            }
        }
    }
}

run();
