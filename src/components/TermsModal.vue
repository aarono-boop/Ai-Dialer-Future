<template>
  <div v-if="visible" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 terms-background" @click="handleOverlayClick" @keydown="handleModalKeydown">
    <div class="bg-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl border border-slate-700" @click.stop tabindex="-1">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white text-xl font-semibold">Terms & Conditions</h2>
        <button
          ref="closeButtonRef"
          class="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
          @click="$emit('close')"
          tabindex="1"
          aria-label="Close Terms & Conditions modal"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>
      
      <!-- Content -->
      <div class="mb-6">
        <p class="text-white text-base leading-relaxed mb-6">
          To create your ARKON account, please review our terms and conditions.
        </p>
        
        <!-- Terms Agreement Box -->
        <div class="bg-slate-900 border border-slate-600 rounded-lg p-4">
          <p class="text-slate-300 text-sm leading-relaxed">
            By clicking "I Agree," you agree to PhoneBurner's
            <button type="button" class="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline bg-transparent border-none cursor-pointer focus:ring-2 focus:ring-yellow-400" tabindex="2" @focus="() => console.log('Terms link focused')">terms of service</button>,
            <button type="button" class="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline bg-transparent border-none cursor-pointer focus:ring-2 focus:ring-yellow-400" tabindex="3" @focus="() => console.log('Privacy link focused')">privacy policy</button>
            and <button type="button" class="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline bg-transparent border-none cursor-pointer focus:ring-2 focus:ring-yellow-400" tabindex="4" @focus="() => console.log('Acceptable use link focused')">acceptable use policy</button>.
          </p>
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          type="button"
          class="btn-secondary px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:bg-gray-600"
          @click="$emit('cancel')"
          tabindex="5"
          aria-label="Cancel and close modal"
          @focus="() => console.log('Cancel button focused')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:bg-purple-600"
          @click="handleAgree"
          tabindex="6"
          aria-label="Agree to terms and conditions"
          @focus="() => console.log('I Agree button focused')"
        >
          I Agree
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { DSButton } from '@/design-system/components'

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
const closeButtonRef = ref<HTMLButtonElement | null>(null)

// Watch for modal visibility to manage focus
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      if (closeButtonRef.value) {
        closeButtonRef.value.focus()
      }
    })
  }
})

// Modal keydown handler for escape key
const handleModalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// No custom tab handlers needed - let browser handle natural tab flow

// Methods
const handleAgree = (): void => {
  emit('agree')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
/* Background pattern */
.terms-background {
  background-color: #242733;
  background-image:
    /* A vignette to create the radial gradient effect for the dots */
    radial-gradient(ellipse at center, transparent 0%, rgba(36, 39, 51, 0.8) 80%),
    /* The dot pattern */
    radial-gradient(circle, #5D5F69 1px, transparent 1px);
  background-size: 100% 100%, 16px 16px;
}

/* Custom button styling */
:deep(.p-button) {
  border: none !important;
  font-weight: 500 !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}
</style>
