<template>
  <div>
    <div class="grid grid-cols-3 gap-3 md:gap-3 sm:grid-cols-2 xs:grid-cols-1">
      <DSButton
        v-for="(action, index) in actions"
        :key="action"
        :label="action"
        variant="secondary"
        class="px-4 py-3.5 font-medium text-sm text-center min-h-[48px] flex items-center justify-center"
        @click="$emit('action-selected', action)"
        :tabindex="3 + index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DSButton } from '@/design-system/components'

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
