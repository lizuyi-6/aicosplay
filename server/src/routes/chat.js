const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Role = require('../models/Role');
const Message = require('../models/Message');
const fs = require('fs');
const path = require('path');

// Helper to convert local image URL to Base64 for AI API
function processImageUrl(url) {
    if (!url) return null;
    // Check if it's a local upload
    if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
        try {
            // Extract filename safely
            const filename = url.split('/uploads/').pop();
            const filePath = path.join(__dirname, '../../uploads', filename);

            if (fs.existsSync(filePath)) {
                const bitmap = fs.readFileSync(filePath);
                const ext = path.extname(filename).substring(1).toLowerCase();
                let mimeType = 'image/jpeg';
                if (ext === 'png') mimeType = 'image/png';
                if (ext === 'webp') mimeType = 'image/webp';
                if (ext === 'gif') mimeType = 'image/gif';

                const base64 = bitmap.toString('base64');
                return `data:${mimeType};base64,${base64}`;
            }
        } catch (e) {
            console.error('Error processing local image:', e);
            fs.appendFileSync('server_error.log', `[${new Date().toISOString()}] Image Process Error: ${e.message}\n`);
        }
    }
    // Return original if not local or failed
    return url;
}

// ... imports ...

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Memory storage for messages
global.memoryMessages = global.memoryMessages || [];

