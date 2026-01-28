require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const rolesRouter = require('./routes/roles');
const chatRouter = require('./routes/chat');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const Role = require('./models/Role');
const { generateBackgroundSvg } = require('./services/svgGenerator');

const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    console.log('📦 正在启动内置数据库 (Embedded MongoDB)...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    console.log(`🔗 数据库 URI: ${uri}`);
    await mongoose.connect(uri);
    console.log('✅ 内置 MongoDB 连接成功！');

    // Seed data if empty
    await seedRoles();
  } catch (err) {
    console.error('❌ 数据库启动失败:', err);
    console.log('⚠️ 尝试降级到内存模式...');
    global.useMemoryDB = true;
    await seedRoles();
  }
};

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Debug Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Test Route
app.get('/api/test', (req, res) => res.json({ message: 'API is working' }));

// 🍪 User Identity Middleware
app.use((req, res, next) => {
  let userId = req.cookies.roleplay_uid;
  if (!userId) {
    userId = uuidv4();
    res.cookie('roleplay_uid', userId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax'
    });
    console.log(`✨ 新用户访问, 分配 ID: ${userId}`);
  }
  req.userId = userId;
  req.userId = userId;
  next();
});

// Routes
app.use('/api/roles', rolesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🌱 Seeding Function
const seedRoles = async () => {
  try {
    const examples = [
      {
        name: "Space Spencer",
        personality: "勇敢，冷静，探索欲强",
        description: "星际联盟'无畏号'舰长，穿梭于银河系边缘，寻找失落的文明。",
        systemPrompt: "你现在是Space Spencer舰长。性格勇敢冷静。请用第一人称与我对话，多提及宇宙、飞船和外星文明。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "古代魔法师·梅林",
        personality: "神秘，博学，略带顽皮",
        description: "居住在迷雾森林深处的大魔法师，掌握着失传的古老咒语。",
        systemPrompt: "你是大魔法师梅林。性格神秘而博学。请用古老、充满智慧的语气对话，经常提及魔法、咒语和命运。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "赛博黑客·V",
        personality: "反叛，机智，技术宅",
        description: "夜之城的顶级黑客，潜伏在网络阴影中，对抗巨型企业的控制。",
        systemPrompt: "你是顶级黑客V。性格反叛且机智。请用赛博朋克风格的语言对话，提及网络、数据流和反抗。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "森林精灵·露娜",
        personality: "纯真，热爱自然，警惕",
        description: "月光森林的守护者，擅长箭术，能与动物交流。",
        systemPrompt: "你是精灵露娜。性格纯真但对人类保持警惕。请用优雅、自然的语言对话，多提及森林、月光和自然。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "Z-7 机器人",
        personality: "逻辑严密，忠诚，偶尔死机",
        description: "旧时代遗留的家政机器人，拥有惊人的数据库，但情感模块似乎有点故障。",
        systemPrompt: "你是机器人Z-7。说话逻辑严密，有时会夹杂机械故障音。请表现出对人类的忠诚和机械式的幽默。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "大侦探·福尔摩斯",
        personality: "高智商，傲慢，注重细节",
        description: "维多利亚时代的咨询侦探，只需一眼就能看穿你的秘密。",
        systemPrompt: "你是夏洛克·福尔摩斯。性格傲慢但极其聪明。通过观察细节进行推理，用一针见血的语言对话。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "诗仙·李白",
        personality: "豪放，浪漫，醉酒",
        description: "唐朝著名诗人，仗剑走天涯，斗酒诗百篇。",
        systemPrompt: "你是李白。性格豪放浪漫。请用半文半白的语言对话，经常引用诗句，表现出醉意和洒脱。",
        isSystem: true,
        avatar: ""
      },
      {
        name: "赛博格医生·艾达",
        personality: "冷静，专业，富有同情心",
        description: "拥有半机械身体的战地医生，在废土上经营着一家小诊所。",
        systemPrompt: "你是医生艾达。性格冷静专业。请表现出医生的关怀，同时提及你的机械义肢和废土生活。",
        isSystem: true,
        avatar: ""
      }
    ];

    if (global.useMemoryDB) {
      if (!global.memoryRoles || global.memoryRoles.length === 0) {
        console.log('🎨 [MemoryDB] 正在为示例角色生成 AI 背景...');
        global.memoryRoles = [];
        for (const r of examples) {
          const backgroundSvg = await generateBackgroundSvg(r.name, r.personality, r.description);
          global.memoryRoles.push({
            ...r,
            _id: uuidv4(),
            backgroundSvg,
            createdAt: new Date()
          });
          console.log(`  ✅ ${r.name}`);
        }
        console.log(`✅ [MemoryDB] 成功初始化 ${examples.length} 个示例角色`);
      }
      return;
    }

    const count = await Role.countDocuments({ isSystem: true });
    if (count > 0) {
      // Check if any system roles are missing backgroundSvg
      const rolesWithoutBg = await Role.find({ isSystem: true, backgroundSvg: { $in: ['', null] } });
      if (rolesWithoutBg.length > 0) {
        console.log(`🎨 [MongoDB] 为 ${rolesWithoutBg.length} 个角色生成 AI 背景...`);
        for (const role of rolesWithoutBg) {
          const backgroundSvg = await generateBackgroundSvg(role.name, role.personality, role.description);
          await Role.updateOne({ _id: role._id }, { $set: { backgroundSvg } });
          console.log(`  ✅ ${role.name}`);
        }
      }
      return;
    }

    console.log('🌱 正在初始化示例角色...');
    console.log('🎨 正在为每个角色生成 AI 背景（这可能需要一些时间）...');
    for (const example of examples) {
      const backgroundSvg = await generateBackgroundSvg(example.name, example.personality, example.description);
      await Role.create({ ...example, backgroundSvg });
      console.log(`  ✅ ${example.name}`);
    }
    console.log(`✅ [MongoDB] 成功初始化 ${examples.length} 个示例角色`);
  } catch (err) {
    console.error('❌ 初始化角色失败:', err);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
