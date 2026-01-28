<template>
  <div class="google-loading-container">
    <div class="loading-content">
      <!-- Google Style SVG Line Spinner -->
      <div class="loader-wrapper">
        <svg class="circular-loader" viewBox="25 25 50 50">
          <circle 
            class="loader-path" 
            cx="50" 
            cy="50" 
            r="20" 
            fill="none" 
            stroke-width="4" 
            stroke-miterlimit="10"
          />
        </svg>
      </div>

      <!-- Cycling Text -->
      <div class="text-wrapper">
        <transition name="fade" mode="out-in">
          <div :key="currentIndex" class="gradient-text">{{ currentText }}</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  messages?: string[]
}>()

const defaultMessages = [
  '正在连接神经网络...',
  'AI 正在研判角色设定...',
  '正在绘制独一无二的背景...',
  '正在生成性格与记忆...',
  '即将完成构建...'
]

const displayMessages = props.messages || defaultMessages
const currentIndex = ref(0)
const currentText = ref(displayMessages[0])

let intervalId: any

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % displayMessages.length
    currentText.value = displayMessages[currentIndex.value]
  }, 2500)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.google-loading-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.98); /* Cleaner white bg */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loading-content {
  display: flex;
  flex-direction: column; /* Stack vertically for cleaner look */
  align-items: center;
  gap: 32px;
}

/* Loader Wrapper */
.loader-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
}

/* Circular Loader - Material Design Standard */
.circular-loader {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
}

.loader-path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

/* Animations */
@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes color {
  100%, 0% { stroke: #4285f4; } /* Blue */
  40% { stroke: #ea4335; }      /* Red */
  66% { stroke: #fbbc05; }      /* Yellow */
  80%, 90% { stroke: #34a853; } /* Green */
}

/* Text Styling */
.text-wrapper {
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
}

.gradient-text {
  font-family: 'Inter', sans-serif; /* Clean font */
  font-size: 1rem;
  font-weight: 500;
  color: #5f6368; /* Google Grey */
  text-align: center;
  position: absolute;
  width: 100%;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
<style scoped>
.google-loading-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Sphere Animation */
.sphere-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sphere-color {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #4285f4 0deg 90deg,   /* Google Blue */
    #ea4335 90deg 180deg, /* Google Red */
    #fbbc05 180deg 270deg,/* Google Yellow */
    #34a853 270deg 360deg /* Google Green */
  );
  animation: spin 1.5s linear infinite;
  mask: radial-gradient(transparent 55%, black 56%);
  -webkit-mask: radial-gradient(transparent 55%, black 56%);
}

.sphere-blur {
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #4285f4 0deg 90deg,
    #ea4335 90deg 180deg,
    #fbbc05 180deg 270deg,
    #34a853 270deg 360deg
  );
  filter: blur(10px);
  opacity: 0.4;
  animation: spin 1.5s linear infinite;
  z-index: -1;
}

/* Text Styling */
.text-wrapper {
  min-width: 240px;
  height: 30px;
  overflow: hidden;
  position: relative;
  /* Align text vertically */
  display: flex;
  align-items: center;
}

.gradient-text {
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(90deg, #4285f4, #ea4335, #fbbc05, #34a853);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 3s ease infinite;
  
  /* Absolute positioning for smooth transitions overlap */
  position: absolute;
  width: 100%;
  white-space: nowrap;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Scroll Up Transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
