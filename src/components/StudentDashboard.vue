<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Top Bar (copied from CoachDashboard and adapted) -->
      <div class="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <img v-if="coach?.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-10 h-10 rounded-full object-cover" />
          <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white font-semibold">{{ coachInitials }}</span>
          </div>
          <div class="truncate">
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold truncate">{{ coach?.displayName || 'Coach' }}'s Student Dashboard</h1>
            </div>
            <p class="text-gray-400 text-xs">Student cohort overview</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Dropdown v-model="selectedRange" :options="ranges" optionLabel="label" optionValue="value" class="w-40" />
          <Button label="Back to App" icon="pi pi-arrow-left" severity="secondary" size="small" text @click="goBack" />
        </div>
      </div>

      <!-- Placeholder content -->
      <div class="p-6 border border-gray-700 rounded-xl bg-gray-800/60 text-sm text-gray-300">
        This page is intentionally blank for now. We will build out the student dashboard here.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName: string | null }>()
const emit = defineEmits<{ (e: 'back-to-app'): void }>()

const { coachList } = useCoaches()
const coach = computed(() => coachList.value.find(c => c.name === props.coachName) || null)
const coachInitials = computed(() => {
  const n = coach.value?.displayName || 'C D'
  return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)
})

const ranges = [
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' }
]
const selectedRange = ref('30d')

const goBack = () => { emit('back-to-app') }
</script>
