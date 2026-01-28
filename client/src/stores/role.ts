import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Role {
    _id: string
    name: string
    avatar: string
    personality: string
    description: string
    systemPrompt: string
    createdAt: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

export const useRoleStore = defineStore('role', () => {
    const roles = ref<Role[]>([])
    const currentRole = ref<Role | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const sortedRoles = computed(() => {
        return [...roles.value].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    })

    async function fetchRoles() {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`${API_BASE}/roles`, { credentials: 'include' })
            if (!response.ok) throw new Error('获取角色列表失败')
            roles.value = await response.json()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function fetchRole(id: string) {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`${API_BASE}/roles/${id}`, { credentials: 'include' })
            if (!response.ok) throw new Error('获取角色详情失败')
            currentRole.value = await response.json()
            return currentRole.value
        } catch (e) {
            error.value = (e as Error).message
            return null
        } finally {
            loading.value = false
        }
    }

    async function createRole(roleData: Omit<Role, '_id' | 'createdAt'>) {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`${API_BASE}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(roleData)
            })
            if (!response.ok) throw new Error('创建角色失败')
            const newRole = await response.json()
            roles.value.unshift(newRole)
            return newRole
        } catch (e) {
            error.value = (e as Error).message
            return null
        } finally {
            loading.value = false
        }
    }

    async function deleteRole(id: string) {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`${API_BASE}/roles/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (!response.ok) throw new Error('删除角色失败')
            roles.value = roles.value.filter(r => r._id !== id)
            return true
        } catch (e) {
            error.value = (e as Error).message
            return false
        } finally {
            loading.value = false
        }
    }

    function setCurrentRole(role: Role | null) {
        currentRole.value = role
    }

    return {
        roles,
        currentRole,
        loading,
        error,
        sortedRoles,
        fetchRoles,
        fetchRole,
        createRole,
        deleteRole,
        setCurrentRole
    }
})
