<template>
  <div :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']">
    <div v-if="message.type === 'ai'" class="flex gap-[10px] items-start w-full">
      <div class="w-10 h-10 flex items-start justify-center flex-shrink-0 pt-1">
        <i class="pi pi-sparkles text-purple-500 text-lg -ml-5"></i>
      </div>
      <div class="max-w-[80%] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-lg rounded-tl-none p-5 text-sm">
        <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
      </div>
    </div>
    
    <div v-else class="flex gap-4 items-start flex-row-reverse">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
        <i class="pi pi-user text-white text-lg"></i>
      </div>
      <div class="max-w-[80%] bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg rounded-br-sm p-5 text-white">
        <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define props
defineProps({
  message: {
    type: Object,
    required: true,
    validator: (message) => {
      return message.type && message.content && ['ai', 'user'].includes(message.type)
    }
  }
})
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
