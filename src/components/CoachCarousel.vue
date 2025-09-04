<template>
  <div class="w-full">
    <div class="flex items-center gap-2 mt-[20px]">
      <Button icon="pi pi-chevron-left" text @click="scroll(-1)" aria-label="Scroll left" />
      <div ref="scroller" class="flex items-stretch overflow-x-auto gap-3 px-1 py-1" style="scroll-behavior:smooth;">
        <div v-for="coach in coachList" :key="coach.id" class="min-w-[260px] flex">
          <Card class="bg-gray-800 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors h-full w-full">
            <template #content>
              <div class="flex flex-col items-center gap-3 p-4 h-full min-h-[320px]">
                <div class="flex flex-col items-center gap-3 w-full flex-1">
                  <img v-if="coach.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-24 h-24 rounded-full object-cover" />
                  <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {{ coach.displayName.charAt(0) }}
                  </div>
                  <p class="font-semibold text-center truncate w-full">{{ coach.displayName }}</p>
                  <ul v-if="coach.highlights && coach.highlights.length" class="text-xs text-gray-300 list-disc list-outside pl-5 space-y-1 text-left mx-auto inline-block">
                    <li v-for="(h, i) in coach.highlights.slice(0, 2)" :key="i">{{ h }}</li>
                  </ul>
                </div>
                <div class="w-full mt-auto">
                  <div class="flex flex-col items-center gap-1 w-full">
                    <a href="#" class="text-sm text-purple-400 hover:text-purple-300">Practice Call</a>
                    <a href="#" class="text-sm text-purple-400 hover:text-purple-300" @click.prevent="openCoachInfo(coach)">Learn More</a>
                  </div>
                  <div class="flex justify-center">
                    <Button label="Select" size="small" severity="secondary" class="mt-2 w-1/2" @click="useCoach(coach)" />
                  </div>
                </div>
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

<style scoped>
:deep(.p-card) {
  border-radius: 0.5rem; /* 8px */
  overflow: hidden;
  height: 100%;
  display: flex;
}
:deep(.p-card .p-card-body) {
  display: flex;
  flex: 1 1 auto;
}
:deep(.p-card .p-card-content) {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
