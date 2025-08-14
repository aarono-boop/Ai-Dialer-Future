<template>
  <div class="flex items-center justify-center py-4 my-4">
    <div class="flex items-center gap-2 bg-gray-800/80 border border-gray-600 rounded-lg px-4 py-2">
      <i class="pi pi-phone text-green-400 text-sm"></i>
      <span class="text-gray-300 text-sm font-medium tracking-wide uppercase">
        Next Call: {{ contactName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props
defineProps<{
  contactName: string
}>()
</script>

<style scoped>
/* Additional styling if needed */
</style>
