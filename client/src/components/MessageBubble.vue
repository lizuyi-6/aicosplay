<template>
  <div :class="['message-bubble', message.role]">
    <div class="bubble-content glass-card">
      <!-- Image attachment -->
      <div v-if="message.imageUrl" class="message-image">
        <img :src="fullImageUrl" alt="附件图片" @click="$emit('preview-image', fullImageUrl)" />
      </div>
      
      <!-- Text content -->
      <div class="message-text" v-html="formattedContent"></div>
      
      <!-- Streaming indicator -->
      <span v-if="message.isStreaming" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/stores/chat'

const props = defineProps<{
  message: Message
}>()

defineEmits<{
  (e: 'preview-image', url: string): void
}>()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const fullImageUrl = computed(() => {
  if (!props.message.imageUrl) return ''
  if (props.message.imageUrl.startsWith('http')) return props.message.imageUrl
  return `${API_BASE}${props.message.imageUrl}`
})

const formattedContent = computed(() => {
  let content = props.message.content
  
  // Basic markdown-like formatting
  // Bold
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Code blocks
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  // Inline code
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Line breaks
  content = content.replace(/\n/g, '<br>')
  
  return content
})
</script>

<style scoped>
.message-bubble {
  display: flex;
  margin-bottom: var(--spacing-md);
  animation: slideUp 0.3s ease-out;
}

.message-bubble.user {
  justify-content: flex-end;
}

.message-bubble.assistant {
  justify-content: flex-start;
}

.bubble-content {
  max-width: 75%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.message-bubble.user .bubble-content {
  background: var(--color-accent-gradient);
  border-bottom-right-radius: var(--spacing-xs);
  color: #ffffff;
}

.message-bubble.assistant .bubble-content {
  background: var(--glass-bg);
  border-bottom-left-radius: var(--spacing-xs);
}

.message-image {
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.message-image img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.message-image img:hover {
  transform: scale(1.02);
}

.message-text {
  font-size: var(--font-size-base);
  line-height: 1.6;
  word-wrap: break-word;
}

.message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  margin: var(--spacing-sm) 0;
}

.message-text :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: var(--font-size-sm);
}

.message-text :deep(p) {
  margin: 0;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: var(--spacing-sm);
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--color-accent-secondary);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
</style>
