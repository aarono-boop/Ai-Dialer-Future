<template>
  <div class="min-h-screen bg-gray-900 text-white p-8" role="region" aria-label="Student Dashboard">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">
        {{ title }}
      </h1>
      <p class="text-sm text-gray-400">This page is intentionally blank for now. We will build out the student dashboard here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ coachName: string | null }>()

const title = computed(() => {
  if (!props.coachName) return "Student Dashboard"
  // Convert slug-like coachName to display form (e.g., jordan-stupar -> Jordan Stupar)
  const display = props.coachName
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
  return `${display}'s Student Dashboard`
})
</script>
