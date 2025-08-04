<template>
  <div v-if="visible" class="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] z-[1000] flex items-center justify-center p-8 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(75,0,130,0.05)_0%,transparent_50%)] before:pointer-events-none" @click="handleOverlayClick">
    <div class="bg-slate-700/95 backdrop-blur-[20px] border border-white/10 rounded-xl max-w-lg w-full relative shadow-2xl" @click.stop>
      <div class="flex items-center justify-between px-8 py-6 pb-4 border-b border-white/10">
        <h2 class="text-white text-xl font-semibold m-0">Terms of Service</h2>
        <button 
          class="absolute top-4 right-4 bg-none border-none text-white/60 text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 hover:text-white/90" 
          @click="$emit('close')"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="px-8 py-6 pb-8">
        <p class="text-white/90 text-sm leading-relaxed mb-6 mt-0">
          To create your PhoneBurner account and start your free trial, please review and agree to our policies.
        </p>
        
        <div class="flex items-start gap-3 mb-8 p-4 bg-white/5 border border-white/10 rounded-lg">
          <input 
            type="checkbox" 
            id="agreeTerms" 
            v-model="agreeToTerms" 
            class="w-[18px] h-[18px] bg-white/5 border border-white/20 rounded accent-purple-500 mt-0.5 flex-shrink-0"
          />
          <label for="agreeTerms" class="text-white/90 text-sm leading-relaxed cursor-pointer">
            I agree with PhoneBurner's 
            <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">terms of service</a>, 
            <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">privacy policy</a> 
            and <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">acceptable use policy</a>.
          </label>
        </div>
        
        <div class="flex gap-4 justify-end">
          <Button
            label="Cancel"
            class="bg-transparent border border-white/30 text-white/80 px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5 hover:border-white/50 hover:text-white"
            @click="$emit('cancel')"
          />
          <Button
            label="Agree and Continue"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!agreeToTerms"
            @click="handleAgree"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

// Reactive data
const agreeToTerms = ref<boolean>(false)

// Methods
const handleAgree = (): void => {
  if (agreeToTerms.value) {
    emit('agree')
    agreeToTerms.value = false
  }
}

const handleOverlayClick = () => {
  emit('close')
}
</script>
