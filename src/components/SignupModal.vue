<template>
  <div v-if="visible" class="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] z-[1000] flex items-center justify-center p-8 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(75,0,130,0.05)_0%,transparent_50%)] before:pointer-events-none" @click="handleOverlayClick">
    <div class="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl p-10 max-w-md w-full relative shadow-2xl" @click.stop>
      <button 
        class="absolute top-4 right-4 bg-none border-none text-white/60 text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 hover:text-white/90" 
        @click="$emit('close')"
      >
        <i class="pi pi-times"></i>
      </button>
      
      <div class="text-center">
        <div class="mb-6 flex justify-center">
          <svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
            <defs>
              <linearGradient id="modalArkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#modalArkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
          </svg>
        </div>
        
        <h2 class="text-white text-2xl font-semibold mb-8">Create Free Account</h2>
        
        <form class="flex flex-col gap-5 text-left" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-2">
            <label class="text-white text-sm font-medium">Email Address</label>
            <InputText
              v-model="email"
              placeholder="Email address"
              class="bg-white/5 border border-white/20 rounded-lg px-4 py-3.5 text-white text-sm placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/10 focus:outline-none"
              type="email"
              required
            />
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-white text-sm font-medium">Password</label>
            <InputText
              v-model="password"
              placeholder="Password"
              class="bg-white/5 border border-white/20 rounded-lg px-4 py-3.5 text-white text-sm placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/10 focus:outline-none"
              type="password"
              required
            />
          </div>
          
          <div class="flex items-center gap-2 my-2">
            <input 
              type="checkbox" 
              id="rememberMe" 
              v-model="rememberMe" 
              class="w-4 h-4 bg-white/5 border border-white/20 rounded accent-purple-500" 
            />
            <label for="rememberMe" class="text-white/80 text-sm cursor-pointer">Remember me</label>
          </div>
          
          <Button
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-lg py-3.5 px-6 text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!email || !password"
          >
            <i class="pi pi-user"></i>
            Sign In
          </Button>
          
          <p class="text-center text-white/60 text-sm mt-4 mb-0">
            Already have an account? 
            <a href="#" @click.prevent="$emit('switch-to-signin')" class="text-purple-400 no-underline font-medium hover:text-purple-300 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// Define props
interface Props {
  visible?: boolean
}

defineProps<Props>()

// Define emits
const emit = defineEmits<{
  close: []
  submit: [{ email: string; password: string; rememberMe: boolean }]
  'switch-to-signin': []
}>()

// Reactive data
const email = ref<string>('')
const password = ref<string>('')
const rememberMe = ref<boolean>(false)

// Methods
const handleSubmit = (): void => {
  emit('submit', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
  // Reset form
  email.value = ''
  password.value = ''
  rememberMe.value = false
}

const handleOverlayClick = () => {
  emit('close')
}
</script>
