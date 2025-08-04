<template>
  <div class="mt-4">
    <div class="flex items-center bg-gray-900/90 backdrop-blur-[10px] border border-gray-600/40 rounded-xl px-3 py-2 gap-2">
      <InputText
        v-model="inputValue"
        placeholder="Ask me to talk to Jenn"
        class="flex-1 bg-transparent border-none text-white text-base px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-0"
        @keyup.enter="handleSend"
      />
      <Button
        icon="pi pi-microphone"
        class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white"
        text
        @click="$emit('voice-input')"
      />
      <Button
        icon="pi pi-send"
        class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white disabled:opacity-50 disabled:text-gray-600"
        :disabled="!inputValue.trim()"
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// Define emits
const emit = defineEmits(['send-message', 'voice-input'])

// Reactive data
const inputValue = ref('')

// Methods
const handleSend = () => {
  if (inputValue.value.trim()) {
    emit('send-message', inputValue.value.trim())
    inputValue.value = ''
  }
}

// Expose methods to parent if needed
defineExpose({
  setInputValue: (value) => {
    inputValue.value = value
  },
  clearInput: () => {
    inputValue.value = ''
  }
})
</script>
