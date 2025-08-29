<template>
  <div class="ds-input-wrapper">
    <label v-if="label" :for="inputId" class="ds-input__label">
      {{ label }}
      <span v-if="required" class="ds-input__required">*</span>
    </label>
    
    <InputText
      :id="inputId"
      v-bind="$attrs"
      :class="computedClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid || !!errorMessage"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    
    <small v-if="helpText && !errorMessage" class="ds-input__help">
      {{ helpText }}
    </small>
    
    <small v-if="errorMessage" class="ds-input__error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'

// Prevent attributes from being inherited by the wrapper div
defineOptions({
  inheritAttrs: false
})

export interface DSInputProps {
  label?: string
  placeholder?: string
  helpText?: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
}

const props = withDefaults(defineProps<DSInputProps>(), {
  size: 'medium',
  variant: 'default',
  disabled: false,
  invalid: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

// Generate unique ID for accessibility
const inputId = `ds-input-${Math.random().toString(36).substr(2, 9)}`

const computedClasses = computed(() => {
  const classes = ['ds-input']
  
  // Size classes
  switch (props.size) {
    case 'small':
      classes.push('ds-input--small')
      break
    case 'large':
      classes.push('ds-input--large')
      break
    default:
      classes.push('ds-input--medium')
  }
  
  // Variant classes
  switch (props.variant) {
    case 'filled':
      classes.push('ds-input--filled')
      break
    case 'outlined':
      classes.push('ds-input--outlined')
      break
    default:
      classes.push('ds-input--default')
  }
  
  // State classes
  if (props.invalid || props.errorMessage) {
    classes.push('ds-input--error')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.ds-input-wrapper {
  @apply w-full;
}

.ds-input__label {
  @apply block text-sm font-medium mb-2;
  color: var(--p-surface-300);
}

.ds-input__required {
  @apply ml-1;
  color: var(--p-red-400);
}

.ds-input {
  @apply w-full transition-colors duration-200;
}

.ds-input--small {
  @apply text-sm px-3 py-1;
}

.ds-input--medium {
  @apply text-base px-3 py-2;
}

.ds-input--large {
  @apply text-lg px-4 py-3;
}

.ds-input--default {
  background-color: var(--p-surface-700);
  border: 1px solid var(--p-surface-600);
  color: var(--p-surface-0);
}

.ds-input--filled {
  background-color: var(--p-surface-600);
  border: none;
  color: var(--p-surface-0);
}

.ds-input--outlined {
  background-color: transparent;
  border: 2px solid var(--p-surface-500);
  color: var(--p-surface-0);
}

.ds-input--error {
  border-color: var(--p-red-500);
}

.ds-input--error:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--p-red-500);
}

.ds-input__help {
  @apply block text-xs mt-1;
  color: var(--p-surface-400);
}

.ds-input__error {
  @apply block text-xs mt-1;
  color: var(--p-red-400);
}

/* Placeholder styling using design tokens */
:deep(.p-inputtext::placeholder) {
  color: var(--p-surface-400);
}

/* Focus states using design tokens */
:deep(.p-inputtext:focus) {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--p-primary-color);
  border-color: var(--p-primary-color);
}
</style>
