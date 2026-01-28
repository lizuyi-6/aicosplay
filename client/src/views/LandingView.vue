<template>
  <div class="landing-page" @mousemove="updateMouse">
    <!-- Navbar -->
    <nav class="main-nav" :class="{ 'scrolled': scrollY > 50 }">
      <div class="nav-content">
        <div class="logo">Neural<span class="highlight">Universe</span></div>
        <div class="nav-links">
          <a href="#hero">首页</a>
          <a href="#simulation">模拟</a>
          <a href="#features">特性</a>
          <router-link to="/app" class="nav-cta">启动系统</router-link>
        </div>
      </div>
    </nav>

    <!-- SECTION 1: HERO (100vh, Dense, Decorated) -->
    <section id="hero" class="section hero-section">
      <!-- Background Grid -->
      <div class="grid-bg"></div>
      
      <!-- Floating Decor Left: Memory Fragment -->
      <div class="floating-decor left animate-float-slow">
        <div class="glass-card">
          <div class="card-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
          </div>
          <div class="card-content">
            <div class="line w-70"></div>
            <div class="line w-50"></div>
            <div class="line w-80"></div>
            <div class="memory-tag">Memory Fragment #0492</div>
          </div>
        </div>
      </div>

      <!-- Floating Decor Right: Neural Node -->
      <div class="floating-decor right animate-float-medium">
        <div class="neural-node">
          <div class="node-ring"></div>
          <div class="node-core"></div>
          <div class="node-status">Online</div>
        </div>
      </div>

      <div class="hero-content">
        <div class="status-pill animate-fade-in">
          <span class="status-dot"></span>
          <span>System Optimized</span>
        </div>
        
        <h1 class="main-title animate-slide-up">
          <span class="block">界限，</span>
          <span class="accent-text">正在消融。</span>
        </h1>
        
        <p class="sub-title animate-slide-up delay-1">
          新一代沉浸式角色扮演体验。<br>
          更真实，更懂你。
        </p>

        <router-link to="/app" class="hero-btn animate-slide-up delay-2">
          开始探索
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-hint animate-bounce">
        <div class="mouse-icon">
          <div class="wheel"></div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: SIMULATION (Gray Background) -->
    <section id="simulation" class="section sim-section">
      <div class="section-container">
        <div class="text-block reveal-on-scroll">
          <h2 class="section-title">01. 真实模拟</h2>
          <p class="section-desc">不只是文字。这是基于次世代神经网络构建的虚拟生态。</p>
        </div>

        <div class="device-frame reveal-on-scroll delay-1">
          <div class="screen-content">
            <!-- Game UI Mockup (Preserved) -->
            <div class="game-ui-mockup">
              <div class="game-top-bar">
                <div class="location-tag">📍 第七区 · 霓虹雨巷</div>
                <div class="time-tag">23:42 PM</div>
                <div class="status-icons">
                  <span class="icon">📶</span>
                  <span class="icon">🔋</span>
                </div>
              </div>

              <div class="game-main-area">
                <div class="character-portrait">
                  <!-- Optional portrait content -->
                </div>
                
                <div class="dialogue-box">
                  <div class="speaker-name">EVE</div>
                  <p class="dialogue-text">"你终于来了。我检测到了现实世界的波动...看来我们之间的连接比预想的还要深。"</p>
                  
                  <div class="choice-container">
                    <button class="choice-btn">"发生了什么？"</button>
                    <button class="choice-btn">"我一直都在。"</button>
                    <button class="choice-btn">"分析当前数据流"</button>
                  </div>
                </div>
              </div>

              <div class="stats-panel">
                <div class="stat-row">
                  <span class="stat-label">同步率</span>
                  <div class="stat-bar"><div class="stat-fill" style="width: 85%"></div></div>
                </div>
                <div class="stat-row">
                  <span class="stat-label">情感</span>
                  <div class="stat-bar"><div class="stat-fill purple" style="width: 60%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: FEATURES (White Background) -->
    <section id="features" class="section features-section">
      <!-- Watermark Number -->
      <div class="watermark-number">02</div>
      
      <div class="section-container">
        <div class="text-block reveal-on-scroll">
          <h2 class="section-title">02. 核心特性</h2>
          <p class="section-desc">以此为基，构建无限可能。</p>
        </div>

        <div class="features-grid">
          <div class="feature-card reveal-on-scroll delay-1">
            <div class="icon-box blue-bg">🧠</div>
            <h3>深度记忆</h3>
            <p>每一次对话都被铭记。他们是拥有连贯记忆的独立个体，而非简单的问答机器。</p>
          </div>
          <div class="feature-card reveal-on-scroll delay-2">
            <div class="icon-box khaki-bg">🎨</div>
            <h3>多模态交互</h3>
            <p>打破媒介的限制。看你所看，听你所听，感受同一个世界的脉搏。</p>
          </div>
          <div class="feature-card reveal-on-scroll delay-3">
            <div class="icon-box gray-bg">♾️</div>
            <h3>无限剧本</h3>
            <p>没有剧本就是最好的剧本。你的选择实时生成新的因果链，世界因你而变。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: LORE & FOOTER -->
    <section class="section lore-section">
      <div class="lore-content reveal-on-scroll">
        <h2>2140. Digital Horizon.</h2>
        <p>我们不再区分虚拟与现实。<br>欢迎来到新世界。</p>
      </div>
    </section>

    <footer class="main-footer">
      <div class="footer-content">
        <h3>准备好了吗？</h3>
        <router-link to="/app" class="footer-cta">进入系统</router-link>
        <div class="copyright">&copy; 2026 NeuralUniverse Inc.</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0) 

