<template>
  <div class="landing-page" @mousemove="updateMouse" @wheel="handleWheel">
    <!-- Navbar -->
    <nav class="main-nav" :class="{ 'scrolled': currentSection > 0 }">
      <div class="nav-content">
        <div class="logo">Neural<span class="highlight">Universe</span></div>
        <div class="nav-links">
          <a @click.prevent="scrollToSection(0)">首页</a>
          <a @click.prevent="scrollToSection(1)">模拟</a>
          <a @click.prevent="scrollToSection(2)">特性</a>
          <router-link to="/app" class="nav-cta">启动系统</router-link>
        </div>
      </div>
    </nav>

    <!-- SECTION 1: HERO -->
    <section ref="section0" class="section hero-section" :class="{ 'active': currentSection >= 0 }">
      <div class="grid-bg"></div>
      
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

      <div class="scroll-hint animate-bounce" @click="scrollToSection(1)">
        <div class="mouse-icon">
          <div class="wheel"></div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: SIMULATION -->
    <section ref="section1" class="section sim-section" :class="{ 'active': currentSection >= 1 }">
      <div class="section-container">
        <div class="text-block reveal-on-active">
          <h2 class="section-title">01. 真实模拟</h2>
          <p class="section-desc">不只是文字。这是基于次世代神经网络构建的虚拟生态。</p>
        </div>

        <div class="device-frame reveal-on-active delay-1">
          <div class="screen-content">
            <div class="game-ui-mockup">
              <div class="game-top-bar">
                <div class="location-tag">📍 第七区 · 霓虹雨巷</div>
                <div class="time-tag">23:42 PM</div>
                <div class="status-icons">
                  <!-- Signal Line Icon -->
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  <!-- Battery Line Icon -->
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                    <line x1="23" y1="13" x2="23" y2="11"></line>
                  </svg>
                </div>
              </div>

              <div class="game-main-area">
                <div class="character-portrait"></div>
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

    <!-- SECTION 3: FEATURES -->
    <section ref="section2" class="section features-section" :class="{ 'active': currentSection >= 2 }">
      <div class="watermark-number">02</div>
      
      <div class="section-container">
        <div class="text-block reveal-on-active">
          <h2 class="section-title">02. 核心特性</h2>
          <p class="section-desc">以此为基，构建无限可能。</p>
        </div>

        <div class="features-grid">
          <div class="feature-card reveal-on-active delay-1">
            <div class="icon-box blue-bg">
              <!-- Brain Icon -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v1A2.5 2.5 0 0 0 4.5 8H2v3h2.5A2.5 2.5 0 0 0 7 13.5v1A2.5 2.5 0 0 0 9.5 17H12v3h3v-3h2.5a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0 2.5-2.5H22V8h-2.5A2.5 2.5 0 0 0 17 5.5v-1A2.5 2.5 0 0 0 14.5 2H9.5z"></path>
              </svg>
            </div>
            <h3>深度记忆</h3>
            <p>每一次对话都被铭记。他们是拥有连贯记忆的独立个体，而非简单的问答机器。</p>
          </div>
          <div class="feature-card reveal-on-active delay-2">
            <div class="icon-box khaki-bg">
              <!-- Geometric/Multimodal Icon -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>多模态交互</h3>
            <p>打破媒介的限制。看你所看，听你所听，感受同一个世界的脉搏。</p>
          </div>
          <div class="feature-card reveal-on-active delay-3">
            <div class="icon-box gray-bg">
              <!-- Infinity Icon -->
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 12c-2-2.3-4-4-7-4s-5 1.7-5 4 2 4 5 4 7-1.7 7-4zm0 0c2 2.3 4 4 7 4s5-1.7 5-4-2-4-5-4-7 1.7-7 4z"></path>
              </svg>
            </div>
            <h3>无限剧本</h3>
            <p>没有剧本就是最好的剧本。你的选择实时生成新的因果链，世界因你而变。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: LORE -->
    <section ref="section3" class="section lore-section" :class="{ 'active': currentSection >= 3 }">
      <!-- Watermark (More visible) -->
      <div class="watermark-huge">2140</div>

      <!-- LEFT DECOR: System Log -->
      <div class="decor-side left reveal-on-active delay-1">
        <div class="code-block">
          <div class="code-line"><span class="c-gray">></span> CONNECTING...</div>
          <div class="code-line"><span class="c-green">✓</span> UPLINK ESTABLISHED</div>
          <div class="code-line"><span class="c-gray">></span> SYNC_RATE: <span class="c-blue">99.8%</span></div>
          <div class="code-line"><span class="c-gray">></span> LATENCY: <span class="c-blue">12ms</span></div>
          <div class="code-line"><span class="c-gray">></span> ENCRYPTION: <span class="c-gold">AES-4096</span></div>
        </div>
      </div>

      <!-- RIGHT DECOR: Globe/Network -->
      <div class="decor-side right reveal-on-active delay-2">
        <div class="network-circle">
           <div class="orbit orbit-1"></div>
           <div class="orbit orbit-2"></div>
           <div class="planet-core"></div>
        </div>
      </div>
      
      <div class="lore-content reveal-on-active">
        <h2>2140. Digital Horizon.</h2>
        <p>我们不再区分虚拟与现实。<br>欢迎来到新世界。</p>
      </div>
    </section>

    <footer ref="section4" class="main-footer" :class="{ 'active': currentSection >= 4 }">
      <div class="grid-bg"></div>
      
      <!-- LEFT FOOTER: Socials -->
      <div class="footer-corner left reveal-on-active delay-2">
        <h4>CONNECT</h4>
        <a href="#">Twitter / X</a>
        <a href="#">GitHub</a>
        <a href="#">Discord</a>
      </div>

      <!-- RIGHT FOOTER: Legal -->
      <div class="footer-corner right reveal-on-active delay-2">
        <h4>LEGAL</h4>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>

      <div class="footer-content">
        <h3>准备好了吗？</h3>
        <router-link to="/app" class="footer-cta">进入系统</router-link>
      </div>
      
      <div class="copyright">&copy; 2026 NeuralUniverse Inc.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentSection = ref(0)
