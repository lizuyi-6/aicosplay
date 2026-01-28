<template>
  <div class="chat-input-container glass-card">
    <!-- Image preview -->
    <div v-if="previewUrl" class="image-preview">
      <img :src="previewUrl" alt="预览" />
      <button class="remove-image" @click="removeImage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="input-row">
      <!-- Image upload button -->
      <label class="upload-btn btn btn-icon btn-secondary" title="上传图片">
        <input 
          type="file" 
          accept="image/*" 
          @change="handleFileSelect" 
          hidden 
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </label>

      <!-- Text input -->
      <textarea 
        ref="inputRef"
        v-model="inputText"
        class="input chat-textarea"
        placeholder="输入消息..."
        rows="1"
        @keydown.enter.exact.prevent="handleSend"
        @input="autoResize"
      ></textarea>

      <!-- Send button -->
      <button 
        class="send-btn btn btn-primary btn-icon" 
        @click="handleSend"
        :disabled="!canSend || isUploading"
        title="发送"
      >
        <svg v-if="!isUploading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span v-else class="spinner"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'send', message: string, imageUrl?: string): void
}>()

const props = defineProps<{
  disabled?: boolean
}>()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const inputRef = ref<HTMLTextAreaElement | null>(null)
const inputText = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploadedImageUrl = ref<string | null>(null)
const isUploading = ref(false)

const canSend = computed(() => {
  return (inputText.value.trim() || uploadedImageUrl.value) && !props.disabled
})

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  
  // Compress before upload
  try {
    const compressedFile = await compressImage(file)
    uploadImage(compressedFile)
  } catch (e) {
    console.error('Compression failed, uploading original', e)
    uploadImage(file)
  }
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 1920
        const maxHeight = 1920
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Canvas to Blob failed'))
          }
        }, 'image/jpeg', 0.8)
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}

async function uploadImage(file: File) {
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    if (!response.ok) throw new Error('上传失败')
    
    const data = await response.json()
    uploadedImageUrl.value = data.imageUrl
  } catch (error) {
    console.error('Upload error:', error)
    removeImage()
    alert('图片上传失败，请重试')
  } finally {
    isUploading.value = false
  }
}

function removeImage() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFile.value = null
  previewUrl.value = null
  uploadedImageUrl.value = null
}

function handleSend() {
  if (!canSend.value) return

  emit('send', inputText.value.trim(), uploadedImageUrl.value || undefined)
  
  inputText.value = ''
  removeImage()
  
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
}

function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 150) + 'px'
  }
}
</script>

<style scoped>
.chat-input-container {
  padding: var(--spacing-md);
  border-radius: var(--radius-xl);
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);
}

.image-preview img {
  max-width: 150px;
  max-height: 100px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.remove-image:hover {
  transform: scale(1.1);
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.upload-btn {
  flex-shrink: 0;
  cursor: pointer;
}

.chat-textarea {
  flex: 1;
  min-height: 48px;
  max-height: 200px;
  resize: none;
  padding: 12px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  background: white;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color var(--transition-fast);
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #d1d1d6 transparent;
}

.chat-textarea:focus {
  outline: none;
  border-color: #1d1d1f;
}

.chat-textarea::-webkit-scrollbar {
  width: 6px;
}
.chat-textarea::-webkit-scrollbar-thumb {
  background-color: #d1d1d6;
  border-radius: 3px;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
