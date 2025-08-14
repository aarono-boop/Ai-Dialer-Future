<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white text-xl font-semibold">Log in</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <!-- Google Sign In -->
      <button 
        @click="$emit('google-signin')"
        class="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors mb-6"
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
          v-model="email"
          placeholder="name@host.com"
          class="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <!-- Password Field -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-gray-300 text-sm font-medium">Password</label>
          <a href="#" class="text-blue-400 text-sm hover:text-blue-300">Forgot password?</a>
        </div>
        <InputText
          v-model="password"
          type="password"
          placeholder="Enter password"
          class="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <!-- Login Button -->
      <button 
        @click="handleLogin"
        :disabled="!email || !password"
        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-4"
      >
        Log in
      </button>

      <!-- Sign Up Link -->
      <div class="text-center">
        <span class="text-gray-400 text-sm">Don't have an account? </span>
        <a href="#" @click="$emit('show-signup')" class="text-blue-400 text-sm hover:text-blue-300">Create your account</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'

// Define emits
const emit = defineEmits(['close', 'google-signin', 'login-success', 'show-signup'])

// Reactive data
const email = ref('')
const password = ref('')

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
</style>
