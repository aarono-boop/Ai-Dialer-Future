<template>
  <div class="flex flex-col gap-3 my-6">
    <Button
      class="w-full py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 border border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 hover:text-white"
      @click="$emit('google-signup')"
    >
      <i class="pi pi-google"></i>
      Continue with Google
    </Button>
    <Button
      class="w-full py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 border border-purple-400/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white"
      @click="$emit('email-signup')"
    >
      <i class="pi pi-envelope"></i>
      Continue with Email
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define emits
defineEmits(['google-signup', 'email-signup'])
</script>
