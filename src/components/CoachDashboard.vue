<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            v-if="coach?.avatarUrl"
            :src="coach.avatarUrl"
            :alt="coach.displayName"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white font-semibold text-lg">{{ coachInitials }}</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ coach?.displayName || 'Coach' }} Dashboard</h1>
            <p class="text-gray-400 text-sm">Insights across students, earnings, and coaching impact</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Dropdown v-model="selectedRange" :options="ranges" optionLabel="label" optionValue="value" class="w-44" />
          <Button label="Export" icon="pi pi-download" severity="secondary" size="small" @click="exportReport" />
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Monthly Earnings</p>
                <p class="text-3xl font-bold">{{ currency(monthlyEarnings) }}</p>
              </div>
              <i class="pi pi-wallet text-2xl text-blue-400"></i>
            </div>
            <div class="mt-3">
              <ProgressBar :value="earningsGrowthPercent" showValue />
              <small class="text-gray-400">{{ earningsGrowthLabel }}</small>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Active Students</p>
                <p class="text-3xl font-bold">{{ activeStudents }}</p>
              </div>
              <i class="pi pi-users text-2xl text-green-400"></i>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div class="bg-gray-700 rounded p-2">
                <div class="text-gray-400">New</div>
                <div class="font-semibold">{{ newStudents }}</div>
              </div>
              <div class="bg-gray-700 rounded p-2">
                <div class="text-gray-400">Retention</div>
                <div class="font-semibold">{{ retentionRate }}%</div>
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Portfolio Snapshot</p>
                <p class="text-3xl font-bold">{{ portfolioScore }}%</p>
              </div>
              <i class="pi pi-chart-bar text-2xl text-purple-400"></i>
            </div>
            <div class="mt-3 space-y-2">
              <div>
                <div class="flex justify-between text-sm"><span>Engagement</span><span>{{ engagement }}%</span></div>
                <ProgressBar :value="engagement" />
              </div>
              <div>
                <div class="flex justify-between text-sm"><span>Completion</span><span>{{ completion }}%</span></div>
                <ProgressBar :value="completion" severity="success" />
              </div>
              <div>
                <div class="flex justify-between text-sm"><span>Consistency</span><span>{{ consistency }}%</span></div>
                <ProgressBar :value="consistency" severity="info" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Revenue Trend & Attention List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700 lg:col-span-2">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-chart-line"></i><span>Revenue Trend</span></div>
          </template>
          <template #content>
            <DataTable :value="revenueRows" size="small" class="text-sm">
              <Column field="month" header="Month" />
              <Column header="Revenue">
                <template #body="{ data }">{{ currency(data.amount) }}</template>
              </Column>
              <Column header="Trend">
                <template #body="{ data }">
                  <ProgressBar :value="Math.round((data.amount / maxRevenue) * 100)" style="height: 8px" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-bell"></i><span>Students Needing Attention</span></div>
          </template>
          <template #content>
            <DataTable :value="studentsNeedingAttention" size="small" class="text-sm" :rows="5" :paginator="studentsNeedingAttention.length > 5">
              <Column field="name" header="Student" />
              <Column field="reason" header="Reason" />
              <Column header="Priority">
                <template #body="{ data }">
                  <Tag :value="data.priority" :severity="prioritySeverity(data.priority)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Coaching Action Items & Leaderboard -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-clipboard"></i><span>Coaching Action Items</span></div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-blue-300"></i>
                  <span>Schedule group session</span>
                </div>
                <Button label="Schedule" icon="pi pi-arrow-right" size="small" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-video text-purple-300"></i>
                  <span>Send a video message to students</span>
                </div>
                <Button label="Send" icon="pi pi-send" size="small" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-file-edit text-green-300"></i>
                  <span>Update scripts</span>
                </div>
                <Button label="Update" icon="pi pi-pencil" size="small" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-cog text-yellow-300"></i>
                  <span>Update coaching methodology</span>
                </div>
                <Button label="Review" icon="pi pi-cog" size="small" @click="noop" />
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700 lg:col-span-2">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-trophy"></i><span>Student Performance Leaderboard</span></div>
          </template>
          <template #content>
            <DataTable :value="leaderboard" size="small" class="text-sm" :rows="7" :paginator="leaderboard.length > 7">
              <Column field="rank" header="#" style="width: 60px" />
              <Column field="name" header="Student" />
              <Column field="calls" header="Calls" />
              <Column field="conversions" header="Conversions" />
              <Column header="Score">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <ProgressBar :value="data.score" style="height: 8px; flex: 1" />
                    <span class="w-10 text-right">{{ data.score }}%</span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Network Insights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">New Students (30d)</p>
                <p class="text-2xl font-bold">{{ newStudents30d }}</p>
              </div>
              <i class="pi pi-user-plus text-xl text-teal-400"></i>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Messages Sent (30d)</p>
                <p class="text-2xl font-bold">{{ messagesSent }}</p>
              </div>
              <i class="pi pi-envelope text-xl text-indigo-400"></i>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Avg Weekly Sessions</p>
                <p class="text-2xl font-bold">{{ avgWeeklySessions }}</p>
              </div>
              <i class="pi pi-clock text-xl text-amber-400"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName?: string | null }>()

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

