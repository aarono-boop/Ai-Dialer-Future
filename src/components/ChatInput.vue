<template>
  <div class="mt-4">
    <div class="flex items-center bg-gray-800 backdrop-blur-[10px] border border-gray-600 rounded-xl px-3 py-2 gap-2 w-1/2 mx-auto">
      <InputText
        v-model="inputValue"
        :placeholder="props.customPlaceholder || animatedPlaceholder"
        class="flex-1 bg-transparent border-none text-white text-base px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-0"
        style="background-color: transparent !important; color: white !important;"
        @keyup.enter="handleSend"
        @focus="pauseAnimation"
        @blur="resumeAnimation"
      />
      <Button
        icon="pi pi-send"
        class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white disabled:opacity-50 disabled:text-gray-600"
        :disabled="!inputValue.trim()"
        text
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// Define props
const props = defineProps<{
  customPlaceholder?: string
}>()

// Define emits
const emit = defineEmits(['send-message', 'voice-input'])

// Reactive data
const inputValue = ref<string>('')
const animatedPlaceholder = ref<string>('Ask me')
const isAnimating = ref<boolean>(true)
let animationInterval: number | null = null
let currentPromptIndex: number = 0
let currentCharIndex: number = 0
let isTypingForward: boolean = true
let isWaiting: boolean = false
let isWaitingAtEllipsis: boolean = false

// Animation prompts
const prompts: string[] = [
  'Ask me anything about ARKON...',
  'Ask me how to get connected to more calls...',
  'Ask me to setup a demo...',
  'Ask me who I should call right now...',
  'Ask me to fire up a dial session with specifics...',
  'Ask me to set a reminder...',
  'Ask me to practice a call...',
  'Ask me what appointments I have today...',
  'Ask me to tell a joke...'
]

// Animation logic
const startTypingAnimation = (): void => {
  if (!isAnimating.value || props.customPlaceholder) return

  animationInterval = setInterval(() => {
    if (isWaiting) {
      return // Stay in waiting state
    }

    if (isWaitingAtEllipsis) {
      return // Stay paused at ellipsis
    }

    const currentPrompt = prompts[currentPromptIndex]
    const baseText = 'Ask me'

    if (isTypingForward) {
      if (currentCharIndex < currentPrompt.length) {
        animatedPlaceholder.value = currentPrompt.substring(0, currentCharIndex + 1)
        currentCharIndex++

        // Check if we just completed typing and the prompt ends with "..."
        if (currentCharIndex === currentPrompt.length && currentPrompt.endsWith('...')) {
          isWaitingAtEllipsis = true
          setTimeout(() => {
            isWaitingAtEllipsis = false
          }, 1000) // 1 second pause at ellipsis
        }
      } else {
        // Finished typing, wait for 2 seconds before starting to delete
        isWaiting = true
        setTimeout(() => {
          isWaiting = false
          isTypingForward = false
        }, 2000)
      }
    } else {
      if (currentCharIndex > baseText.length) {
        currentCharIndex--
        animatedPlaceholder.value = currentPrompt.substring(0, currentCharIndex)
      } else {
        // Move to next prompt
        currentPromptIndex = (currentPromptIndex + 1) % prompts.length
        currentCharIndex = baseText.length
        isTypingForward = true
        animatedPlaceholder.value = baseText
      }
    }
  }, 40) // Typing speed
}

const pauseAnimation = () => {
  isAnimating.value = false
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
  animatedPlaceholder.value = 'Type your message...'
}

const resumeAnimation = () => {
  if (inputValue.value === '') {
    isAnimating.value = true
    animatedPlaceholder.value = 'Ask me'
    startTypingAnimation()
  }
}

// Methods
const handleSend = () => {
  if (inputValue.value.trim()) {
    emit('send-message', inputValue.value.trim())
    inputValue.value = ''
  }
}

// Lifecycle
onMounted(() => {
  startTypingAnimation()
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})

// Expose methods to parent if needed
defineExpose({
  setInputValue: (value: string) => {
    inputValue.value = value
  },
  clearInput: () => {
    inputValue.value = ''
  }
})
</script>

<style scoped>
/* Ensure PrimeVue input styling doesn't override our dark theme */
:deep(.p-inputtext) {
  background-color: transparent !important;
  color: white !important;
  border: none !important;
}

:deep(.p-inputtext:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.p-inputtext::placeholder) {
  color: rgb(209 213 219) !important; /* gray-300 */
}
</style>
