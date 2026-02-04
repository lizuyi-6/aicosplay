<template>
  <div class="chat-view animate-fade-in">
    <!-- Sidebar -->
    <aside class="sidebar glass-card" :class="{ 'collapsed': !isSidebarOpen }">
      <div class="sidebar-content" :class="{ 'hidden': !isSidebarOpen }">
        <div class="role-header">
          <button class="back-btn btn btn-secondary btn-icon" @click="goBack" title="返回">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="role-info" v-if="currentRole">
            <div class="role-details">
              <h2>{{ currentRole.name }}</h2>
              <span class="personality-tag">{{ currentRole.personality }}</span>
            </div>
          </div>
        </div>

        <button class="new-chat-btn btn btn-primary" @click="startNewChat">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新对话
        </button>

        <div class="role-description" v-if="currentRole">
          <h4>角色背景</h4>
          <p>{{ currentRole.description }}</p>
        </div>

        <!-- Conversation History List -->
        <div class="history-section" v-if="chatStore.conversations.length > 0">
          <h4>历史对话</h4>
          <div class="history-list">
            <div 
              v-for="conv in chatStore.conversations" 
              :key="conv._id"
              class="history-item"
              :class="{ 'active': conv._id === chatStore.conversationId }"
              @click="loadConversation(conv._id)"
            >
              <div class="history-preview">{{ truncateText(conv.lastMessage, 40) }}</div>
              <div class="history-time">{{ formatTime(conv.lastTime) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Collapse Toggle Button -->
      <button class="sidebar-toggle" @click="toggleSidebar" :title="isSidebarOpen ? '收起侧边栏' : '展开侧边栏'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: isSidebarOpen ? 'rotate(0)' : 'rotate(180deg)' }">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </aside>

    <!-- Main Chat Area -->
    <main class="chat-main">
      <!-- Dynamic Background Effects -->
      <BackgroundEffects v-if="currentRole" :role="currentRole" :key="currentRole._id" />

      <!-- Messages -->
      <div class="messages-container" ref="messagesRef">
        <div v-if="chatStore.messages.length === 0 && currentRole" class="welcome-message animate-slide-up">
          <div class="welcome-avatar">
            <img v-if="currentRole.avatar" :src="currentRole.avatar" :alt="currentRole.name" />
            <div v-else class="avatar-placeholder">{{ currentRole.name.charAt(0) }}</div>
          </div>
          <h3>{{ currentRole.name }}</h3>
          <p class="welcome-text">“{{ welcomeMessage }}”</p>
        </div>

        <MessageBubble 
          v-for="(msg, index) in chatStore.messages" 
          :key="index" 
          :message="msg"
          @preview-image="previewImage"
        />
      </div>

      <!-- Input Area -->
      <div class="input-area glass-card-top">
        <ChatInput 
          :disabled="chatStore.isStreaming" 
          @send="sendMessage" 
        />
      </div>
    </main>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="previewImageUrl" class="image-modal" @click="previewImageUrl = null">
          <img :src="previewImageUrl" alt="预览" class="animate-scale-up" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/role'
import { useChatStore } from '@/stores/chat'
import MessageBubble from '@/components/MessageBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import BackgroundEffects from '@/components/BackgroundEffects.vue'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
const chatStore = useChatStore()

const messagesRef = ref<HTMLElement | null>(null)
const previewImageUrl = ref<string | null>(null)
const isSidebarOpen = ref(true)

const currentRole = computed(() => roleStore.currentRole)

// Generate a dynamic welcome message based on role description
const welcomeMessage = computed(() => {
  if (!currentRole.value) return '你好，我是你的AI伙伴。'
  const desc = currentRole.value.description
  const firstSentence = desc.split(/[。！？]/)[0]
  return `你好，我是${currentRole.value.name}。${firstSentence ? firstSentence + '。' : '很高兴见到你。'}`
})

onMounted(async () => {
  const roleId = route.params.id as string
  
  if (!roleStore.currentRole || roleStore.currentRole._id !== roleId) {
    const role = await roleStore.fetchRole(roleId)
    if (!role) {
      router.push('/')
      return
    }
  }
  
  // Fetch conversation history for this role
  await chatStore.fetchConversations(roleId)
  
  if (chatStore.messages.length === 0) {
    chatStore.startNewConversation()
  }
  
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
})

// Auto-scroll logic
watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

watch(
  () => chatStore.messages[chatStore.messages.length - 1]?.content,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function goBack() {
  router.push('/app')
}

function startNewChat() {
  chatStore.startNewConversation()
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function sendMessage(content: string, imageUrl?: string) {
  if (!currentRole.value) return
  chatStore.sendMessage(currentRole.value._id, content, imageUrl)
}

function previewImage(url: string) {
  previewImageUrl.value = url
}

// Load a specific conversation from history
async function loadConversation(convId: string) {
  if (!currentRole.value) return
  await chatStore.loadHistory(currentRole.value._id, convId)
}

// Truncate text for preview
function truncateText(text: string, maxLen: number): string {
  if (!text) return '(无内容)'
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

// Format timestamp for display
function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000)
    return mins <= 1 ? '刚刚' : `${mins}分钟前`
  }
  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }
  // Older - show date
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f9f7f2; /* Warm Bg */
}

/* Sidebar - Warm & Collapsible */
.sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-right: 1px solid rgba(0,0,0,0.06);
  background: #f4f3ef;
  position: relative;
  /* Smoother, slightly slower transition with custom bezier */
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible; 
  will-change: width;
}

