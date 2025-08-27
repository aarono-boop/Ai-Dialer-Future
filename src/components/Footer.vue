<template>
  <footer class="flex flex-col justify-center items-center p-6 text-gray-500 text-xs relative z-[5] mt-[10px]">
    <div class="text-center text-gray-500 text-xs mb-2">
      ARKON can make mistakes. Please double-check responses.
    </div>
    <div class="flex justify-center items-center">
      <p>&copy; 2025 ARKON. All rights reserved.</p>
      <DSButton
        @click="$emit('skip-to-dialer')"
        variant="tertiary"
        size="small"
        class="ml-4 underline"
        label="Skip to Dialer"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { DSButton } from '@/design-system/components'

// Define emits
defineEmits(['skip-to-dialer'])
</script>
