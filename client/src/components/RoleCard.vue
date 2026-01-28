<template>
  <div class="role-card glass-card glass-card-hover" @click="$emit('select', role)">
    <div class="role-avatar">
      <img v-if="role.avatar" :src="role.avatar" :alt="role.name" />
      <div v-else class="avatar-placeholder">
        {{ role.name.charAt(0) }}
      </div>
    </div>
    <div class="role-info">
      <h3 class="role-name">{{ role.name }}</h3>
      <span class="role-personality">{{ role.personality }}</span>
      <p class="role-description">{{ truncatedDescription }}</p>
    </div>
    <button class="delete-btn" @click.stop="$emit('delete', role._id)" title="删除角色">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Role } from '@/stores/role'

const props = defineProps<{
  role: Role
}>()

defineEmits<{
  (e: 'select', role: Role): void
  (e: 'delete', id: string): void
}>()

const truncatedDescription = computed(() => {
  if (props.role.description.length > 80) {
    return props.role.description.slice(0, 80) + '...'
  }
  return props.role.description
})
</script>

<style scoped>
.role-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: 1.25rem;
  cursor: pointer;
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: #1d1d1f;
}

.role-avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: #f0eee9;
  border: 1px solid rgba(0,0,0,0.05);
}

.role-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #999;
  background: #f4f3ef;
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1d1d1f;
}

.role-personality {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f0f0;
  color: #666;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.role-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  color: #999;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.role-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #ffeced;
  color: #ff3b30;
  border-color: #ff3b30;
}
</style>
