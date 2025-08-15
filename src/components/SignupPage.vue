<template>
  <div class="min-h-screen bg-slate-900 text-white overflow-y-auto">
    <!-- Main Content -->
    <main class="max-w-md mx-auto px-6 py-16">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-slate-400">Create your ARKON account quickly and securely with Google.</p>
      </div>

      <!-- Signup Form Container -->
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <!-- Google Sign Up - Primary Button -->
        <button 
          @click="$emit('google-signup')"
          @keydown.tab="handleTabKey"
          class="w-full btn-primary py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 font-semibold text-lg mb-6"
          tabindex="4"
        >
          <i class="pi pi-google text-xl"></i>
          Sign up with Google
        </button>

        <!-- Description Text -->
        <p class="text-center text-slate-400 text-sm mb-6 leading-relaxed">
          We'll get you started with your AI calling assistant in seconds.
        </p>

        <!-- Sign In Link -->
        <div class="text-center">
          <span class="text-gray-400 text-sm">Have an account already? </span>
          <a href="#" @click="$emit('switch-to-signin')" @keydown.tab="handleTabKey" class="text-blue-400 text-sm hover:text-blue-300" tabindex="0">Sign in</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Define emits
const emit = defineEmits(['google-signup', 'switch-to-signin'])

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
