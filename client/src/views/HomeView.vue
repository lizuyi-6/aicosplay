<template>
  <div class="home-view">
    <header class="page-header animate-slide-up">
      <h1 class="title">
        <span class="gradient-text">角色扮演</span> AI 对话
      </h1>
      <p class="subtitle">选择或创建一个角色，开始沉浸式对话体验</p>
    </header>

    <div class="actions animate-slide-up" style="animation-delay: 0.1s;">
      <button class="btn btn-primary" @click="showCreateModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        创建新角色
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="roleStore.loading" class="loading-state-wrapper animate-fade-in">
      <GoogleLoading :messages="[
        'AI 正在研判角色性格...',
        '正在为你生成专属 SVG 背景...',
        '正在构建角色记忆...',
        '正在注入灵魂...',
        '即将完成...'
      ]" />
    </div>

    <!-- Empty state -->
    <div v-else-if="roleStore.roles.length === 0" class="empty-state glass-card animate-fade-in">
      <div class="empty-icon">🎭</div>
      <h3>还没有角色</h3>
      <p>创建你的第一个虚拟角色，开始对话吧！</p>
    </div>

    <!-- Role list -->
    <div v-else class="role-grid animate-fade-in">
      <RoleCard 
        v-for="(role, index) in roleStore.sortedRoles" 
        :key="role._id" 
        :role="role"
        @select="selectRole"
        @delete="confirmDelete"
        :style="{ animationDelay: `${index * 0.05}s` }"
        class="animate-slide-up"
      />
    </div>

    <!-- Create Role Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
          <div class="modal glass-card">
            <h2 class="modal-title">创建新角色</h2>
            
            <form @submit.prevent="createRole" class="create-form">
              <div class="form-group">
                <label>角色名称 *</label>
                <input v-model="newRole.name" class="input" placeholder="例如：赛博朋克侦探" required />
              </div>

              <div class="form-group">
                <label>头像 URL</label>
                <input v-model="newRole.avatar" class="input" placeholder="https://example.com/avatar.jpg" />
              </div>

              <div class="form-group">
                <label>性格特点 *</label>
                <input v-model="newRole.personality" class="input" placeholder="例如：冷酷、睿智、有正义感" required />
              </div>

              <div class="form-group">
                <label>背景故事 *</label>
                <textarea v-model="newRole.description" class="input" rows="4" placeholder="详细描述角色的背景、经历和特点..." required></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showCreateModal = false">取消</button>
                <button type="submit" class="btn btn-primary" :disabled="roleStore.loading">
                  {{ roleStore.loading ? '创建中...' : '创建角色' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore, type Role } from '@/stores/role'
import RoleCard from '@/components/RoleCard.vue'
import GoogleLoading from '@/components/GoogleLoading.vue'

const router = useRouter()
const roleStore = useRoleStore()

const showCreateModal = ref(false)
const newRole = ref({
  name: '',
  avatar: '',
  personality: '',
  description: '',
  systemPrompt: ''
})

onMounted(() => {
  roleStore.fetchRoles()
})

function selectRole(role: Role) {
  roleStore.setCurrentRole(role)
  router.push(`/chat/${role._id}`)
}

async function createRole() {
  showCreateModal.value = false
  const created = await roleStore.createRole(newRole.value)
  if (created && created._id) {
    newRole.value = { name: '', avatar: '', personality: '', description: '', systemPrompt: '' }
    roleStore.setCurrentRole(created)
    router.push(`/chat/${created._id}`)
  } else {
    // Error handling: if failed, we might want to re-show modal to save user data
    if (roleStore.error) showCreateModal.value = true
  }
}

async function confirmDelete(id: string) {
  if (confirm('确定要删除这个角色吗？')) {
    await roleStore.deleteRole(id)
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
  background-color: transparent; /* Use global warm bg */
  min-height: 100vh;
  color: #1d1d1f;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  position: relative;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #1d1d1f;
}

.gradient-text {
  background: linear-gradient(135deg, #1d1d1f 0%, #48484a 100%); /* Elegant Dark Gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666666;
  font-size: 1.25rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: #666;
  font-weight: 500;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(0,0,0,0.05);
  border-top-color: #1d1d1f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  border: 1px dashed rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
  border-radius: 24px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: var(--spacing-md);
  opacity: 1;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
  color: #1d1d1f;
  font-weight: 700;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

/* Modal Styles - Warm Theme */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4); 
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
  border: 1px solid rgba(0,0,0,0.05);
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
  color: #1d1d1f;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}
</style>
