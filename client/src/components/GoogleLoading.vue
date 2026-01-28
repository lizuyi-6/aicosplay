<template>
  <div class="google-loading-container">
    <div class="loading-content">
      <!-- Animated Sphere Logic -->
      <div class="sphere-wrapper">
        <div class="sphere-color"></div>
        <div class="sphere-blur"></div>
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
  'AI 正在构思角色设定...',
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
