<template>
  <header class="relative z-10 py-[9px] px-6 lg:px-8 border-b border-white/10 bg-gray-800" role="banner">
    <!-- Hidden focus anchor to establish tab context when needed -->
    <button
      ref="focusAnchor"
      class="sr-only absolute top-0 left-0"
      tabindex="-1"
      aria-hidden="true"
    >Focus anchor</button>
    <nav class="flex justify-between items-center max-w-6xl mx-auto" role="navigation" aria-label="Main navigation">
      <button
        class="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
        @click="$emit('go-home')"
        aria-label="Return to ARKON home page"
        type="button"
        tabindex="1"
      >
        <svg 
          class="logo-icon" 
          xmlns="http://www.w3.org/2000/svg" 
          height="24px" 
          viewBox="0 -960 960 960" 
          width="24px"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="arkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path fill="url(#arkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" aria-hidden="true">ARKON</span>
      </button>
      
      <div class="text-gray-400 font-light italic" aria-label="ARKON tagline">
        Calling made smarter
      </div>
      
      <div class="flex gap-4 items-center" role="group" aria-label="User actions">
        <!-- Product link -->
        <Button
          label="Product"
          text
          class="nav-button"
          @click="$emit('show-product')"
          aria-label="View product information"
          tabindex="2"
        />

        <!-- Avatar when signed in -->
        <div v-if="isSignedIn" class="flex items-center gap-3" role="group" aria-label="User account">
          <button
            class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border-none"
            role="button"
            aria-label="User menu - click to logout"
            @click="$emit('logout')"
            tabindex="4"
          >
            <i class="pi pi-user text-white text-sm" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Login button when not signed in -->
        <Button
          v-else
          label="Login"
          text
          class="nav-button"
          @click="$emit('login')"
          aria-label="Sign in to your account"
          tabindex="3"
        />

      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'

// Define props
defineProps<{
  isSignedIn?: boolean
}>()

// Define emits for parent component communication
defineEmits(['login', 'switch-to-vulcan', 'show-product', 'go-home'])

// Template ref
const focusAnchor = ref<HTMLElement | null>(null)

// Method to establish focus context (mimics clicking in header)
const establishFocusContext = () => {
  if (focusAnchor.value) {
    focusAnchor.value.focus()
    focusAnchor.value.blur()
  }
}

// Expose method to parent
defineExpose({
  establishFocusContext
})
</script>

<style scoped>
/* Override PrimeVue button styles for Product and Login buttons */
.p-button-text.nav-button {
  color: white !important;
  background: transparent !important;
  border: none !important;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
}

.p-button-text.nav-button:hover {
  background: #9933FF !important;
  color: white !important;
}

.p-button-text.nav-button:focus {
  box-shadow: none !important;
  background: #9933FF !important;
  color: white !important;
}

/* Enhanced focus visibility for accessibility */
.p-button-text.nav-button:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
}

button:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
}

/* ARKON logo button styling */
button[aria-label="Return to ARKON home page"]:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
  border-radius: 4px !important;
}
</style>
