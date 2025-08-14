<template>
  <div :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']">
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="flex items-start justify-center flex-shrink-0 pt-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px">
          <defs>
            <linearGradient id="arkonGradientChat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path fill="url(#arkonGradientChat)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
        </svg>
      </div>
      <div class="max-w-[80%] bg-gray-800/90 border border-white/20 rounded-lg p-5 text-sm overflow-hidden">
        <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
      </div>
    </div>
    
    <div v-else class="flex gap-4 items-start flex-row-reverse">
      <div class="w-[23px] h-[23px] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <i class="pi pi-user text-white text-sm"></i>
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