.sidebar.collapsed {
  width: 0;
  padding: 1.5rem 0;
  border-right: none;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 1;
  transition: opacity 0.3s ease;
  min-width: 280px; /* Crucial: prevents content squashing during anim */
}

.sidebar-content.hidden {
  opacity: 0;
  pointer-events: none;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  right: -16px; 
  width: 32px;
  height: 32px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy pop */
  color: #1d1d1f;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}

.role-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  color: #1d1d1f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.back-btn:hover {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.role-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.role-details h2 {
  font-size: 1.25rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  color: #1d1d1f;
}

.personality-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #e8e6e1;
  color: #555;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
}

.new-chat-btn {
  margin-bottom: 2rem;
  width: 100%;
}

.role-description {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.role-description::-webkit-scrollbar {
  width: 4px;
}
.role-description::-webkit-scrollbar-thumb {
  background: #d1d1d6;
  border-radius: 4px;
}

.role-description h4 {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.role-description p {
  font-size: 0.95rem;
  color: #48484a;
  line-height: 1.6;
}

/* History Section */
.history-section {
  margin-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 1rem;
}

.history-section h4 {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}
.history-list::-webkit-scrollbar-thumb {
  background: #d1d1d6;
  border-radius: 4px;
}

.history-item {
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0,0,0,0.04);
}

.history-item:hover {
  background: #f8f7f5;
  transform: translateX(4px);
}

.history-item.active {
  background: #e8f4ff;
  border-color: rgba(0,122,255,0.2);
}

.history-preview {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.history-time {
  font-size: 0.75rem;
  color: #999;
}

/* Main Chat Area */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  background: transparent;
  z-index: 1; /* Ensure relative to background effects */
}

/* Messages container higher than bg */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  scroll-behavior: smooth;
  position: relative;
  z-index: 2; 
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #888;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-avatar {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  background: #fdfcf8;
}

.welcome-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-avatar .avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
  color: #ccc;
  background: #f4f3ef;
}

.welcome-message h3 {
  color: #1d1d1f;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.welcome-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  font-style: italic;
}

.input-area {
  padding: 1.5rem 2rem;
  background: #ffffff;
  border-top: 1px solid rgba(0,0,0,0.05);
  position: relative;
  z-index: 10;
}

/* Image Preview Modal */
.image-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 280px;
    transform: translateX(-100%);
    z-index: 100;
    transition: transform 0.3s ease, width 0.3s ease;
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 280px; 
  }

  .messages-container {
    padding: 1rem;
  }

  .input-area {
    padding: 1rem;
  }
}
</style>
