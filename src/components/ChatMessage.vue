<template>
  <div 
    :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']"
    role="group"
    :aria-label="`${message.type === 'user' ? 'User' : 'ARKON AI'} message`"
  >
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="flex items-start justify-center flex-shrink-0 pt-1" role="img" aria-label="ARKON AI avatar">
        <div class="w-[26px] h-[26px] flex items-center justify-center" aria-hidden="true">
          <i class="pi pi-sparkles text-transparent text-sm" style="-webkit-text-stroke: 2px var(--p-primary-color); text-stroke: 2px var(--p-primary-color);"></i>
        </div>
      </div>
      <div
        :class="['bg-gray-800/90 border border-white/20 rounded-lg p-5 text-sm overflow-hidden', getMessageWidth()]"
        role="region"
        aria-label="AI message content"
      >
        <div v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></div>
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
// Types
interface Message {
  type: 'ai' | 'user'
  content: string[]
}

// Define props
const props = defineProps<{
  message: Message
  isWide?: boolean
}>()

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
