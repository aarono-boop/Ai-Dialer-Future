<template>
  <aside class="fixed left-0 top-0 h-screen w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 z-20" role="navigation" aria-label="Main navigation">
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
      @click="handleHomeClick"
      aria-label="Return to ARKON home page"
      type="button"
      tabindex="1"
      v-tooltip.right="'Home'"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F971acdb98a6e45828a85c08e6de84643?format=webp&width=800"
        alt="ARMOR logo"
        class="w-8 h-8 object-contain"
        aria-hidden="true"
      />
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
      v-tooltip.right="'About'"
    >
      <i class="pi pi-info-circle text-xl"></i>
    </button>

    <!-- Spacer to push user actions to bottom -->
    <div class="flex-1"></div>

    <!-- User actions at bottom -->
    <div class="flex flex-col items-center gap-2">
      <!-- Avatar when signed in -->
      <div v-if="isSignedIn" class="relative">
        <button
          class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border-none"
          @click="toggleUserMenu"
          aria-label="User menu"
          type="button"
          tabindex="3"
          ref="userMenuButton"
        >
          <i class="pi pi-user text-white text-lg" aria-hidden="true"></i>
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
      v-tooltip.right="'Login'"
    >
        <i class="pi pi-sign-in text-xl"></i>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Define props
const props = defineProps<{
  isSignedIn?: boolean
  currentPage?: string
}>()

// Define emits for parent component communication
const emitSidebar = defineEmits(['login', 'logout', 'show-product', 'go-home'])

// Template refs
const focusAnchor = ref<HTMLElement | null>(null)
const userMenuButton = ref<HTMLElement | null>(null)

// User menu state
const showUserMenu = ref(false)

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Robust home click: emit event and broadcast global event
const handleHomeClick = () => {
  emitSidebar('go-home')
  try {
    window.dispatchEvent(new CustomEvent('arkon-go-home'))
  } catch {}
}

// Handle logout
const handleLogout = () => {
  showUserMenu.value = false
  emitSidebar('logout')
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

const isV7 = computed(() => new URLSearchParams(window.location.search).get('v7') === 'true')

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
