const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: {
        type: String, // User ID from cookie
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    conversationId: {
        type: String, // Unique ID for each conversation session
        required: true
    },
    role: {
        type: String, // 'user' or 'assistant'
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String, // Optional: URL to attached image
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying - now includes userId for isolation
messageSchema.index({ userId: 1, roleId: 1, conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
