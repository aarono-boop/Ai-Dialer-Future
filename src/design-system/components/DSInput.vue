<template>
  <div :style="wrapperStyles">
    <label v-if="label" :for="inputId" :style="labelStyles">
      {{ label }}
      <span v-if="required" :style="requiredStyles">*</span>
    </label>

    <InputText
      :id="inputId"
      v-bind="$attrs"
      :size="props.size === 'small' ? 'small' : props.size === 'large' ? 'large' : null"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid || !!errorMessage"
      @update:modelValue="$emit('update:modelValue', $event)"
    />

    <small v-if="helpText && !errorMessage" :style="helpStyles">
      {{ helpText }}
    </small>

    <small v-if="errorMessage" :style="errorStyles">
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

// All styling handled by PrimeVue design tokens in inputtext.ts
</script>

<style scoped>
/* Minimal wrapper styling - all input styling handled by design tokens */
.ds-input-wrapper {
  width: 100%;
}

.ds-input__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--p-text-muted-color);
}

.ds-input__required {
  margin-left: 0.25rem;
  color: var(--p-red-400);
}

.ds-input__help {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--p-text-muted-color);
}

.ds-input__error {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--p-red-400);
}
</style>
