<template>
  <div class="min-h-screen bg-gray-900 text-white p-6" role="region" aria-label="Student Dashboard">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Top Bar (duplicated from Coach Dashboard) -->
      <div class="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <img v-if="coach?.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-10 h-10 rounded-full object-cover" />
          <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white font-semibold">{{ coachInitials }}</span>
          </div>
          <div class="truncate">
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold truncate">{{ headerTitle }}</h1>
            </div>
            <p class="text-gray-400 text-xs">Student Performance Overview</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Dropdown
            v-model="selectedRange"
            :options="ranges"
            optionLabel="label"
            optionValue="value"
            class="w-40 mic-like-dropdown"
            variant="filled"
            appendTo="body"
            :pt="{
              root: { style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '0.5rem' } },
              panel: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)' } },
              overlay: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)' } },
              content: { class: 'mic-dropdown-content', style: { background: 'var(--p-surface-800)', padding: '0.25rem' } },
              list: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
              items: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
              item: { class: 'mic-dropdown-item hover:bg-white/10', style: { padding: '0.5rem 0.75rem' } }
            }"
          />
          <Button icon="pi pi-cog" severity="secondary" text rounded aria-label="Dashboard settings" @click="showSettingsDialog = true" />
        </div>
      </div>

      <!-- Students Table Card -->
      <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
        <DataTable :value="students" size="large" :pt="{ headerRow: { class: 'h-12' }, bodyRow: { class: 'h-14' } }">
          <Column field="rank" header="#" style="width: 60px" headerClass="py-6 px-4" bodyClass="py-6 px-4" />
          <Column header="Avatar" headerClass="py-6 px-4" bodyClass="py-6 px-4">
            <template #body="{ data }">
              <Avatar :image="getAvatarUrl(data.name)" shape="circle" style="width: 32px; height: 32px" />
            </template>
          </Column>
          <Column field="name" header="Student Name" headerClass="py-6 px-4" bodyClass="py-6 px-4" />
          <Column header="Subscription" headerClass="py-6 px-4" bodyClass="py-6 px-4">
            <template #body="{ data }">
              <Badge :value="data.subscription" :severity="subscriptionSeverity(data.subscription)" />
            </template>
          </Column>
          <Column field="callVolume" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right">
            <template #header>
              <div class="ml-auto text-right">Calls</div>
            </template>
          </Column>
          <Column headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right">
            <template #header>
              <div class="ml-auto text-right">Answer Rate</div>
            </template>
            <template #body="{ data }">{{ (data.answerRate * 100).toFixed(1) }}%</template>
          </Column>
          <Column field="appointments" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right">
            <template #header>
              <div class="ml-auto text-right">Appointments</div>
            </template>
          </Column>
          <Column field="followUps" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right">
            <template #header>
              <div class="ml-auto text-right">Follow-ups</div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Dialog
    :visible="showSettingsDialog"
    modal
    header="Dashboard Settings"
    :breakpoints="{ '960px': '95vw' }"
    :style="{ width: '28rem' }"
    @update:visible="(v: boolean) => showSettingsDialog = v"
  >
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">Show my information</div>
          <div class="text-sm text-gray-400">When off, your name and avatar will be hidden to remain anonymous.</div>
        </div>
        <ToggleSwitch v-model="optInIdentity" class="ai-coach-toggle" />
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <Button label="Close" severity="secondary" @click="showSettingsDialog = false" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import ToggleSwitch from 'primevue/toggleswitch'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName: string | null }>()

const displayName = computed(() => {
  if (!props.coachName) return null
  return props.coachName
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
})
const headerTitle = computed(() => displayName.value ? `${displayName.value}'s Student Dashboard` : 'Student Dashboard')

const { coachList } = useCoaches()
const coach = computed(() => props.coachName ? coachList.value.find(c => c.name === props.coachName) || null : null)
const coachInitials = computed(() => {
  const n = coach.value?.displayName || 'S D'
  return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)
})

const ranges = [
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' }
]
const selectedRange = ref('30d')
const showSettingsDialog = ref(false)
const optInIdentity = ref(true)

// Student table data
type SubscriptionLevel = 'Premium' | 'Platinum' | 'Standard'
interface StudentRow {
  rank: number
  name: string
  subscription: SubscriptionLevel
  callVolume: number
  answerRate: number // 0..1
  appointments: number
  followUps: number
}

const students = ref<StudentRow[]>([
  { rank: 1, name: 'Alex Johnson',   subscription: 'Platinum', callVolume: 420, answerRate: 0.41, appointments: 36, followUps: 18 },
  { rank: 2, name: 'Maria Garcia',   subscription: 'Premium',  callVolume: 395, answerRate: 0.38, appointments: 32, followUps: 21 },
  { rank: 3, name: 'Liam Smith',     subscription: 'Standard', callVolume: 360, answerRate: 0.35, appointments: 29, followUps: 17 },
  { rank: 4, name: 'Sophia Lee',     subscription: 'Platinum', callVolume: 345, answerRate: 0.42, appointments: 31, followUps: 19 },
  { rank: 5, name: 'Noah Williams',  subscription: 'Premium',  callVolume: 330, answerRate: 0.33, appointments: 27, followUps: 15 },
  { rank: 6, name: 'Emma Davis',     subscription: 'Standard', callVolume: 315, answerRate: 0.29, appointments: 22, followUps: 14 },
  { rank: 7, name: 'Olivia Martinez',subscription: 'Premium',  callVolume: 298, answerRate: 0.31, appointments: 24, followUps: 13 },
  { rank: 8, name: 'William Brown',  subscription: 'Standard', callVolume: 287, answerRate: 0.27, appointments: 20, followUps: 12 },
  { rank: 9, name: 'Ava Taylor',     subscription: 'Platinum', callVolume: 275, answerRate: 0.36, appointments: 23, followUps: 11 },
  { rank:10, name: 'James Wilson',   subscription: 'Standard', callVolume: 260, answerRate: 0.25, appointments: 19, followUps: 10 }
])

// Fake avatar pool and deterministic avatar selector based on name
const avatarPool = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/women/35.jpg',
  'https://randomuser.me/api/portraits/men/28.jpg',
  'https://randomuser.me/api/portraits/women/19.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg'
]
const getAvatarUrl = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = Math.imul(31, h) + name.charCodeAt(i) | 0
  const idx = Math.abs(h) % avatarPool.length
  return avatarPool[idx]
}

const subscriptionSeverity = (level: SubscriptionLevel) => {
  switch (level) {
    case 'Platinum': return 'info'
    case 'Premium': return 'success'
    default: return 'secondary'
  }
}

</script>
