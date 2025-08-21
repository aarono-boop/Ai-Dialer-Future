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
  @apply block text-sm font-medium text-gray-300 mb-2;
}

.ds-input__required {
  @apply text-red-400 ml-1;
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
  @apply bg-gray-700 border border-gray-600 text-white;
}

.ds-input--filled {
  @apply bg-gray-600 border-0 text-white;
}

.ds-input--outlined {
  @apply bg-transparent border-2 border-gray-500 text-white;
}

.ds-input--error {
  @apply border-red-500 focus:ring-red-500;
}

.ds-input__help {
  @apply block text-xs text-gray-400 mt-1;
}

.ds-input__error {
  @apply block text-xs text-red-400 mt-1;
}
</style>
