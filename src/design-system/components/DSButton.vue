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
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2) !important;
}

:deep(.p-button:focus-visible) {
  outline: 2px solid #60a5fa !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2) !important;
}

/* Variant-specific focus styles */
:deep(.btn-primary:focus) {
  outline-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

:deep(.btn-secondary:focus) {
  outline-color: #6b7280 !important;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2) !important;
}

:deep(.btn-tertiary:focus) {
  outline-color: #9ca3af !important;
  box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.2) !important;
}

:deep(.ds-button--success:focus) {
  outline-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

:deep(.ds-button--warning:focus) {
  outline-color: #f59e0b !important;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
}

:deep(.ds-button--error:focus) {
  outline-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}
</style>
