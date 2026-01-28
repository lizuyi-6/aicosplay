const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // URL to the avatar image
        default: ''
    },
    personality: {
        type: String, // Short description like "温柔体贴", "高冷傲娇"
        required: true
    },
    description: {
        type: String, // Detailed background story
        required: true
    },
    systemPrompt: {
        type: String, // The actual prompt sent to the AI
        required: true
    },
    userId: {
        type: String, // Cookie-based User ID
        index: true
    },
    isSystem: {
        type: Boolean, // If true, visible to everyone
        default: false
    },
    backgroundSvg: { // AI-generated unique SVG background
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', roleSchema);
