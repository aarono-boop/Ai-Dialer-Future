<template>
  <div class="flex items-center py-4 my-4 w-full">
    <!-- Left extending line -->
    <div class="flex-1 border-t border-green-700" style="border-width: 1px;"></div>

    <!-- Separator content -->
    <div class="flex items-center gap-2 bg-gray-800/80 border border-green-700 rounded-lg px-4 py-2 mx-4" style="border-width: 1px;">
      <i class="pi pi-phone text-green-400 text-sm"></i>
      <span class="text-gray-300 text-sm font-medium tracking-wide uppercase">
        <template v-if="overrideText && overrideText.length">{{ overrideText }}</template>
        <template v-else>Calling {{ contactName }}</template>
      </span>
    </div>

    <!-- Right extending line -->
    <div class="flex-1 border-t border-green-700" style="border-width: 1px;"></div>
  </div>
</template>

<script setup lang="ts">
// Define props
defineProps<{
  contactName: string
  overrideText?: string
}>()
</script>

<style scoped>
/* Additional styling if needed */
</style>
