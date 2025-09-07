<template>
  <div 
    :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']"
    role="group"
    :aria-label="`${message.type === 'user' ? 'User' : 'ARKON AI'} message`"
  >
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="flex items-start justify-center flex-shrink-0 pt-1" role="img" :aria-label="getAvatarLabel()">
        <!-- Dynamic Coach Avatar when coach is set and not an ARKON AI system message -->
        <template v-if="shouldUseCoachAvatar() && currentCoach">
          <img
            v-if="currentCoach.avatarUrl"
            :src="currentCoach.avatarUrl"
            :alt="currentCoach.displayName"
            class="w-[26px] h-[26px] rounded-full object-cover"
            aria-hidden="true"
          />
          <div
            v-else
            class="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
            aria-hidden="true"
          >
            {{ getCoachInitials(currentCoach.displayName) }}
          </div>
        </template>
        <!-- Default ARKON AI Avatar -->
        <div
          v-else
          class="ai-avatar-gradient"
          aria-hidden="true"
          :style="aiAvatarStyle"
        ></div>
      </div>
      <div :class="getMessageWidth()" class="flex flex-col">
        <div
          class="bg-gray-800/90 border border-white/20 rounded-lg p-5 text-sm overflow-hidden"
          role="region"
          aria-label="AI message content"
        >
          <template v-for="(item, itemIndex) in processedContent" :key="`processed-${itemIndex}`">
            <div v-if="item.type === 'text' && item.content.trim()" v-html="item.content"></div>
            <YouTubeVideo
              v-else-if="item.type === 'video' && item.videoId"
              :video-id="item.videoId"
              :autoplay="item.autoplay || false"
              title="Coach Introduction Video"
            />
          </template>
          <slot name="additional-content"></slot>
        </div>
        <div v-if="!message.typing || !isTyping" class="ai-actions mt-1 flex items-center justify-end gap-0" role="group" aria-label="AI message actions">
          <Button
            text
            icon="pi pi-copy"
            aria-label="Copy message"
            @click="handleCopy"
            :style="{ padding: '6px' }"
          />
          <Button
            text
            icon="pi pi-thumbs-up"
            aria-label="Thumbs up"
            :aria-pressed="selectedVote === 'up'"
            @click="handleThumbs('up')"
            :style="selectedVote === 'up' ? { color: 'var(--p-green-500)', padding: '6px' } : { padding: '6px' }"
          />
          <Button
            text
            icon="pi pi-thumbs-down"
            aria-label="Thumbs down"
            :aria-pressed="selectedVote === 'down'"
            @click="handleThumbs('down')"
            :style="selectedVote === 'down' ? { color: 'var(--p-red-500)', padding: '6px' } : { padding: '6px' }"
          />
        </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import YouTubeVideo from './YouTubeVideo.vue'
import { useCoaches } from '../composables/useCoaches'
import Button from 'primevue/button'

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
  fullWidth?: boolean
  onTypingProgress?: () => void
  coachParameter?: string
  aiCoachEnabled?: boolean
}>()

// Define emits
const emit = defineEmits<{
  typingComplete: []
  aiFeedback: [{ vote: 'up' | 'down', message: Message }]
}>()

const selectedVote = ref<'up' | 'down' | null>(null)

const handleThumbs = (vote: 'up' | 'down') => {
  selectedVote.value = vote
  emit('aiFeedback', { vote, message: props.message })
}

const stripHtml = (html: string): string => {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent || el.innerText || ''
}

