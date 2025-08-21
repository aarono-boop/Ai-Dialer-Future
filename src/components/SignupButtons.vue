<template>
  <div class="flex flex-col gap-3 my-6">
    <DSButton
      variant="secondary"
      size="large"
      class="w-full py-3.5 px-6 font-medium text-sm flex items-center justify-center gap-3 border border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 hover:text-white"
      @click="$emit('google-signup')"
    >
      <i class="pi pi-google"></i>
      Continue with Google
    </DSButton>
    <DSButton
      variant="secondary"
      size="large"
      class="w-full py-3.5 px-6 font-medium text-sm flex items-center justify-center gap-3 border border-purple-400/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white"
      @click="$emit('email-signup')"
    >
      <i class="pi pi-envelope"></i>
      Continue with Email
    </DSButton>
  </div>
</template>

<script setup lang="ts">
import { DSButton } from '@/design-system/components'

// Define emits
defineEmits(['google-signup', 'email-signup'])
</script>
