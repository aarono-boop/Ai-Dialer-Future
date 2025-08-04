<template>
  <header class="relative z-10 py-3.5 px-6 lg:px-8 border-b border-white/10 bg-gray-800">
    <div class="flex justify-between items-center max-w-6xl mx-auto">
      <div class="flex items-center gap-3">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <defs>
            <linearGradient id="arkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path fill="url(#arkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ARKON</span>
      </div>
      
      <div class="text-gray-400 font-light italic">
        Calling made smarter
      </div>
      
      <div class="flex gap-4 items-center">
        <Button 
          label="Login" 
          text 
          class="text-white font-medium hover:text-purple-400 transition-colors"
          @click="$emit('login')"
        />
        <Button
          text
          class="text-gray-400 font-medium hover:text-purple-400 transition-colors"
          @click="$emit('switch-to-vulcan')"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define emits for parent component communication
defineEmits(['login', 'switch-to-vulcan'])
</script>