const isScrolling = ref(false)
const section0 = ref<HTMLElement | null>(null)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)

const sections = [section0, section1, section2, section3, section4]

function scrollToSection(index: number) {
  if (index < 0 || index >= sections.length) return
  
  currentSection.value = index
  const target = sections[index].value
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  
  if (isScrolling.value) return
  
  if (e.deltaY > 20) {
    isScrolling.value = true
    scrollToSection(currentSection.value + 1)
    setTimeout(() => isScrolling.value = false, 1000)
  } else if (e.deltaY < -20) {
    isScrolling.value = true
    scrollToSection(currentSection.value - 1)
    setTimeout(() => isScrolling.value = false, 1000)
  }
}

function updateMouse(e: MouseEvent) {
  const x = (e.clientX / window.innerWidth) - 0.5
  const y = (e.clientY / window.innerHeight) - 0.5
  document.documentElement.style.setProperty('--mouse-x', `${x}`)
  document.documentElement.style.setProperty('--mouse-y', `${y}`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --primary-blue: #0071e3;
  --bg-white: #ffffff;
  --bg-khaki-warm: #F9F7F2;
  --text-main: #1d1d1f;
}

.landing-page {
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  background-color: var(--bg-white);
  height: 100vh;
  overflow: hidden;
}

/* Animations Logic */
.reveal-on-active { opacity: 0; transform: translateY(30px); transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
.active .reveal-on-active { opacity: 1; transform: translateY(0); }

/* Animation Utils */
.animate-fade-in { animation: fadeIn 0.8s ease forwards; opacity: 0; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
.delay-1 { transition-delay: 0.1s; animation-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; animation-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; animation-delay: 0.3s; }

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


/* GENERAL LAYOUT */
.section {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* NAV */
.main-nav { position: fixed; top: 0; width: 100%; z-index: 100; transition: 0.3s; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); }
.main-nav.scrolled { border-bottom: 1px solid rgba(0,0,0,0.05); }
.nav-content { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 800; font-size: 1.1rem; color: #000; }
.highlight { color: #0071e3; }
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a { text-decoration: none; color: #666; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: 0.2s; }
.nav-links a:hover { color: #000; }
.nav-links .nav-cta { background: #000; color: #fff; padding: 6px 14px; border-radius: 99px; font-size: 0.85rem; }

/* HERO */
.hero-section { background: #fff; }
.grid-bg { 
  position: absolute; inset: 0; 
  background-image: linear-gradient(#f2f2f2 1px, transparent 1px), linear-gradient(90deg, #f2f2f2 1px, transparent 1px);
  background-size: 60px 60px; mask-image: radial-gradient(circle, black 30%, transparent 80%); opacity: 0.5; z-index: 0;
}
.hero-content { position: relative; z-index: 10; padding: 0 20px; text-align: center; }

.status-pill {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.85rem; font-weight: 600; color: #fff;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 16px; border-radius: 99px; margin-bottom: 2rem;
}
.status-dot { width: 8px; height: 8px; background: #28cd41; border-radius: 50%; }

.main-title { font-size: 5.5rem; font-weight: 800; letter-spacing: -3px; line-height: 1.05; margin-bottom: 2rem; color: #000; }
.accent-text { color: #555; display: block; }
.sub-title { font-size: 1.6rem; color: #222; margin-bottom: 3.5rem; }

.hero-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #1a1a1a; color: #fff; padding: 18px 48px; border-radius: 99px;
  font-size: 1.25rem; font-weight: 600; text-decoration: none; transition: 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.hero-btn:hover { transform: scale(1.05); background: #000; }

/* DECOR */
.floating-decor { position: absolute; top: 35%; display: none; }
@media (min-width: 1024px) { .floating-decor { display: block; } }
.floating-decor.left { left: 12%; }
.floating-decor.right { right: 12%; }

.glass-card { width: 200px; height: 260px; background: rgba(250,250,252,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.9); border-radius: 16px; padding: 16px; transform: rotate(-6deg); box-shadow: 0 15px 35px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
.card-header { display: flex; gap: 6px; margin-bottom: 20px; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.red { background: #FF6B6B; } .dot.yellow { background: #FFD93D; }
.line { height: 6px; background: #EEE; border-radius: 3px; margin-bottom: 12px; }
.w-70 { width: 70%; } .w-50 { width: 50%; } .w-80 { width: 80%; }
.memory-tag { margin-top: auto; font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #BBB; }

.neural-node { width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
.node-ring { position: absolute; inset: 0; border: 3px solid #f2f2f2; border-right-color: #0071e3; border-radius: 50%; animation: rotate 10s linear infinite; }
.node-core { width: 50px; height: 50px; background: linear-gradient(135deg, #0071e3, #6c5ce7); border-radius: 50%; box-shadow: 0 0 30px rgba(108,92,231,0.3); }
.node-status { position: absolute; bottom: -30px; font-family: 'JetBrains Mono'; font-size: 0.8rem; letter-spacing: 2px; color: #ccc; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* SIMULATION */
.sim-section { background: #F9F7F2; }
.section-container { width: 100%; max-width: 1200px; padding: 0 2rem; }
.text-block { text-align: center; margin-bottom: 3rem; }
.section-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 1rem; color: #2D2D2D; }
.section-desc { font-size: 1.3rem; color: #555; max-width: 600px; margin: 0 auto; }

.device-frame { max-width: 900px; margin: 0 auto; border-radius: 20px; background: #fff; box-shadow: 0 30px 60px rgba(100,90,80,0.1); border: 10px solid #FFF; overflow: hidden; position: relative; aspect-ratio: 16/9; }
.game-ui-mockup { width: 100%; height: 100%; background: #fdfdfd; display: flex; flex-direction: column; }
.game-top-bar { display: flex; justify-content: space-between; padding: 16px 24px; color: #333; font-family: 'JetBrains Mono'; font-size: 0.8rem; background: rgba(0,0,0,0.02); }
.game-main-area { flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: flex-end; }
.dialogue-box { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee; max-width: 700px; width: 100%; margin: 0 auto; }
.speaker-name { font-size: 0.8rem; font-weight: 700; color: #666; margin-bottom: 8px; }
.dialogue-text { font-size: 1.1rem; color: #1d1d1f; margin-bottom: 20px; }
.choice-container { display: flex; flex-direction: column; gap: 10px; }
.choice-btn { background: #fff; border: 1px solid #e0e0e0; padding: 12px 16px; border-radius: 8px; text-align: left; cursor: pointer; transition: 0.2s; color: #333; }
.choice-btn:hover { background: #F0FFF4; color: #28cd41; border-color: #28cd41; transform: translateX(5px); }

.stats-panel { position: absolute; top: 80px; right: 24px; background: rgba(255,255,255,0.9); padding: 16px; border-radius: 8px; color: #333; font-family: 'JetBrains Mono'; font-size: 0.75rem; border: 1px solid #eee; }
.stat-row { margin-bottom: 12px; }
.stat-label { display: block; margin-bottom: 4px; opacity: 0.6; }
.stat-bar { width: 120px; height: 4px; background: #eee; border-radius: 2px; }
.stat-fill { height: 100%; background: #28cd41; border-radius: 2px; } .stat-fill.purple { background: #8E44AD; }

/* FEATURES */
.features-section { background: #fff; overflow: hidden; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.feature-card { background: #fff; padding: 2.5rem; border-radius: 20px; border: 1px solid #f0f0f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03); transition: 0.3s; }
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); border-color: #28cd41; }
.icon-box { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 20px; }
.blue-bg { background: rgba(0,113,227,0.1); color: #0071e3; }
.khaki-bg { background: rgba(40,205,65,0.1); color: #28cd41; }
.gray-bg { background: rgba(142,68,173,0.1); color: #8E44AD; }
.feature-card h3 { font-size: 1.25rem; font-weight: 700; color: #000; margin-bottom: 10px; }
.feature-card p { color: #555; line-height: 1.6; }
.watermark-number { position: absolute; top: 10%; left: -2%; font-size: 20rem; font-weight: 800; color: rgba(0,0,0,0.02); }

/* LORE */
.lore-section { background: #fbfbfb; text-align: center; position: relative; overflow: hidden; }
.lore-content { position: relative; z-index: 10; }
.lore-content h2 { font-size: 3rem; font-weight: 800; color: #000; margin-bottom: 1rem; }
.lore-content p { font-size: 1.5rem; color: #333; }
.watermark-huge { position: absolute; right: -5%; bottom: -10%; font-size: 15rem; font-weight: 900; color: rgba(0,0,0,0.08); z-index: 0; line-height: 1; pointer-events: none; }

/* NEW DECOR */
.decor-side { position: absolute; top: 50%; transform: translateY(-50%); display: none; }
@media (min-width: 1200px) { .decor-side { display: block; } }

.decor-side.left { left: 8%; }
.decor-side.right { right: 8%; }

/* Code Block Style */
.code-block { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; text-align: left; background: rgba(0,0,0,0.03); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #000; }
.code-line { margin-bottom: 6px; color: #555; white-space: nowrap; }
.c-gray { color: #999; } .c-green { color: #28cd41; } .c-blue { color: #0071e3; } .c-gold { color: #B7950B; }

/* Network Circle Style */
.network-circle { width: 160px; height: 160px; border: 1px solid rgba(0,0,0,0.1); border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; }
.planet-core { width: 40px; height: 40px; background: #eee; border-radius: 50%; }
.orbit { position: absolute; border: 1px dashed rgba(0,0,0,0.1); border-radius: 50%; }
.orbit-1 { width: 100%; height: 100%; animation: rotate 20s linear infinite; }
.orbit-2 { width: 70%; height: 70%; border-style: solid; border-color: rgba(0,0,0,0.05); animation: rotate 15s linear infinite reverse; }

/* FOOTER */
.main-footer { background: #fdfdfd; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; }
.footer-content { position: relative; z-index: 10; width: 100%; display: flex; flex-direction: column; align-items: center; }
.footer-cta { display: inline-block; background: #1d1d1f; color: #fff; padding: 16px 40px; border-radius: 99px; font-weight: 600; text-decoration: none; font-size: 1.2rem; margin: 2rem 0; transition: 0.3s; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.footer-cta:hover { transform: scale(1.05); background: #000; }
.copyright { position: absolute; bottom: 30px; width: 100%; color: #aaa; font-size: 0.8rem; z-index: 10; }

.footer-corner { position: absolute; bottom: 30px; text-align: left; display: none; }
@media (min-width: 1024px) { .footer-corner { display: flex; flex-direction: column; gap: 8px; } }
.footer-corner h4 { font-size: 0.7rem; font-weight: 700; color: #000; margin-bottom: 8px; letter-spacing: 1px; }
.footer-corner a { text-decoration: none; color: #666; font-size: 0.85rem; transition: 0.2s; }
.footer-corner a:hover { color: #0071e3; }
.footer-corner.left { left: 40px; }
.footer-corner.right { right: 40px; text-align: right; }

@media (max-width: 1024px) {
  .section { height: auto; padding: 4rem 0; }
  .features-grid { grid-template-columns: 1fr; }
  .floating-decor, .watermark-number, .watermark-huge, .decor-side, .footer-corner { display: none; }
  .landing-page { overflow-y: auto; height: auto; } /* Normal scroll on mobile */
  .copyright { position: relative; bottom: auto; margin-top: 2rem; }
}

.scroll-hint { position: absolute; bottom: 40px; opacity: 0.4; cursor: pointer; }
.mouse-icon { width: 26px; height: 40px; border: 2px solid #000; border-radius: 20px; position: relative; display: flex; justify-content: center; }
.wheel { width: 4px; height: 8px; background: #000; border-radius: 2px; position: absolute; top: 6px; animation: scrollWheel 2s infinite; }
@keyframes scrollWheel { 0% { top: 6px; opacity: 1; } 100% { top: 18px; opacity: 0; } }
</style>
