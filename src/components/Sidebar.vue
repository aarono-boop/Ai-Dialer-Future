<template>
  <aside class="fixed left-0 top-0 h-screen w-24 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 z-20" role="navigation" aria-label="Main navigation">
    <!-- Hidden focus anchor to establish tab context when needed -->
    <button
      ref="focusAnchor"
      class="sr-only absolute top-0 left-0"
      tabindex="-1"
      aria-hidden="true"
    >Focus anchor</button>

    <!-- Logo at top -->
    <button
      class="flex items-center justify-center p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
      @click="$emit('go-home')"
      aria-label="Return to ARKON home page"
      type="button"
      tabindex="1"
    >
      <svg 
        class="logo-icon w-8 h-8" 
        xmlns="http://www.w3.org/2000/svg" 
        height="32px" 
        viewBox="0 -960 960 960" 
        width="32px"
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
    </button>

    <!-- Product link -->
    <button
      v-if="!isSignedIn"
      :class="[
        'flex items-center justify-center p-2 mt-4 rounded-lg transition-colors cursor-pointer border-none',
        props.currentPage === 'product'
          ? 'bg-blue-600 text-white'
          : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
      ]"
      @click="$emit('show-product')"
      aria-label="View product information"
      type="button"
      tabindex="2"
    >
      <i class="pi pi-phone text-xl"></i>
    </button>

    <!-- Spacer to push user actions to bottom -->
    <div class="flex-1"></div>

    <!-- User actions at bottom -->
    <div class="flex flex-col items-center gap-2">
      <!-- Avatar when signed in -->
      <div v-if="isSignedIn" class="relative">
        <button
          class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border-none"
          @click="toggleUserMenu"
          aria-label="User menu"
          type="button"
          tabindex="3"
          ref="userMenuButton"
        >
          <i class="pi pi-user text-white text-2xl" aria-hidden="true"></i>
        </button>

        <!-- User Dropdown Menu -->
        <div
          v-if="showUserMenu"
          class="absolute left-full bottom-0 ml-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50"
          role="menu"
          aria-labelledby="user-menu-button"
        >
          <div class="py-1">
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
              role="menuitem"
              tabindex="4"
            >
              <i class="pi pi-sun text-sm"></i>
              Use Light Mode
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
              role="menuitem"
              @click="handleLogout"
              tabindex="5"
            >
              <i class="pi pi-sign-out text-sm"></i>
              Log out
            </button>
          </div>
        </div>
      </div>

      <!-- Login button when not signed in -->
      <button
        v-else
        class="flex items-center justify-center p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer bg-transparent border-none text-gray-400 hover:text-white"
        @click="$emit('login')"
        aria-label="Sign in to your account"
        type="button"
        tabindex="3"
      >
        <i class="pi pi-sign-in text-xl"></i>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Define props
const props = defineProps<{
  isSignedIn?: boolean
  currentPage?: string
}>()

// Define emits for parent component communication
const emit = defineEmits(['login', 'logout', 'show-product', 'go-home'])

// Template refs
const focusAnchor = ref<HTMLElement | null>(null)
const userMenuButton = ref<HTMLElement | null>(null)

// User menu state
const showUserMenu = ref(false)

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Handle logout
const handleLogout = () => {
  showUserMenu.value = false
  emit('logout')
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuButton.value && !userMenuButton.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showUserMenu.value) {
    showUserMenu.value = false
    userMenuButton.value?.focus()
  }
}

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

// Remove event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Method to establish focus context (mimics clicking in sidebar)
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
/* Enhanced focus visibility for accessibility */
button:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
}
</style>
