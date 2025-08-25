<template>
  <div class="mt-4" role="region" aria-label="Chat input area">
    <div class="flex items-center bg-gray-800 backdrop-blur-[10px] border border-gray-600 rounded-xl px-3 py-2 gap-2 w-[70%] mx-auto chat-input-container">
      <DSInput
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
        tabindex="7"
      />
      <button
        class="w-10 h-10 flex items-center justify-center text-white transition-colors duration-200 hover:opacity-80 disabled:opacity-50 bg-transparent border-none cursor-pointer"
        :disabled="!inputValue.trim()"
        @click="handleSend"
        aria-label="Send message"
        :aria-describedby="!inputValue.trim() ? 'send-button-help' : ''"
      >
        <i class="pi pi-send text-2xl"></i>
      </button>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { DSButton, DSInput } from '@/design-system/components'

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
  // If not holding Shift (forward tab)
  if (!event.shiftKey) {
    event.preventDefault()

    // Check if dialer is showing and what controls are available
    const pauseQueueButton = document.querySelector('[tabindex="8"]') as HTMLElement
    const dialerButton9 = document.querySelector('[tabindex="9"]') as HTMLElement // Could be Mute or Call Back
    const dialerButton10 = document.querySelector('[tabindex="10"]') as HTMLElement // Could be Keypad or Next

    // Helper function to check if a button is disabled (handles both standard and PrimeVue disabled states)
    const isButtonDisabled = (button: HTMLElement): boolean => {
      return button.disabled ||
             button.getAttribute('disabled') === 'true' ||
             button.getAttribute('data-p-disabled') === 'true' ||
             button.hasAttribute('disabled')
    }

    // Try to focus on any available dialer control in order of preference
    if (pauseQueueButton && pauseQueueButton.offsetParent !== null && !isButtonDisabled(pauseQueueButton)) {
      // Pause Queue is available and enabled, focus it first
      pauseQueueButton.focus()
      console.log('Focused Pause Queue button')
    } else if (dialerButton9 && dialerButton9.offsetParent !== null && !isButtonDisabled(dialerButton9)) {
      // Focus tabindex="9" button (Mute when connected, Call Back when ended)
      dialerButton9.focus()
      console.log('Focused dialer button (tabindex="9")')
    } else if (dialerButton10 && dialerButton10.offsetParent !== null && !isButtonDisabled(dialerButton10)) {
      // Focus tabindex="10" button (Keypad when connected, Next when ended)
      dialerButton10.focus()
      console.log('Focused dialer button (tabindex="10")')
    } else {
      // No dialer visible, cycle back to ARKON logo (tabindex="1")
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        console.log('No dialer controls available, focused ARKON logo')
      } else {
        console.log('Could not find ARKON logo to focus')
      }
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
    console.log('ChatInput focus method called')

    // For DSInput component, we need to find the actual input element
    nextTick(() => {
      if (inputRef.value) {
        console.log('InputRef found:', inputRef.value)

        // DSInput component structure: look for the actual input element
        let actualInput = null

        // Try to find the PrimeVue InputText element within DSInput
        if (inputRef.value.$el) {
          actualInput = inputRef.value.$el.querySelector('input')
        }

        // If still not found, try different approaches
        if (!actualInput && inputRef.value.$refs) {
          // Look through refs for input elements
          Object.values(inputRef.value.$refs).forEach((ref: any) => {
            if (ref && ref.$el) {
              const foundInput = ref.$el.querySelector('input')
              if (foundInput) actualInput = foundInput
            }
          })
        }

        // Fallback: try direct element
        if (!actualInput) {
          actualInput = inputRef.value.$el || inputRef.value
        }

        console.log('Actual input element found:', actualInput)

        if (actualInput && typeof actualInput.focus === 'function') {
          actualInput.focus()
          console.log('Successfully focused input element')
        } else {
          console.log('Could not focus input element')
        }
      } else {
        console.log('InputRef not available')
      }
    })
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
