<template>
  <i 
    :class="iconClass"
    :aria-label="label"
    :aria-hidden="decorative ? 'true' : 'false'"
    :role="decorative ? 'presentation' : 'img'"
  ></i>
</template>

<script setup lang="ts">
interface Props {
  iconClass: string
  label?: string
  decorative?: boolean
}

withDefaults(defineProps<Props>(), {
  decorative: false
})
</script>
