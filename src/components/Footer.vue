<template>
  <footer class="flex justify-center items-center p-6 text-gray-500 text-xs relative z-[5] -mt-[25px]">
    <p>&copy; 2025 ARKON. All rights reserved.</p>
    <button
      @click="$emit('skip-to-dialer')"
      class="ml-4 text-gray-400 hover:text-gray-300 underline transition-colors"
    >
      Skip to Dialer
    </button>
  </footer>
</template>

<script setup lang="ts">
// Define emits
defineEmits(['skip-to-dialer'])
</script>
