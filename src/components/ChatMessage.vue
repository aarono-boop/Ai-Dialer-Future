<template>
  <div :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']">
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="flex items-start justify-center flex-shrink-0 pt-1">
        <i class="pi pi-sparkles text-purple-500 text-lg"></i>
      </div>
      <div class="max-w-[80%] bg-gray-800/90 border border-white/20 rounded-lg p-5 text-sm overflow-hidden">
        <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
      </div>
    </div>
    
    <div v-else class="flex gap-4 items-start flex-row-reverse">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
        <i class="pi pi-user text-white text-lg"></i>
      </div>
      <div class="max-w-[95%] bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg rounded-br-sm p-5 text-white text-sm">
        <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
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
defineProps<{
  message: Message
}>()
</script>

<style scoped>
/* Message bubble text styling */
.message-bubble p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}
</style>