function handleScroll() {
  scrollY.value = window.scrollY
}

function updateMouse(e: MouseEvent) {
  const x = (e.clientX / window.innerWidth) - 0.5
  const y = (e.clientY / window.innerHeight) - 0.5
  document.documentElement.style.setProperty('--mouse-x', `${x}`)
  document.documentElement.style.setProperty('--mouse-y', `${y}`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --primary-blue: #0071e3;
  --bg-white: #ffffff;
  --bg-khaki-warm: #F9F7F2; /* Warm Khaki Background */
  --bg-purple-light: #F3F1FA; /* Soft Purple Background */
  --text-main: #1d1d1f;
  --text-dark: #000000;
  --border-khaki: #E6E2D6;
  --accent-purple: #8E44AD;
  --accent-gold: #B7950B;
}

.landing-page {
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  background-color: var(--bg-white);
  overflow-x: hidden;
}

/* Animations */
.animate-fade-in { animation: fadeIn 0.8s ease forwards; opacity: 0; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
.delay-1 { animation-delay: 0.1s; transition-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; transition-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; transition-delay: 0.3s; }

.reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }

@keyframes fadeIn { to { opacity: 1; } }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }

/* Floating Animation */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float-slow { animation: float 6s ease-in-out infinite; }
.animate-float-medium { animation: float 5s ease-in-out infinite; animation-delay: 1s; }

