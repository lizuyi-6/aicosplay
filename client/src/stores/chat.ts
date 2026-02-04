import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Message {
    _id?: string
    role: 'user' | 'assistant'
    content: string
    imageUrl?: string | null
    createdAt?: string
    isStreaming?: boolean
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

export const useChatStore = defineStore('chat', () => {
    const messages = ref<Message[]>([])
    const conversationId = ref<string>(generateConversationId())
    const isStreaming = ref(false)
    const error = ref<string | null>(null)
    const conversations = ref<{ _id: string; lastMessage: string; lastTime: string }[]>([])

    function generateConversationId(): string {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    function startNewConversation() {
        messages.value = []
        conversationId.value = generateConversationId()
    }

    async function fetchConversations(roleId: string) {
        try {
            const response = await fetch(`${API_BASE}/chat/conversations/${roleId}`, { credentials: 'include' })
            if (!response.ok) throw new Error('获取对话列表失败')
            conversations.value = await response.json()
        } catch (e) {
            console.error('Failed to fetch conversations:', e)
            conversations.value = []
        }
    }

    async function loadHistory(roleId: string, convId: string) {
        try {
            const response = await fetch(`${API_BASE}/chat/history/${roleId}/${convId}`, { credentials: 'include' })
            if (!response.ok) throw new Error('加载历史记录失败')
            messages.value = await response.json()
            conversationId.value = convId
        } catch (e) {
            error.value = (e as Error).message
        }
    }

    async function sendMessage(roleId: string, content: string, imageUrl?: string) {
        error.value = null

        // Add user message to UI immediately
        const userMessage: Message = {
            role: 'user',
            content,
            imageUrl: imageUrl || null,
            createdAt: new Date().toISOString()
        }
        messages.value.push(userMessage)

        // Add placeholder for assistant response
        const assistantMessage: Message = {
            role: 'assistant',
            content: '',
            isStreaming: true,
            createdAt: new Date().toISOString()
        }
        messages.value.push(assistantMessage)
        const assistantIndex = messages.value.length - 1

        isStreaming.value = true

        // Keep a reference to the assistant message for type safety
        const assistantMsg = messages.value[assistantIndex]
        if (!assistantMsg) {
            throw new Error('Assistant message not found')
        }

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    roleId,
                    conversationId: conversationId.value,
                    message: content,
                    imageUrl
                })
            })

            if (!response.ok) {
                throw new Error('发送消息失败')
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (!reader) {
                throw new Error('无法读取响应流')
            }

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))
                            if (data.content) {
                                assistantMsg.content += data.content
                            }
                            if (data.done) {
                                assistantMsg.isStreaming = false
                            }
                            if (data.error) {
                                throw new Error(data.error)
                            }
                        } catch (e) {
                            // Ignore JSON parse errors for incomplete chunks
                        }
                    }
                }
            }

        } catch (e) {
            error.value = (e as Error).message
            assistantMsg.content = '抱歉，发生了错误：' + (e as Error).message
        } finally {
            isStreaming.value = false
            assistantMsg.isStreaming = false
            // Refresh conversation list to show the new/updated conversation
            await fetchConversations(roleId)
        }
    }

    return {
        messages,
        conversationId,
        isStreaming,
        error,
        conversations,
        startNewConversation,
        fetchConversations,
        loadHistory,
        sendMessage
    }
})

