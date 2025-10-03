<template>
  <div class="mt-4" role="region" aria-label="Chat input area">
    <div class="flex items-center backdrop-blur-[10px] rounded-xl px-3 py-2 gap-2 w-[70%] mx-auto chat-input-container">
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
        tabindex="7"
      />
      <Button
        :disabled="!inputValue.trim()"
        @click="handleSend"
        text
        icon="pi pi-send"
        class="w-10 h-10 flex items-center justify-center text-white transition-colors duration-200 hover:opacity-80 disabled:opacity-50"
        aria-label="Send message"
        :aria-describedby="!inputValue.trim() ? 'send-button-help' : ''"
      />
      <Button
        v-if="showPromptLibraryIcon"
        @click="onToggleCaptions"
        v-tooltip.top="'Toggle closed captions in the chat window'"
        text
        class="w-10 h-10 flex items-center justify-center transition-colors duration-200 hover:opacity-80"
        :style="{ color: captionsOn ? 'var(--p-surface-0)' : 'var(--p-surface-500)' }"
        :aria-pressed="captionsOn ? 'true' : 'false'"
        aria-label="Toggle closed captions in the chat window"
      >
        <span aria-hidden="true" class="inline-block" :style="{ lineHeight: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: captionsOn ? 1 : 0.6 }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor">
            <path d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z" />
          </svg>
        </span>
      </Button>
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
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// Define props
const props = defineProps<{
  customPlaceholder?: string
  showPromptLibraryIcon?: boolean
}>()

// Define emits
const emit = defineEmits(['send-message', 'voice-input', 'toggle-transcription'])

// Captions toggle visual state: start ON (light), click -> OFF (dark), click again -> ON (light)
const captionsOn = ref<boolean>(true)
const onToggleCaptions = (): void => {
  captionsOn.value = !captionsOn.value
  emit('toggle-transcription')
}

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
  'Ask me anything about AI Dialer...',
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
    const dialerButton11 = document.querySelector('[tabindex="11"]') as HTMLElement // Could be Hold
    const dialerButton12 = document.querySelector('[tabindex="12"]') as HTMLElement // Could be Hang Up

    console.log('=== TAB NAVIGATION DEBUG ===')
    console.log('Pause Queue (8):', pauseQueueButton, 'visible:', pauseQueueButton?.offsetParent !== null)
    console.log('Button 9:', dialerButton9, 'visible:', dialerButton9?.offsetParent !== null)
    console.log('Button 10:', dialerButton10, 'visible:', dialerButton10?.offsetParent !== null)
    console.log('Button 11:', dialerButton11, 'visible:', dialerButton11?.offsetParent !== null)
    console.log('Button 12:', dialerButton12, 'visible:', dialerButton12?.offsetParent !== null)

    // Helper function to check if a button is disabled (handles both standard and PrimeVue disabled states)
    const isButtonDisabled = (button: HTMLElement): boolean => {
      if (!button) return true
      const disabled = button.disabled ||
             button.getAttribute('disabled') === 'true' ||
             button.getAttribute('data-p-disabled') === 'true' ||
             button.hasAttribute('disabled')
      console.log(`Button with text "${button.textContent?.trim()}" disabled:`, disabled)
      return disabled
    }

    // Try to focus on any available dialer control in order of preference
    if (pauseQueueButton && pauseQueueButton.offsetParent !== null && !isButtonDisabled(pauseQueueButton)) {
      // Pause Queue is available and enabled, focus it first
      pauseQueueButton.focus()
      console.log('✅ Focused Pause Queue button')
    } else if (dialerButton9 && dialerButton9.offsetParent !== null && !isButtonDisabled(dialerButton9)) {
      // Focus tabindex="9" button (Mute when connected, Call Back when ended)
      dialerButton9.focus()
      console.log('✅ Focused dialer button (tabindex="9"):', dialerButton9.textContent?.trim())
    } else if (dialerButton10 && dialerButton10.offsetParent !== null && !isButtonDisabled(dialerButton10)) {
      // Focus tabindex="10" button (Keypad when connected, Next when ended)
      dialerButton10.focus()
      console.log('✅ Focused dialer button (tabindex="10"):', dialerButton10.textContent?.trim())
    } else if (dialerButton11 && dialerButton11.offsetParent !== null && !isButtonDisabled(dialerButton11)) {
      // Focus tabindex="11" button (Hold when connected)
      dialerButton11.focus()
      console.log('✅ Focused dialer button (tabindex="11"):', dialerButton11.textContent?.trim())
    } else if (dialerButton12 && dialerButton12.offsetParent !== null && !isButtonDisabled(dialerButton12)) {
      // Focus tabindex="12" button (Hang Up when connected)
      dialerButton12.focus()
      console.log('✅ Focused dialer button (tabindex="12"):', dialerButton12.textContent?.trim())
    } else {
      // No dialer visible, cycle back to ARKON logo (tabindex="1")
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        console.log('❌ No dialer controls available, focused ARKON logo')
      } else {
        console.log('❌ Could not find ARKON logo to focus')
      }
    }
    console.log('=== END TAB DEBUG ===')
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
/* Chat input container using design tokens */
.chat-input-container {
  background-color: var(--p-surface-800);
  border: 1px solid var(--p-surface-600);
  transition: all 0.2s ease;
}

.chat-input-container:hover {
  border-color: var(--p-surface-500);
}

.chat-input-container:focus-within {
  outline: none;
  border-color: var(--p-primary-color);
  box-shadow: inset 0 0 0 1px var(--p-primary-color);
}

/* Ensure PrimeVue input styling integrates with design tokens */
:deep(.p-inputtext) {
  background-color: transparent !important;
  color: var(--p-surface-0) !important;
  border: none !important;
}

:deep(.p-inputtext:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.p-inputtext::placeholder) {
  color: var(--p-surface-300) !important;
}

/* Send button color using design tokens */
:deep(.p-button-text) {
  color: var(--p-surface-0) !important;
}

:deep(.p-button-text:hover:not(:disabled)) {
  background-color: var(--p-surface-700) !important;
}

:deep(.p-button-text:disabled) {
  color: var(--p-surface-500) !important;
}
</style>
