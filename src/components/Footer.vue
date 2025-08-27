<template>
  <footer class="flex justify-center items-center p-6 text-gray-500 text-xs relative z-[5] -mt-[10px]">
    <p>&copy; 2025 ARKON. All rights reserved.</p>
    <DSButton
      @click="$emit('skip-to-dialer')"
      variant="tertiary"
      size="small"
      class="ml-4 underline"
      label="Skip to Dialer"
    />
  </footer>
</template>

<script setup lang="ts">
import { DSButton } from '@/design-system/components'

// Define emits
defineEmits(['skip-to-dialer'])
</script>