/* Nav */
.main-nav {
  position: fixed;
  top: 0; width: 100%; z-index: 100;
  transition: 0.3s;
  background: rgba(255, 255, 255, 0.85); /* Slightly more opaque */
  backdrop-filter: saturate(180%) blur(20px);
}
.main-nav.scrolled { border-bottom: 1px solid rgba(0,0,0,0.05); }
.nav-content { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px; color: #000; }
.highlight { color: var(--primary-blue); }
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a { text-decoration: none; color: #666; font-size: 0.9rem; font-weight: 500; transition: 0.2s; }
.nav-links a:hover { color: #000; }
.nav-cta { background: #000; color: #fff; padding: 6px 14px; border-radius: 99px; font-size: 0.85rem; transition: 0.2s; }
.nav-cta:hover { transform: scale(1.02); }

/* HERO SECTION (100vh) */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  overflow: hidden;
  background-color: #ffffff;
}

/* Subtle Grid Background - preserved but lighter */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(#f2f2f2 1px, transparent 1px),
    linear-gradient(90deg, #f2f2f2 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: center;
  mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  opacity: 0.5;
  z-index: 0;
}

/* Floating Decor Left */
.floating-decor { position: absolute; top: 35%; display: none; }
@media (min-width: 1024px) { .floating-decor { display: block; } }

.floating-decor.left { left: 12%; }
.floating-decor.right { right: 12%; }

.glass-card {
  width: 200px; height: 260px;
  background: rgba(250, 250, 252, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.06); /* Softer shadow */
  padding: 16px;
  display: flex;
  flex-direction: column;
  transform: rotate(-6deg);
}
.card-header { display: flex; gap: 6px; margin-bottom: 20px; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.red { background: #FF6B6B; } .dot.yellow { background: #FFD93D; }

.line { height: 6px; background: #EEE; border-radius: 3px; margin-bottom: 12px; }
.w-70 { width: 70%; } .w-50 { width: 50%; } .w-80 { width: 80%; }
.memory-tag { margin-top: auto; font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #BBB; }

/* Floating Decor Right */
.neural-node {
  width: 180px; height: 180px;
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.node-ring {
  position: absolute; inset: 0;
  border: 3px solid #f2f2f2;
  border-right-color: var(--primary-blue);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}
.node-core {
  width: 50px; height: 50px;
  background: linear-gradient(135deg, #0071e3, #6c5ce7); /* Blue-Purple gradient */
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(108, 92, 231, 0.3);
}
.node-status {
  position: absolute; bottom: -30px;
  font-family: 'JetBrains Mono'; font-size: 0.8rem; letter-spacing: 2px;
  color: #ccc;
}
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }


.hero-content { position: relative; z-index: 10; max-width: 800px; padding: 0 20px; }
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem; font-weight: 600; color: #000;
  background: rgba(255, 255, 255, 0.8); padding: 8px 16px; border-radius: 99px;
  margin-bottom: 2rem; border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}
.status-dot { width: 8px; height: 8px; background: #28cd41; border-radius: 50%; }

.main-title { font-size: 5.5rem; font-weight: 800; letter-spacing: -3px; line-height: 1.05; margin-bottom: 2rem; color: #000000; }
.accent-text { color: #555; display: block; } 
.sub-title { font-size: 1.6rem; color: #222; font-weight: 500; line-height: 1.5; margin-bottom: 3.5rem; }

.hero-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #1a1a1a; color: #fff;
  padding: 18px 48px; border-radius: 99px;
  font-size: 1.25rem; font-weight: 600; text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.hero-btn:hover { transform: scale(1.05); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); background: #000; }

.scroll-hint { position: absolute; bottom: 40px; opacity: 0.4; }
.mouse-icon { width: 26px; height: 40px; border: 2px solid #000; border-radius: 20px; position: relative; display: flex; justify-content: center; }
.wheel { width: 4px; height: 8px; background: #000; border-radius: 2px; position: absolute; top: 6px; animation: scrollWheel 2s infinite; }
@keyframes scrollWheel { 0% { top: 6px; opacity: 1; } 100% { top: 18px; opacity: 0; } }


/* SIMULATION SECTION (Warm Khaki - Hardcoded) */
.sim-section { 
  background-color: #F9F7F2; /* Explicit Warm Khaki */
  padding-bottom: 10rem;
  border-top: 1px solid rgba(0,0,0,0.03); 
}
.section-container { max-width: 1000px; margin: 0 auto; }
.text-block { text-align: center; margin-bottom: 4rem; }
.section-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 1rem; color: #2D2D2D; }
.section-desc { font-size: 1.3rem; color: #555; max-width: 600px; margin: 0 auto; font-weight: 500; }

.device-frame {
  max-width: 900px; margin: 0 auto;
  border-radius: 20px; background: #fff;
  box-shadow: 0 30px 60px rgba(100, 90, 80, 0.1); 
  border: 10px solid #FFFFFF; 
  outline: 1px solid #Eaeaea; 
  overflow: hidden;
  position: relative; aspect-ratio: 16/9;
}

/* Light Game UI - Clean & Modern */
.game-ui-mockup {
  width: 100%; height: 100%;
  background: #fdfdfd; /* Clean Light Background */
  position: relative; display: flex; flex-direction: column;
}
/* REMOVED DARK OVERLAY */
.game-ui-mockup::before { display: none; }

.game-top-bar {
  position: relative; z-index: 2; display: flex; justify-content: space-between;
  padding: 16px 24px; color: #333; /* Dark text */
  font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
  background: rgba(0,0,0,0.02); /* Very subtle gray */
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.game-main-area { flex: 1; position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; }

/* Modified Dialogue Box for Light Theme */
.dialogue-box {
  background: #ffffff; 
  padding: 24px; border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); /* Softer shadow */
  max-width: 700px; margin: 0 auto; width: 100%;
  border: 1px solid #eee;
}
.speaker-name { font-size: 0.8rem; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.dialogue-text { font-size: 1.1rem; color: #1d1d1f; margin-bottom: 20px; line-height: 1.6; }
.choice-container { display: flex; flex-direction: column; gap: 10px; }

/* Choice buttons - Green Accents */
.choice-btn {
  background: #ffffff; border: 1px solid #e0e0e0; padding: 12px 16px; border-radius: 8px;
  text-align: left; cursor: pointer; transition: 0.2s; font-size: 0.95rem; color: #333; font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.choice-btn:hover { 
  background: #F0FFF4; /* Light Green Tint */
  color: #28cd41; /* Apple Green */
  border-color: #28cd41; 
  transform: translateX(5px); 
  box-shadow: 0 4px 12px rgba(40, 205, 65, 0.15); 
}

/* Stats Panel - Light Theme */
.stats-panel {
  position: absolute; top: 80px; right: 24px;
  background: rgba(255, 255, 255, 0.9);
  padding: 16px; border-radius: 8px; color: #333;
  font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
  border: 1px solid #eee; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.stat-row { margin-bottom: 12px; } .stat-row:last-child { margin-bottom: 0; }
.stat-label { display: block; margin-bottom: 4px; opacity: 0.6; }
.stat-bar { width: 120px; height: 4px; background: #eee; border-radius: 2px; }
.stat-fill { height: 100%; background: #28cd41; border-radius: 2px; } .stat-fill.purple { background: #8E44AD; }


/* FEATURES SECTION (Pure White for Safety) */
.features-section { 
  background: #ffffff; /* Explicit White */
  position: relative; overflow: hidden; 
}
.watermark-number {
  position: absolute; top: 0px; left: -50px;
  font-size: 20rem; font-weight: 800; color: rgba(0,0,0,0.02); /* Very faint gray */
  line-height: 1; z-index: 0;
}
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; position: relative; z-index: 1; }
.feature-card { 
  background: #fff; padding: 2.5rem; border-radius: 20px; transition: 0.3s; 
  border: 1px solid #f0f0f0; 
  box-shadow: 0 10px 40px rgba(0,0,0,0.03); 
}
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); border-color: #28cd41; }
.icon-box { 
  width: 50px; height: 50px; border-radius: 14px; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 1.5rem; margin-bottom: 20px; 
}
/* Green/Blue/Purple Accents */
.blue-bg { background: rgba(0, 113, 227, 0.1); color: #0071e3; } 
.khaki-bg { background: rgba(40, 205, 65, 0.1); color: #28cd41; } /* Multimodal -> Green */
.gray-bg { background: rgba(142, 68, 173, 0.1); color: #8E44AD; }

.feature-card h3 { font-size: 1.25rem; margin-bottom: 10px; font-weight: 700; color: #000; }
.feature-card p { color: #555; font-size: 1rem; line-height: 1.6; }

/* Lore & Footer */
.lore-section { background: #fbfbfb; text-align: center; padding: 10rem 2rem; }
.lore-content h2 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1px; color: #000000; }
.lore-content p { font-size: 1.5rem; color: #333333; font-weight: 500; }

.main-footer { 
  background: #fdfdfd; /* White/Light Background */
  border-top: 1px solid #eee;
  color: #1d1d1f; /* Dark Text */
  padding: 6rem 2rem 3rem; text-align: center; 
}
.footer-cta {
  display: inline-block; 
  background: #1d1d1f; /* Elegant Black CTA */
  color: #fff; 
  padding: 16px 40px; border-radius: 99px; font-weight: 600; text-decoration: none; font-size: 1.2rem; margin: 2rem 0 4rem; transition: 0.3s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.footer-cta:hover { transform: scale(1.05); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25); background: #000; }
.copyright { color: #888; font-size: 0.8rem; }

/* Responsive */
@media (max-width: 1024px) {
  .main-title { font-size: 4rem; }
  .floating-decor { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .watermark-number { display: none; }
}
</style>
