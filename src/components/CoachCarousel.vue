<template>
  <div class="w-full">
    <Carousel :value="coachList" :numVisible="3" :numScroll="3" :responsiveOptions="responsive" circular :showIndicators="false" :showNavigators="true">
      <template #item="{ data }">
        <Card class="bg-gray-800 border-gray-700 rounded-lg hover:border-gray-600 transition-colors mx-2">
          <template #content>
            <div class="flex items-center gap-3 p-3">
              <img v-if="data.avatarUrl" :src="data.avatarUrl" :alt="data.displayName" class="w-10 h-10 rounded-full object-cover" />
              <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {{ data.displayName.charAt(0) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold truncate">{{ data.displayName }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <Badge v-if="data.videoId" value="Video" severity="info" class="text-xs" />
                  <Badge v-if="data.avatarUrl" value="Avatar" severity="success" class="text-xs" />
                </div>
              </div>
              <Button label="Use" size="small" @click="useCoach(data)" />
            </div>
          </template>
        </Card>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import Carousel from 'primevue/carousel'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import { computed } from 'vue'
import { useCoaches } from '../composables/useCoaches'

const { coachList, generateCoachUrl } = useCoaches()

const responsive = [
  { breakpoint: '1024px', numVisible: 2, numScroll: 2 },
  { breakpoint: '640px', numVisible: 1, numScroll: 1 }
]

const useCoach = (coach: any) => {
  const url = generateCoachUrl(coach.name)
  window.location.href = url
}
</script>
