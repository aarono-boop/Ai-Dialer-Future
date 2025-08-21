<template>
  <Button
    v-bind="$attrs"
    :class="computedClasses"
    :disabled="disabled || loading"
    :loading="loading"
    :icon="icon"
    :iconPos="iconPos"
    :text="text"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ label }}
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
</style>
