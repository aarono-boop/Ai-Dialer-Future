<template>
  <div class="w-full">
    <div class="flex items-center gap-2">
      <Button icon="pi pi-chevron-left" text @click="scroll(-1)" aria-label="Scroll left" />
      <div ref="scroller" class="flex overflow-x-auto gap-3 px-1 py-1" style="scroll-behavior:smooth;">
        <div v-for="coach in coachList" :key="coach.id" class="min-w-[260px]">
          <Card class="bg-gray-800 border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
            <template #content>
              <div class="flex items-center gap-3 p-3">
                <img v-if="coach.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-10 h-10 rounded-full object-cover" />
                <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {{ coach.displayName.charAt(0) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold truncate">{{ coach.displayName }}</p>
                </div>
                <Button label="Use" size="small" @click="useCoach(coach)" />
              </div>
            </template>
          </Card>
        </div>
      </div>
      <Button icon="pi pi-chevron-right" text @click="scroll(1)" aria-label="Scroll right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useCoaches } from '../composables/useCoaches'

const { coachList, generateCoachUrl } = useCoaches()

const scroller = ref<HTMLElement | null>(null)
const scroll = (dir: number) => {
  if (scroller.value) scroller.value.scrollBy({ left: dir * 300, behavior: 'smooth' })
}

const useCoach = (coach: any) => {
  const url = generateCoachUrl(coach.name)
  window.location.href = url
}
</script>
