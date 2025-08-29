<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2>Terms & Conditions</h2>
        <DSButton
          ref="closeBtn"
          variant="text"
          icon="pi pi-times"
          @click="$emit('close')"
          data-focus-index="1"
          aria-label="Close modal"
          class="close-btn"
        />
      </div>

      <!-- Content -->
      <div class="modal-content">
        <p class="modal-text">
          To create your ARKON account, please review our terms and conditions.
        </p>

        <div class="terms-box">
          <p class="terms-text">
            By clicking "I Agree," you agree to PhoneBurner's
            <DSButton
              variant="text"
              label="terms of service"
              @click="openTerms"
              data-focus-index="2"
              class="link-btn"
            />,
            <DSButton
              variant="text"
              label="privacy policy"
              @click="openPrivacy"
              data-focus-index="3"
              class="link-btn"
            />
            and
            <DSButton
              variant="text"
              label="acceptable use policy"
              @click="openAcceptable"
              data-focus-index="4"
              class="link-btn"
            />.
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="modal-buttons">
        <DSButton
          variant="outlined"
          label="Cancel"
          @click="$emit('cancel')"
          data-focus-index="5"
          class="cancel-btn"
        />
        <DSButton
          variant="primary"
          label="I Agree"
          @click="handleAgree"
          data-focus-index="6"
          class="agree-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { DSButton } from '../design-system'
import { useDesignTokens } from '../design-system/composables/useDesignTokens'

// Access design tokens
const { cssVariables } = useDesignTokens()

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
  padding: var(--ds-spacing-4);
  z-index: 50;
}

.modal-container {
  background: var(--ds-color-neutral-800);
  border: 1px solid var(--ds-color-primary-500);
  border-radius: var(--ds-border-radius-2xl);
  padding: var(--ds-spacing-6);
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ds-spacing-6);
}

.modal-header h2 {
  color: var(--ds-color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.modal-content {
  margin-bottom: var(--ds-spacing-6);
}

.modal-text {
  color: var(--ds-color-text-primary);
  font-size: 1rem;
  line-height: 1.625;
  margin-bottom: var(--ds-spacing-6);
}

.terms-box {
  background: var(--ds-color-neutral-950);
  border: 1px solid var(--ds-color-neutral-600);
  border-radius: var(--ds-border-radius-lg);
  padding: var(--ds-spacing-4);
}

.terms-text {
  color: var(--ds-color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.625;
  margin: 0;
}

.link-btn {
  color: var(--ds-color-primary-400);
  text-decoration: underline;
  font-size: inherit;
  padding: 0;
  margin: 0;
}

.modal-buttons {
  display: flex;
  gap: var(--ds-spacing-3);
  justify-content: flex-end;
}

/* Apply design tokens as CSS variables */
.modal-overlay {
  --ds-spacing-0: 0;
  --ds-spacing-1: 0.25rem;
  --ds-spacing-2: 0.5rem;
  --ds-spacing-3: 0.75rem;
  --ds-spacing-4: 1rem;
  --ds-spacing-5: 1.25rem;
  --ds-spacing-6: 1.5rem;
  --ds-spacing-8: 2rem;
  --ds-border-radius-lg: 0.5rem;
  --ds-border-radius-2xl: 1rem;
  --ds-color-neutral-600: #4b5563;
  --ds-color-neutral-800: #1f2937;
  --ds-color-neutral-950: #030712;
  --ds-color-primary-400: #a78bfa;
  --ds-color-primary-500: #9333FF;
  --ds-color-text-primary: #ffffff;
  --ds-color-text-secondary: #9ca3af;
}
</style>
