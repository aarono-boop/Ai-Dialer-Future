<template>
  <div class="min-h-screen bg-slate-900 text-white overflow-y-auto login-background">
    <!-- Main Content -->
    <main class="max-w-md mx-auto px-6 py-16">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Login</h1>
        <p class="text-slate-400">Welcome back! Sign in with your Google account.</p>
      </div>

      <!-- Login Form Container -->
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <!-- Google Sign In - Primary Button -->
        <Button
          @click="$emit('google-signin')"
          @keydown.tab="handleTabKey"
          severity="primary"
          size="large"
          class="w-full flex items-center justify-center gap-3 font-semibold text-lg mb-6"
          tabindex="4"
        >
          <i class="pi pi-google text-xl"></i>
          Sign in with Google
        </Button>

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
import Button from 'primevue/button'

// Define emits
const emit = defineEmits(['google-signin', 'show-signup'])

// Handle tab key to create circular navigation back to AI Dialer logo
const handleTabKey = (event: KeyboardEvent) => {
  // If not holding Shift (forward tab), focus AI Dialer logo
  if (!event.shiftKey) {
    event.preventDefault()
    // Find and focus the AI Dialer logo button (tabindex="1")
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
    }
  }
  // For Shift+Tab (backward), let default behavior handle it
}
</script>

<style scoped>
/* Background pattern */
.login-background {
  background-color: #242733;
  background-image:
    /* A vignette to create the radial gradient effect for the dots */
    radial-gradient(ellipse at center, transparent 0%, #242733 80%),
    /* The dot pattern */
    radial-gradient(circle, #5D5F69 1px, transparent 1px);
  background-size: 100% 100%, 16px 16px;
}

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