// Deterministic seed from coach name
const seed = computed(() => {
  const s = props.coachName || 'coach'
  let h = 0
  for (let i=0; i<s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return Math.abs(h)
})
const rand = (min:number, max:number, m:number=997) => {
  const r = (seed.value % m) / m
  return Math.round(min + (max - min) * r)
}

const monthlyEarnings = computed(() => rand(1800, 8400, 941))
const earningsPrev = computed(() => rand(1200, 7800, 839))
const earningsGrowthPercent = computed(() => {
  const prev = earningsPrev.value || 1
  return Math.max(0, Math.min(100, Math.round(((monthlyEarnings.value - prev) / prev) * 100)))
})
const earningsGrowthLabel = computed(() => `${earningsGrowthPercent.value >= 0 ? 'Up' : 'Down'} ${Math.abs(earningsGrowthPercent.value)}% vs prior`)

const activeStudents = computed(() => rand(12, 120, 883))
const newStudents = computed(() => Math.max(1, Math.round(activeStudents.value * 0.1)))
const retentionRate = computed(() => 70 + (seed.value % 25))

const engagement = computed(() => 60 + (seed.value % 30))
const completion = computed(() => 50 + (seed.value % 40))
const consistency = computed(() => 55 + (seed.value % 35))
const portfolioScore = computed(() => Math.round((engagement.value + completion.value + consistency.value) / 3))

const revenueRows = computed(() => {
  const base = monthlyEarnings.value
  const arr = Array.from({length: 6}, (_, i) => ({
    month: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString(undefined, { month: 'short' }),
    amount: Math.max(500, Math.round(base * (0.6 + (i*0.05)) - ((seed.value % 7) * 20)))
  }))
  return arr
})
const maxRevenue = computed(() => revenueRows.value.reduce((m, r) => Math.max(m, r.amount), 0))

const studentsNeedingAttention = computed(() => {
  const reasons = ['No activity 7d', 'Low connect rate', 'Missed session', 'Falling behind']
  const priorities: ('High'|'Medium'|'Low')[] = ['High','Medium','Low']
  const names = ['Avery','Blake','Casey','Drew','Emerson','Finley','Hayden','Jordan','Kai','Logan','Morgan','Parker']
  return Array.from({length: 8}, (_, i) => ({
    name: `${names[(i + seed.value) % names.length]} ${String.fromCharCode(65 + i)}`,
    reason: reasons[(i + (seed.value % 3)) % reasons.length],
    priority: priorities[(i + (seed.value % 2)) % priorities.length]
  }))
})

const prioritySeverity = (p: string) => p === 'High' ? 'danger' : p === 'Medium' ? 'warn' : 'info'

const leaderboard = computed(() => {
  return Array.from({length: 12}, (_, i) => ({
    rank: i + 1,
    name: `Student ${i + 1}`,
    calls: 40 + ((seed.value + i) % 60),
    conversions: 5 + ((seed.value + i) % 12),
    score: 50 + ((seed.value + i) % 50)
  }))
})

const newStudents30d = computed(() => newStudents.value + ((seed.value % 5)))
const messagesSent = computed(() => 20 + (seed.value % 80))
const avgWeeklySessions = computed(() => 2 + (seed.value % 4))

const exportReport = () => {
  const blob = new Blob([JSON.stringify({ coach: coach.value?.name, when: new Date().toISOString() }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${coach.value?.name || 'coach'}-dashboard-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const currency = (n: number) => '$' + Number(n || 0).toLocaleString()
const noop = () => {}
</script>
