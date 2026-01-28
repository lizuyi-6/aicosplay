const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { generateBackgroundSvg } = require('../services/svgGenerator');

// Memory storage
global.memoryRoles = global.memoryRoles || [];

// Helper: Generate ID for memory items
const generateId = () => Math.random().toString(36).substr(2, 9);

// GET all roles (User's private roles + System roles)
router.get('/', async (req, res) => {
    try {
        if (global.useMemoryDB) {
            // Memory DB filtering (simplified)
            return res.json(global.memoryRoles.filter(r => r.isSystem || r.userId === req.userId)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }

        // MongoDB filtering
        const roles = await Role.find({
            $or: [
                { userId: req.userId },
                { isSystem: true }
            ]
        }).sort({ createdAt: -1 }); // Newest first

        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: '获取角色列表失败', error: error.message });
    }
});

// GET single role by ID
router.get('/:id', async (req, res) => {
    try {
        if (global.useMemoryDB) {
            const role = global.memoryRoles.find(r => r._id === req.params.id);
            if (!role) return res.status(404).json({ message: '角色不存在' });
            return res.json(role);
        }
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: '角色不存在' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: '获取角色失败', error: error.message });
    }
});

// POST create new role
router.post('/', async (req, res) => {
    try {
        const { name, avatar, personality, description, systemPrompt } = req.body;

        if (!name || !personality || !description) {
            return res.status(400).json({ message: '缺少必填字段' });
        }

        // Auto-generate system prompt if not provided
        const finalSystemPrompt = systemPrompt ||
            `你现在扮演一个名为"${name}"的角色。\n性格特点：${personality}\n背景故事：${description}\n\n请始终保持这个角色的人设进行对话，用第一人称回复。`;

        // Generate unique AI background
        const backgroundSvg = await generateBackgroundSvg(name, personality, description);

        if (global.useMemoryDB) {
            const newRole = {
                _id: generateId(),
                name,
                avatar: avatar || '',
                personality,
                description,
                systemPrompt: finalSystemPrompt,
                userId: req.userId,
                backgroundSvg,
                createdAt: new Date()
            };
            global.memoryRoles.unshift(newRole);
            return res.status(201).json(newRole);
        }

        const role = new Role({
            name,
            avatar: avatar || '',
            personality,
            description,
            systemPrompt: finalSystemPrompt,
            userId: req.userId,
            backgroundSvg
        });

        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(500).json({ message: '创建角色失败', error: error.message });
    }
});

// PUT update role
router.put('/:id', async (req, res) => {
    try {
        const { name, avatar, personality, description, systemPrompt } = req.body;

        if (global.useMemoryDB) {
            const index = global.memoryRoles.findIndex(r => r._id === req.params.id);
            if (index === -1) return res.status(404).json({ message: '角色不存在' });

            global.memoryRoles[index] = { ...global.memoryRoles[index], name, avatar, personality, description, systemPrompt };
            return res.json(global.memoryRoles[index]);
        }

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, avatar, personality, description, systemPrompt },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ message: '角色不存在' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: '更新角色失败', error: error.message });
    }
});

// DELETE role
router.delete('/:id', async (req, res) => {
    try {
        if (global.useMemoryDB) {
            const initialLength = global.memoryRoles.length;
            global.memoryRoles = global.memoryRoles.filter(r => r._id !== req.params.id);
            if (global.memoryRoles.length === initialLength) return res.status(404).json({ message: '角色不存在' });
            return res.json({ message: '角色已删除' });
        }

        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: '角色不存在' });
        }
        res.json({ message: '角色已删除' });
    } catch (error) {
        res.status(500).json({ message: '删除角色失败', error: error.message });
    }
});

module.exports = router;
