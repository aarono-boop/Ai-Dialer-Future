<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white text-xl font-semibold">Log in</h2>
        <Button @click="$emit('close')" severity="secondary" outlined size="small">
          <i class="pi pi-times text-lg"></i>
        </Button>
      </div>

      <!-- Google Sign In -->
      <Button
        @click="$emit('google-signin')"
        severity="secondary"
        size="large"
        class="w-full flex items-center justify-center gap-3 mb-6"
      >
        <i class="pi pi-google text-lg"></i>
        Sign in with Google
      </Button>

      <!-- Divider -->
      <div class="flex items-center mb-6">
        <div class="flex-1 h-px bg-gray-600"></div>
        <span class="text-gray-400 px-3 text-sm">OR</span>
        <div class="flex-1 h-px bg-gray-600"></div>
      </div>

      <!-- Email Field -->
      <div class="mb-4">
        <label class="text-gray-300 text-sm font-medium block mb-2">Email</label>
        <InputText
          v-model="email"
          placeholder="name@host.com"
          type="email"
          class="w-full"
        />
      </div>

      <!-- Password Field -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-300 text-sm font-medium">Password</span>
          <a href="#" class="text-blue-400 text-sm hover:text-blue-300">Forgot password?</a>
        </div>
        <InputText
          v-model="password"
          type="password"
          placeholder="Enter password"
          class="w-full"
        />
      </div>

      <!-- Login Button -->
      <Button
        @click="handleLogin"
        :disabled="!email || !password"
        severity="primary"
        size="large"
        class="w-full mb-4"
        label="Log in"
      />

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
import Button from 'primevue/button'
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
