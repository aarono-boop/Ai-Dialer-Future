<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Terms & Conditions"
    :style="{ width: '28rem' }"
    :dismissableMask="true"
    @hide="$emit('close')"
    class="terms-dialog"
  >
    <!-- Custom header with close button -->
    <template #header>
      <div class="dialog-header">
        <h2 class="dialog-title">Terms & Conditions</h2>
      </div>
    </template>

    <!-- Dialog Content -->
    <div class="dialog-content">
      <p class="dialog-text">
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

    <!-- Dialog Footer with action buttons -->
    <template #footer>
      <div class="dialog-footer">
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
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import Dialog from 'primevue/dialog'
import { DSButton } from '../../design-system'
import { useDesignTokens } from '../../design-system/composables/useDesignTokens'

// Access design tokens
const { cssVariables } = useDesignTokens()

// Define props
interface Props {
  visible?: boolean
}

const props = defineProps<Props>()

// Create a computed property for v-model compatibility
const isVisible = computed({
  get: () => props.visible || false,
  set: (value: boolean) => {
    if (!value) {
      emit('close')
    }
  }
})

// Define emits
const emit = defineEmits<{
  close: []
  cancel: []
  agree: []
}>()

// Focus management for custom buttons (PrimeVue Dialog handles most focus management)
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

  // Handle Tab navigation for our custom focus index system
  if (event.key === 'Tab' && focusableElements.value.length > 0) {
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

// Watch for dialog visibility
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      setupFocusManagement()
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
/* Apply design tokens as CSS variables globally */
:global(:root) {
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

/* Style the PrimeVue Dialog component using design tokens */
.terms-dialog :deep(.p-dialog) {
  background: var(--ds-color-neutral-800);
  border: 2px solid var(--ds-color-primary-500);
  border-radius: var(--ds-border-radius-2xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.terms-dialog :deep(.p-dialog-header) {
  background: transparent;
  border-bottom: none;
  padding: var(--ds-spacing-6) var(--ds-spacing-6) 0;
}

.terms-dialog :deep(.p-dialog-content) {
  background: transparent;
  padding: var(--ds-spacing-4) var(--ds-spacing-6);
}

.terms-dialog :deep(.p-dialog-footer) {
  background: transparent;
  border-top: none;
  padding: 0 var(--ds-spacing-6) var(--ds-spacing-6);
}

.terms-dialog :deep(.p-dialog-header-close) {
  color: var(--ds-color-text-secondary);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.terms-dialog :deep(.p-dialog-header-close:hover) {
  background: var(--ds-color-neutral-700);
  color: var(--ds-color-text-primary);
}

.terms-dialog :deep(.p-dialog-mask) {
  background: rgba(0, 0, 0, 0.95) !important;
}

/* Dialog Header */
.dialog-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.dialog-title {
  color: var(--ds-color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* Dialog Content */
.dialog-content {
  margin-bottom: var(--ds-spacing-4);
}

.dialog-text {
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

/* Dialog Footer */
.dialog-footer {
  display: flex;
  gap: var(--ds-spacing-3);
  justify-content: flex-end;
}
</style>
