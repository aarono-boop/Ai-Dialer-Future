<template>
  <div class="min-h-screen bg-slate-900 text-white overflow-y-auto">
    <!-- Main Content -->
    <main class="max-w-md mx-auto px-6 py-16">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Log in</h1>
        <p class="text-slate-400">Welcome back! Sign in to your account.</p>
      </div>

      <!-- Login Form Container -->
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <!-- Google Sign In -->
        <button 
          @click="$emit('google-signin')"
          @keydown.tab="handleTabKey"
          class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors mb-6"
          tabindex="4"
        >
          <i class="pi pi-google text-lg"></i>
          Sign in with Google
        </button>

        <!-- Divider -->
        <div class="flex items-center mb-6">
          <div class="flex-1 h-px bg-gray-600"></div>
          <span class="text-gray-400 px-3 text-sm">OR</span>
          <div class="flex-1 h-px bg-gray-600"></div>
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-medium mb-2">Email</label>
          <InputText
            ref="emailInputRef"
            v-model="email"
            placeholder="name@host.com"
            class="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-3 focus:border-blue-500 focus:outline-none"
            tabindex="0"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-gray-300 text-sm font-medium">Password</label>
            <a href="#" class="text-blue-400 text-sm hover:text-blue-300" tabindex="0">Forgot password?</a>
          </div>
          <InputText
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-3 focus:border-blue-500 focus:outline-none"
            tabindex="0"
          />
        </div>

        <!-- Login Button -->
        <button 
          @click="handleLogin"
          :disabled="!email || !password"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-4"
          tabindex="0"
        >
          Log in
        </button>

        <!-- Sign Up Link -->
        <div class="text-center">
          <span class="text-gray-400 text-sm">Don't have an account? </span>
          <a href="#" @click="$emit('show-signup')" @keydown.tab="handleTabKey" class="text-blue-400 text-sm hover:text-blue-300" tabindex="0">Create your account</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'

// Define emits
const emit = defineEmits(['google-signin', 'login-success', 'show-signup'])

// Reactive data
const email = ref('')
const password = ref('')
const emailInputRef = ref<any>(null)

// Methods
const handleLogin = () => {
  // Simulate login process
  // In a real app, this would validate credentials with a backend
  if (email.value && password.value) {
    // Emit success with user data
    const userData = {
      email: email.value,
      name: email.value.split('@')[0], // Simple name extraction
      hasSetGoals: true // Assuming returning users have already set goals
    }

    // Clear form
    email.value = ''
    password.value = ''

    // Emit login success
    setTimeout(() => {
      emit('login-success', userData)
    }, 1000)
  }
}

// Handle tab key to create circular navigation back to ARKON logo
const handleTabKey = (event: KeyboardEvent) => {
  // If not holding Shift (forward tab), focus ARKON logo
  if (!event.shiftKey) {
    event.preventDefault()
    // Find and focus the ARKON logo button (tabindex="1")
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
    }
  }
  // For Shift+Tab (backward), let default behavior handle it
}
</script>

<style scoped>
/* Custom input styling */
:deep(.p-inputtext) {
  background-color: rgb(31 41 55) !important;
  border-color: rgb(75 85 99) !important;
  color: white !important;
}

:deep(.p-inputtext:focus) {
  border-color: rgb(59 130 246) !important;
  box-shadow: none !important;
}

:deep(.p-inputtext::placeholder) {
  color: rgb(156 163 175) !important;
}

/* Ensure proper spacing and typography */
main {
  scroll-margin-top: 2rem;
}

/* Custom scrollbar for the page */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
