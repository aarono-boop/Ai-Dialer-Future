<template>
  <div 
    :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']"
    role="group"
    :aria-label="`${message.type === 'user' ? 'User' : 'ARKON AI'} message`"
  >
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="flex items-start justify-center flex-shrink-0 pt-1" role="img" aria-label="ARKON AI avatar">
        <div
          class="ai-avatar-gradient"
          aria-hidden="true"
          style="
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, #60a5fa 0%, #7b68ee 100%);
            mask: url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat;
            -webkit-mask: url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat;
          "
        ></div>
      </div>
      <div
        :class="['bg-gray-800/90 border border-white/20 rounded-lg p-5 text-sm overflow-hidden', getMessageWidth()]"
        role="region"
        aria-label="AI message content"
      >
        <div v-if="message.typing" v-for="(line, lineIndex) in typedContent" :key="`typed-${lineIndex}`" v-html="line"></div>
        <div v-else v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></div>
        <slot name="additional-content"></slot>
      </div>
    </div>
    
    <div v-else class="flex gap-4 items-start flex-row-reverse" data-message-type="user">
      <div
        class="w-[23px] h-[23px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0"
        role="img"
        aria-label="User avatar"
      >
        <i class="pi pi-user text-white text-sm" aria-hidden="true"></i>
      </div>
      <div
        class="max-w-[95%] bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg rounded-br-sm p-5 text-white text-sm"
        role="region"
        aria-label="User message content"
      >
        <div v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Types
interface Message {
  type: 'ai' | 'user'
  content: string[]
  typing?: boolean
}

// Define props
const props = defineProps<{
  message: Message
  isWide?: boolean
  onTypingProgress?: () => void
  coachParameter?: string
}>()

// Define emits
const emit = defineEmits<{
  typingComplete: []
}>()

// Typing animation state
const typedContent = ref<string[]>(props.message.typing ? props.message.content.map(() => '') : [])
const isTyping = ref(false)
let typingInterval: NodeJS.Timeout | null = null

// Start typing animation
const startTypingAnimation = (): void => {
  if (!props.message.typing || props.message.type !== 'ai') return

  isTyping.value = true
  // Reset to empty strings
  typedContent.value = props.message.content.map(() => '')

  let lineIndex = 0
  let charIndex = 0

  // Helper function to detect if content is a contact table that should load instantly
  const isContactTableContent = (content: string): boolean => {
    return content.includes('<table style=') &&
           content.includes('Connect Score') &&
           (content.includes('Sarah Johnson') || content.includes('font-weight: bold'))
  }

  const typeNextCharacter = () => {
    if (lineIndex >= props.message.content.length) {
      isTyping.value = false
      emit('typingComplete')
      return
    }

    const currentLine = props.message.content[lineIndex]

    // Check if this line contains contact table content - if so, display it instantly
    if (charIndex === 0 && isContactTableContent(currentLine)) {
      typedContent.value[lineIndex] = currentLine
      lineIndex++
      charIndex = 0

      // Scroll when displaying contact table instantly
      if (props.onTypingProgress) {
        props.onTypingProgress()
      }
      return
    }

    if (charIndex < currentLine.length) {
      // Add character to current line
      typedContent.value[lineIndex] = currentLine.substring(0, charIndex + 1)
      charIndex++

      // Scroll to bottom every few characters to keep new content visible
      if (charIndex % 10 === 0 && props.onTypingProgress) {
        props.onTypingProgress()
      }
    } else {
      // Move to next line
      lineIndex++
      charIndex = 0

      // Always scroll when starting a new line
      if (props.onTypingProgress) {
        props.onTypingProgress()
      }
    }
  }

  typingInterval = setInterval(typeNextCharacter, 5) // Typing speed
}

// Stop typing animation
const stopTypingAnimation = (): void => {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
  isTyping.value = false
}

// Lifecycle
onMounted(() => {
  if (props.message.typing) {
    startTypingAnimation()
  }
})

onUnmounted(() => {
  stopTypingAnimation()
})

// Method to determine message width
const getMessageWidth = (): string => {
  // Check if this is a session summary message
  const isSessionSummary = props.message.content.some(line =>
    line.includes('Queue Paused!') || line.includes('Queue Completed!')
  )

  if (isSessionSummary) {
    return 'w-full'
  }

  return props.isWide ? 'w-3/5' : 'max-w-[60%]'
}
</script>

<style scoped>
/* Message bubble text styling */
.message-bubble div {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.message-bubble div:last-child {
  margin-bottom: 0;
}

/* Enhanced focus visibility for any interactive content within messages */
*:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
}
</style>
