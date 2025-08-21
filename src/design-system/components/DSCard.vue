<template>
  <Card 
    v-bind="$attrs"
    :class="computedClasses"
  >
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>
    
    <template #title v-if="title || $slots.title">
      <slot name="title">
        <h3 class="ds-card__title">{{ title }}</h3>
      </slot>
    </template>
    
    <template #subtitle v-if="subtitle || $slots.subtitle">
      <slot name="subtitle">
        <p class="ds-card__subtitle">{{ subtitle }}</p>
      </slot>
    </template>
    
    <template #content>
      <slot />
    </template>
    
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'

export interface DSCardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'small' | 'medium' | 'large'
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<DSCardProps>(), {
  variant: 'default',
  padding: 'medium'
})

const computedClasses = computed(() => {
  const classes = ['ds-card']
  
  // Variant classes
  switch (props.variant) {
    case 'elevated':
      classes.push('ds-card--elevated')
      break
    case 'outlined':
      classes.push('ds-card--outlined')
      break
    case 'filled':
      classes.push('ds-card--filled')
      break
    default:
      classes.push('ds-card--default')
  }
  
  // Padding classes
  switch (props.padding) {
    case 'none':
      classes.push('ds-card--no-padding')
      break
    case 'small':
      classes.push('ds-card--small-padding')
      break
    case 'large':
      classes.push('ds-card--large-padding')
      break
    default:
      classes.push('ds-card--medium-padding')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.ds-card {
  @apply rounded-lg;
}

.ds-card--default {
  @apply bg-gray-800 border border-gray-600;
}

.ds-card--elevated {
  @apply bg-gray-800 shadow-lg;
}

.ds-card--outlined {
  @apply bg-transparent border-2 border-gray-600;
}

.ds-card--filled {
  @apply bg-gray-700;
}

.ds-card--no-padding :deep(.p-card-content) {
  @apply p-0;
}

.ds-card--small-padding :deep(.p-card-content) {
  @apply p-3;
}

.ds-card--medium-padding :deep(.p-card-content) {
  @apply p-6;
}

.ds-card--large-padding :deep(.p-card-content) {
  @apply p-8;
}

.ds-card__title {
  @apply text-xl font-semibold text-white mb-2;
}

.ds-card__subtitle {
  @apply text-gray-400 text-sm;
}
</style>