const handleCopy = async () => {
  const lines = processedContent.value
    .filter(item => item.type === 'text')
    .map(item => stripHtml(item.content))
  const text = lines.join('\n').trim()

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

// Coach system integration
const { currentCoach } = useCoaches()

// Typing animation state
const typedContent = ref<string[]>(props.message.typing ? props.message.content.map(() => '') : [])
const isTyping = ref(false)
let typingInterval: NodeJS.Timeout | null = null

// Helper methods
const getCoachInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarLabel = (): string => {
  if (shouldUseCoachAvatar() && currentCoach.value) {
    return `${currentCoach.value.displayName} avatar`
  }
  return 'ARKON AI avatar'
}

// Process message content to extract video information
const processedContent = computed(() => {
  const content = props.message.typing ? typedContent.value : props.message.content
  const processedLines: Array<{type: 'text' | 'video', content: string, videoId?: string, autoplay?: boolean}> = []

  content.forEach(line => {
    const videoMatch = line.match(/<div class="coach-video-container" data-video-id="([^"]+)" data-autoplay="([^"]+)"><\/div>/)

    if (videoMatch) {
      // Split the line into parts before and after the video
      const beforeVideo = line.substring(0, line.indexOf(videoMatch[0]))
      const afterVideo = line.substring(line.indexOf(videoMatch[0]) + videoMatch[0].length)

      // Add text before video if it exists
      if (beforeVideo.trim()) {
        processedLines.push({type: 'text', content: beforeVideo})
      }

      // Add video
      processedLines.push({
        type: 'video',
        content: '',
        videoId: videoMatch[1],
        autoplay: videoMatch[2] === 'true'
      })

      // Add text after video if it exists
      if (afterVideo.trim()) {
        processedLines.push({type: 'text', content: afterVideo})
      }
    } else {
      // Regular text line
      processedLines.push({type: 'text', content: line})
    }
  })

  return processedLines
})

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

const isV7 = computed(() => new URLSearchParams(window.location.search).get('v7') === 'true')

const aiAvatarStyle = computed(() => ({
  width: '26px',
  height: '26px',
  background: isV7.value ? 'var(--p-primary-color)' : 'linear-gradient(135deg, #60a5fa 0%, #7b68ee 100%)',
  mask: "url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat",
  WebkitMask: "url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat"
}))

// Lifecycle
onMounted(() => {
  if (props.message.typing) {
    startTypingAnimation()
  }
})

onUnmounted(() => {
  stopTypingAnimation()
})

// Method to determine if coach avatar should be used
const shouldUseCoachAvatar = (): boolean => {
  // Always use ARKON avatar if AI coaching is disabled
  if (props.aiCoachEnabled === false) {
    return false
  }

  // Only use coach avatar if a coach is currently selected
  if (!currentCoach.value) {
    return false
  }

  // Check if this is an ARKON AI system message that should always use ARKON avatar
  const messageText = props.message.content.join(' ')
  const isArkonSystemMessage =
    messageText.includes('Welcome to ARKON') ||
    messageText.includes('ARKON AI') ||
    messageText.includes('Drop your contact file here') ||
    messageText.includes('Drag and drop your contact file') ||
    messageText.includes('Dialer activated') ||
    messageText.includes('Starting first call') ||
    messageText.includes('Now please enter any notes about this call') ||
    messageText.includes('The call outcome and notes have been saved') ||
    messageText.includes('continue to the next') ||
    messageText.includes('Moving to next contact') ||
    messageText.includes('Preparing to dial') ||
    messageText.includes('Voicemail detected') ||
    messageText.includes('Call with') && messageText.includes('ended') ||
    messageText.includes('Please select a call outcome') ||
    messageText.includes('Congratulations! You have completed your entire call queue') ||
    messageText.includes('Queue Completed!') ||
    messageText.includes('Queue Paused!') ||
    messageText.includes('successfully upgraded to the Pro plan') ||
    messageText.includes('analyzed your') && messageText.includes('contacts') ||
    messageText.includes('Connect Score') ||
    messageText.includes('add a verified phone number') ||
    messageText.includes('sent a text with') && messageText.includes('verification code') ||
    messageText.includes('number') && messageText.includes('is verified') ||
    messageText.includes('Setting appointments is our bread and butter') ||
    messageText.includes('Starting your dialing session') ||
    messageText.includes('Connecting you to your first contact') ||
    messageText.includes('Resuming call queue')

  // Use ARKON avatar for system messages, coach avatar for coaching content
  return !isArkonSystemMessage
}

// Method to determine message width
const getMessageWidth = (): string => {
  // Check if this is a session summary message
  const isSessionSummary = props.message.content.some(line =>
    line.includes('Queue Paused!') || line.includes('Queue Completed!')
  )

  if (isSessionSummary) {
    return 'w-full'
  }

  if (props.fullWidth) {
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

/* AI action buttons styling - use tokens, no background */
:deep(.ai-actions .p-button) {
  background-color: transparent !important;
  color: var(--p-surface-600) !important;
}
:deep(.ai-actions .p-button:hover),
:deep(.ai-actions .p-button:focus),
:deep(.ai-actions .p-button:active) {
  background-color: transparent !important;
  color: var(--p-surface-300) !important;
}
</style>
