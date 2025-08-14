<template>
  <div v-if="visible" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click="handleOverlayClick">
    <div class="bg-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl border border-slate-700" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white text-xl font-semibold">Terms & Conditions</h2>
        <button 
          class="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
          @click="$emit('close')"
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
            <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">terms of service</a>, 
            <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">privacy policy</a> 
            and <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">acceptable use policy</a>.
          </p>
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="flex gap-3 justify-end">
        <Button
          label="Cancel"
          class="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all duration-200"
          @click="$emit('cancel')"
        />
        <Button
          label="I Agree"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
          @click="handleAgree"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define props
interface Props {
  visible?: boolean
}

defineProps<Props>()

// Define emits
const emit = defineEmits<{
  close: []
  cancel: []
  agree: []
}>()

// Methods
const handleAgree = (): void => {
  emit('agree')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
/* Custom button styling */
:deep(.p-button) {
  border: none !important;
  font-weight: 500 !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}
</style>
