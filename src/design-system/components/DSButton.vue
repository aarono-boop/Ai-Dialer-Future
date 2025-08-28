<template>
  <Button
    v-bind="$attrs"
    :severity="computedSeverity"
    :variant="computedVariant"
    :size="props.size"
    :disabled="props.disabled || props.loading"
    :loading="props.loading"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :text="props.text || props.variant === 'text'"
    :outlined="props.variant === 'outlined'"
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
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'outlined' | 'text'
  size?: 'small' | 'large' | null
  disabled?: boolean
  loading?: boolean
  label?: string
  icon?: string
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  text?: boolean
}

const props = withDefaults(defineProps<DSButtonProps>(), {
  variant: 'primary',
  size: null,
  disabled: false,
  loading: false,
  iconPos: 'left',
  text: false
})

// Map our design system variants to PrimeVue severity
const computedSeverity = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'success':
      return 'success'
    case 'warning':
      return 'warn'
    case 'error':
      return 'danger'
    case 'tertiary':
    case 'outlined':
    case 'text':
      return null // Let variant handle these
    default:
      return 'primary'
  }
})

// Map our design system variants to PrimeVue variant
const computedVariant = computed(() => {
  switch (props.variant) {
    case 'outlined':
    case 'tertiary':
      return 'outlined'
    case 'text':
      return 'text'
    default:
      return null // Use default (filled)
  }
})
</script>

<style scoped>
/* Custom overrides for design system consistency */
:deep(.p-button) {
  transition: all 0.5s ease-in-out;
}

/* Focus styles are now handled by PrimeVue design tokens */
/* All colors, sizing, and variants are handled by the design token system */
</style>
