<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Terms & Conditions"
    :style="{ width: '28rem' }"
    :dismissableMask="true"
    @hide="$emit('close')"
  >
    <!-- Dialog Content -->
    <p>
      To create your ARKON account, please review our terms and conditions.
    </p>

    <div style="background: var(--p-surface-800); border: 1px solid var(--p-surface-600); border-radius: 0.5rem; padding: 1rem; margin: 1.5rem 0; color: var(--p-text-muted-color); font-size: 0.875rem; line-height: 1.625;">
      <p style="margin: 0;">
        By clicking "I Agree," you agree to PhoneBurner's
        <button
          @click="openTerms"
          data-focus-index="2"
          class="link-button"
        >terms of service</button>,
        <button
          @click="openPrivacy"
          data-focus-index="3"
          class="link-button"
        >privacy policy</button>
        and
        <button
          @click="openAcceptable"
          data-focus-index="4"
          class="link-button"
        >acceptable use policy</button>.
      </p>
    </div>

    <!-- Dialog Footer with action buttons -->
    <template #footer>
      <DSButton
        variant="outlined"
        label="Cancel"
        @click="$emit('cancel')"
        data-focus-index="5"
      />
      <DSButton
        variant="primary"
        label="I Agree"
        @click="handleAgree"
        data-focus-index="6"
      />
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
/* All dialog styling handled by PrimeVue design tokens in dialog.ts */

/* Inline link buttons should look like text links */
.link-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: var(--p-primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  display: inline;
}

.link-button:hover {
  color: var(--p-primary-300);
}

.link-button:focus {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 1px;
  border-radius: 2px;
}
</style>