// POST chat with streaming
router.post('/', async (req, res) => {
    try {
        const { roleId, conversationId, message, imageUrl } = req.body;

        if (!roleId || !conversationId || (!message && !imageUrl)) {
            return res.status(400).json({ message: '缺少必填字段' });
        }

        let role;
        if (global.useMemoryDB) {
            role = (global.memoryRoles || []).find(r => r._id === roleId);
        } else {
            role = await Role.findById(roleId);
        }

        if (!role) {
            return res.status(404).json({ message: '角色不存在' });
        }

        // Get conversation history (last 20 messages)
        let history;
        if (global.useMemoryDB) {
            history = global.memoryMessages
                .filter(m => m.roleId === roleId && m.conversationId === conversationId)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .slice(-20);
        } else {
            history = await Message.find({ roleId, conversationId })
                .sort({ createdAt: 1 })
                .limit(20);
        }

        // Build messages array for API
        const messages = [
            { role: 'system', content: role.systemPrompt }
        ];

        // Add history
        for (const msg of history) {
            if (msg.imageUrl) {
                const base64Image = processImageUrl(msg.imageUrl);
                messages.push({
                    role: msg.role,
                    content: [
                        { type: 'text', text: msg.content },
                        { type: 'image_url', image_url: { url: base64Image } }
                    ]
                });
            } else {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            }
        }

        // Add current user message
        let userMessageContent = message || '请详细描述这张图片';
        if (imageUrl) {
            const base64Image = processImageUrl(imageUrl);
            // Force the model to pay attention to the image
            // If user provided text, append instruction to look at image
            // If empty, use strong default request
            const finalPrompt = message
                ? `${message}\n(请结合附带的图片进行回答)`
                : '请详细描述这张图片';

            userMessageContent = [
                { type: 'text', text: finalPrompt },
                { type: 'image_url', image_url: { url: base64Image } }
            ];
        }

        messages.push({ role: 'user', content: userMessageContent });

        // Save user message
        const timestamp = new Date();
        if (global.useMemoryDB) {
            global.memoryMessages.push({
                roleId,
                conversationId,
                role: 'user',
                content: message,
                imageUrl: imageUrl || null,
                createdAt: timestamp
            });
        } else {
            const userMessage = new Message({
                roleId,
                conversationId,
                role: 'user',
                content: message,
                imageUrl: imageUrl || null
            });
            await userMessage.save();
        }

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // Check if there are any images in the conversation (current or history)
        const hasImages = imageUrl || history.some(msg => msg.imageUrl);

        let modelToUse = MODEL;

        if (hasImages) {
            // 1. Switch to Vision Model
            // Check if current MODEL is already a VLM
            const isAlreadyVision = MODEL.includes('vl') || MODEL.includes('vision');
            if (!isAlreadyVision) {
                modelToUse = 'qwen-vl-plus'; // Revert to verified working model
                console.log(`[Model Switch] Detected images. Switching from ${MODEL} to ${modelToUse}`);
            }

            // 2. Fix for VL Models: Merge system prompt into user message
            // Most VL models reject distinct "system" role messages
            if (messages[0].role === 'system') {
                const systemPrompt = messages[0].content;
                messages.shift(); // Remove system message

                // Prepend to the last message (current user input)
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && lastMsg.role === 'user') {
                    if (Array.isArray(lastMsg.content)) {
                        const textPart = lastMsg.content.find(c => c.type === 'text');
                        if (textPart) {
                            textPart.text = `[Roleplay Instructions]: ${systemPrompt}\n\n${textPart.text}`;
                        }
                    } else {
                        lastMsg.content = `[Roleplay Instructions]: ${systemPrompt}\n\n${lastMsg.content}`;
                    }
                }
            }
        }

        // Stream response from OpenAI
        const stream = await openai.chat.completions.create({
            model: modelToUse,
            messages,
            stream: true,
            max_tokens: 2048
        });

        let fullResponse = '';

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullResponse += content;
                // Send SSE event
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        // Save assistant response
        if (global.useMemoryDB) {
            global.memoryMessages.push({
                roleId,
                conversationId,
                role: 'assistant',
                content: fullResponse,
                createdAt: new Date()
            });
        } else {
            const assistantMessage = new Message({
                roleId,
                conversationId,
                role: 'assistant',
                content: fullResponse
            });
            await assistantMessage.save();
        }

        // Send done event
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();

    } catch (error) {
        console.error('Chat error:', error);
        fs.appendFileSync('server_error.log', `[${new Date().toISOString()}] Chat API Error: ${error.message}\n`);
        if (error.response) {
            fs.appendFileSync('server_error.log', `Data: ${JSON.stringify(error.response.data)}\n`);
        }

        // If headers haven't been sent, send JSON error
        if (!res.headersSent) {
            return res.status(500).json({ message: '对话失败', error: error.message });
        }

        // Otherwise send SSE error
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// GET conversation history
router.get('/history/:roleId/:conversationId', async (req, res) => {
    try {
        const { roleId, conversationId } = req.params;

        if (global.useMemoryDB) {
            const messages = global.memoryMessages
                .filter(m => m.roleId === roleId && m.conversationId === conversationId)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return res.json(messages);
        }

        const messages = await Message.find({ roleId, conversationId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: '获取历史记录失败', error: error.message });
    }
});

// GET all conversations for a role
router.get('/conversations/:roleId', async (req, res) => {
    try {
        const { roleId } = req.params;

        if (global.useMemoryDB) {
            // Group by conversationId
            const groups = {};
            global.memoryMessages
                .filter(m => m.roleId === roleId)
                .forEach(m => {
                    if (!groups[m.conversationId]) {
                        groups[m.conversationId] = {
                            _id: m.conversationId,
                            lastMessage: m.content,
                            lastTime: m.createdAt
                        };
                    } else if (new Date(m.createdAt) > new Date(groups[m.conversationId].lastTime)) {
                        groups[m.conversationId].lastMessage = m.content;
                        groups[m.conversationId].lastTime = m.createdAt;
                    }
                });

            const conversations = Object.values(groups).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
            return res.json(conversations);
        }

        const conversations = await Message.aggregate([
            { $match: { roleId: require('mongoose').Types.ObjectId(roleId) } },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $last: '$content' },
                    lastTime: { $max: '$createdAt' }
                }
            },
            { $sort: { lastTime: -1 } }
        ]);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: '获取对话列表失败', error: error.message });
    }
});

module.exports = router;
