<template>
  <Button
    v-bind="$attrs"
    :class="computedClasses"
    :disabled="props.disabled || props.loading"
    :loading="props.loading"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :text="props.text"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else-if="props.label">
      {{ props.label }}
    </template>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

export interface DSButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  label?: string
  icon?: string
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  text?: boolean
}

const props = withDefaults(defineProps<DSButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  iconPos: 'left',
  text: false
})

const computedClasses = computed(() => {
  const classes = ['ds-button']
  
  // Variant classes
  switch (props.variant) {
    case 'primary':
      classes.push('btn-primary')
      break
    case 'secondary':
      classes.push('btn-secondary')
      break
    case 'tertiary':
      classes.push('btn-tertiary')
      break
    case 'success':
      classes.push('ds-button--success')
      break
    case 'warning':
      classes.push('ds-button--warning')
      break
    case 'error':
      classes.push('ds-button--error')
      break
  }
  
  // Size classes
  switch (props.size) {
    case 'small':
      classes.push('ds-button--small')
      break
    case 'large':
      classes.push('ds-button--large')
      break
    default:
      classes.push('ds-button--medium')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.ds-button {
  @apply transition-all duration-500 ease-in-out;
}

.ds-button--small {
  @apply text-sm px-3 py-1;
}

.ds-button--medium {
  @apply text-base px-4 py-2;
}

.ds-button--large {
  @apply text-lg px-6 py-3;
}

.ds-button--success {
  @apply bg-green-500 hover:bg-green-600 text-white border-0;
}

.ds-button--warning {
  @apply bg-yellow-500 hover:bg-yellow-600 text-white border-0;
}

.ds-button--error {
  @apply bg-red-500 hover:bg-red-600 text-white border-0;
}

/* Focus styles for accessibility */
:deep(.p-button:focus) {
  outline: none !important;
  box-shadow: inset 0 0 0 2px #60a5fa !important;
}

:deep(.p-button:focus-visible) {
  outline: none !important;
  box-shadow: inset 0 0 0 2px #60a5fa !important;
}

/* Variant-specific focus styles */
:deep(.btn-primary:focus) {
  box-shadow: inset 0 0 0 2px #3b82f6 !important;
}

:deep(.btn-secondary:focus) {
  box-shadow: inset 0 0 0 2px #6b7280 !important;
}

:deep(.btn-tertiary:focus) {
  box-shadow: inset 0 0 0 2px #9ca3af !important;
}

:deep(.ds-button--success:focus) {
  box-shadow: inset 0 0 0 2px #10b981 !important;
}

:deep(.ds-button--warning:focus) {
  box-shadow: inset 0 0 0 2px #f59e0b !important;
}

:deep(.ds-button--error:focus) {
  box-shadow: inset 0 0 0 2px #ef4444 !important;
}
</style>
