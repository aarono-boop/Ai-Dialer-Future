<template>
  <div class="mt-4" role="region" aria-label="Chat input area">
    <div class="flex items-center bg-gray-800 backdrop-blur-[10px] border border-gray-600 rounded-xl px-3 py-2 gap-2 w-[70%] mx-auto chat-input-container">
      <InputText
        ref="inputRef"
        v-model="inputValue"
        :placeholder="props.customPlaceholder || animatedPlaceholder"
        class="flex-1 bg-transparent border-none text-white text-base px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-0"
        style="background-color: transparent !important; color: white !important;"
        @keyup.enter="handleSend"
        @keydown.tab="handleTabKey"
        @focus="pauseAnimation"
        @blur="resumeAnimation"
        aria-label="Type your message or question"
        aria-describedby="chat-input-help"
        tabindex="4"
      />
      <Button
        icon="pi pi-send"
        class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white disabled:opacity-50 disabled:text-gray-600"
        :disabled="!inputValue.trim()"
        text
        @click="handleSend"
        aria-label="Send message"
        :aria-describedby="!inputValue.trim() ? 'send-button-help' : ''"
      />
    </div>
    <div id="chat-input-help" class="sr-only">
      Press Enter to send your message or use the send button
    </div>
    <div id="send-button-help" class="sr-only" v-if="!inputValue.trim()">
      Enter a message to enable the send button
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
const inputRef = ref<any>(null)
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

const handleTabKey = (event: KeyboardEvent) => {
  // If not holding Shift (forward tab), focus ARKON logo
  if (!event.shiftKey) {
    event.preventDefault()
    // Find and focus the ARKON logo button (tabindex="1")
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
    }
  }
  // For Shift+Tab (backward), let default behavior handle it
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
  },
  focus: () => {
    inputRef.value?.$el?.focus()
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

/* Chat input container focus styling to match file upload */
.chat-input-container:focus-within {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
  border-color: #60a5fa !important;
  transition: all 0.2s ease;
}

.chat-input-container {
  transition: all 0.2s ease;
}
</style>
