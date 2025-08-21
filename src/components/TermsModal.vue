<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2>Terms & Conditions</h2>
        <button 
          ref="closeBtn"
          class="close-btn"
          @click="$emit('close')"
          data-focus-index="1"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- Content -->
      <div class="modal-content">
        <p class="modal-text">
          To create your ARKON account, please review our terms and conditions.
        </p>
        
        <div class="terms-box">
          <p class="terms-text">
            By clicking "I Agree," you agree to PhoneBurner's
            <button 
              class="link-btn"
              @click="openTerms"
              data-focus-index="2"
            >terms of service</button>,
            <button 
              class="link-btn"
              @click="openPrivacy"
              data-focus-index="3"
            >privacy policy</button>
            and 
            <button 
              class="link-btn"
              @click="openAcceptable"
              data-focus-index="4"
            >acceptable use policy</button>.
          </p>
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="modal-buttons">
        <button
          class="cancel-btn"
          @click="$emit('cancel')"
          data-focus-index="5"
        >
          Cancel
        </button>
        <button
          class="agree-btn"
          @click="handleAgree"
          data-focus-index="6"
        >
          I Agree
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'

// Define props
interface Props {
  visible?: boolean
}

const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  close: []
  cancel: []
  agree: []
}>()

// Template refs
const closeBtn = ref<HTMLButtonElement | null>(null)

// Focus management
const focusableElements = ref<HTMLElement[]>([])

const setupFocusManagement = () => {
  // Find all focusable elements and sort by data-focus-index
  const elements = Array.from(document.querySelectorAll('[data-focus-index]')) as HTMLElement[]
  focusableElements.value = elements.sort((a, b) => {
    const aIndex = parseInt(a.getAttribute('data-focus-index') || '0')
    const bIndex = parseInt(b.getAttribute('data-focus-index') || '0')
    return aIndex - bIndex
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.visible) return
  
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  
  if (event.key === 'Tab') {
    event.preventDefault()
    
    const currentElement = document.activeElement as HTMLElement
    const currentIndex = focusableElements.value.findIndex(el => el === currentElement)
    
    let nextIndex: number
    if (event.shiftKey) {
      // Shift+Tab (backward)
      nextIndex = currentIndex <= 0 ? focusableElements.value.length - 1 : currentIndex - 1
    } else {
      // Tab (forward)
      nextIndex = currentIndex >= focusableElements.value.length - 1 ? 0 : currentIndex + 1
    }
    
    focusableElements.value[nextIndex]?.focus()
  }
}

// Watch for modal visibility
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      setupFocusManagement()
      if (closeBtn.value) {
        closeBtn.value.focus()
      }
    })
  }
})

// Event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Methods
const handleAgree = (): void => {
  emit('agree')
}

const openTerms = () => {
  console.log('Opening terms of service')
}

const openPrivacy = () => {
  console.log('Opening privacy policy')
}

const openAcceptable = () => {
  console.log('Opening acceptable use policy')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal-container {
  background: #1e293b;
  border: 1px solid #9333FF;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #374151;
  color: white;
}

.close-btn:focus {
  outline: 2px solid #9333FF;
  outline-offset: 2px;
}

.modal-content {
  margin-bottom: 1.5rem;
}

.modal-text {
  color: white;
  font-size: 1rem;
  line-height: 1.625;
  margin-bottom: 1.5rem;
}

.terms-box {
  background: #0f172a;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  padding: 1rem;
}

.terms-text {
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.625;
  margin: 0;
}

.link-btn {
  background: transparent;
  border: none;
  color: #60a5fa;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0;
  transition: color 0.2s;
}

.link-btn:hover {
  color: #93c5fd;
}

.link-btn:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
  border-radius: 2px;
}

.modal-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.cancel-btn, .agree-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.cancel-btn {
  background: #4b5563;
  color: white;
}

.cancel-btn:hover {
  background: #6b7280;
}

.cancel-btn:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}

.agree-btn {
  background: #7c3aed;
  color: white;
}

.agree-btn:hover {
  background: #8b5cf6;
}

.agree-btn:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}
</style>
