<template>
  <div>
    <div class="grid grid-cols-3 gap-3 md:gap-3 sm:grid-cols-2 xs:grid-cols-1">
      <Button
        v-for="action in actions"
        :key="action"
        :label="action"
        class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white"
        @click="$emit('action-selected', action)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define props
interface Props {
  actions?: string[]
}

withDefaults(defineProps<Props>(), {
  actions: () => [
    'Set Appointments',
    'Close Live Sales',
    'Create Opportunities',
    'Set Follow Ups',
    'Make Live Transfers',
    'Live Conversations'
  ]
})

// Define emits
defineEmits<{
  'action-selected': [action: string]
}>()
</script>

<style scoped>
/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .grid-cols-3 {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}
</style>
