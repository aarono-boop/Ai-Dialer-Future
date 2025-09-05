<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Top Bar -->
      <div class="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <img v-if="coach?.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-10 h-10 rounded-full object-cover" />
          <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white font-semibold">{{ coachInitials }}</span>
          </div>
          <div class="truncate">
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold truncate">{{ coach?.displayName || 'Coach' }}'s Dashboard</h1>
              <a :href="landingUrl" target="_blank" class="text-blue-300 text-xs hover:underline whitespace-nowrap">View Landing Page</a>
            </div>
            <p class="text-gray-400 text-xs">7‑Figure Sales Coach</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Dropdown v-model="selectedRange" :options="ranges" optionLabel="label" optionValue="value" class="w-40" />
          <Button label="Export" icon="pi pi-download" severity="secondary" size="small" @click="exportReport" />
          <Button label="Back to App" icon="pi pi-arrow-left" severity="secondary" size="small" text @click="goBack" />
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-wallet text-blue-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Monthly Earnings</p>
                <p class="text-2xl font-bold">{{ currency(monthlyEarnings) }}</p>
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-users text-green-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Active Students</p>
                <p class="text-2xl font-bold">{{ activeStudents }}</p>
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-calendar text-cyan-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Appointments Set (Mo.)</p>
                <p class="text-2xl font-bold">{{ appointments }}</p>
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-user-plus text-emerald-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">New Students (Mo.)</p>
                <p class="text-2xl font-bold">{{ newStudents }}</p>
              </div>
            </div>
          </template>
        </Card
        >
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-user text-teal-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Total Students</p>
                <p class="text-2xl font-bold">{{ activeStudents }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Revenue Trend and Attention -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700 lg:col-span-2">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-chart-line"></i><span>Revenue Trends (6 Months)</span></div>
          </template>
          <template #content>
            <Chart type="line" :data="revenueChartData" :options="revenueChartOptions" class="w-full" style="width: 100%; height: 16rem;" />
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-clipboard"></i><span>Coaching Actions</span></div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-calendar text-blue-300"></i><span>Schedule Group Session</span></div>
                <Button label="Schedule" icon="pi pi-arrow-right" size="small" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-video text-purple-300"></i><span>Send Video Message to All</span></div>
                <Button label="Send" icon="pi pi-send" size="small" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-file-edit text-green-300"></i><span>Update Coaching Scripts</span></div>
                <Button label="Update" icon="pi pi-pencil" size="small" @click="noop" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Leaderboard and Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700 lg:col-span-2">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2"><i class="pi pi-trophy"></i><span>Student Performance Leaderboard</span></div>
              <Button icon="pi pi-share-alt" label="Share" size="small" text @click="noop" />
            </div>
          </template>
          <template #content>
            <DataTable :value="leaderboard" size="large" class="text-sm" :pt="{ headerRow: { class: 'h-12' }, bodyRow: { class: 'h-14' } }">
              <Column field="rank" header="#" style="width: 50px" headerClass="py-6 px-5" bodyClass="py-6 px-5" />
              <Column header="Student" headerClass="py-6 px-5" bodyClass="py-6 px-5">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    <span>{{ data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="calls" headerClass="py-6 px-5" bodyClass="py-6 px-5" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Calls</div>
                </template>
              </Column>
              <Column field="conversions" headerClass="py-6 px-5" bodyClass="py-6 px-5" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Appointments Set</div>
                </template>
              </Column>
              <Column headerClass="py-6 px-5" bodyClass="py-6 px-5" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Conversion %</div>
                </template>
                <template #body="{ data }">{{ (data.conversions / Math.max(1, data.calls) * 100).toFixed(1) }}%</template>
              </Column>
            </DataTable>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-bell"></i><span>Students Requiring Attention</span></div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div v-for="s in studentsNeedingAttention" :key="s.name" class="flex items-center justify-between bg-gray-700/60 rounded px-3 py-2">
                <div class="flex items-center gap-2 min-w-0">
                  <i class="pi pi-exclamation-circle text-red-400"></i>
                  <div class="min-w-0">
                    <p class="truncate font-medium">{{ s.name }}</p>
                    <p class="text-xs text-red-300 truncate">{{ s.reason }}</p>
                  </div>
                </div>
                <Button label="Intervene" size="small" text severity="danger" @click="noop" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Portfolio Snapshot -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card class="bg-gray-800 border-gray-700 md:col-start-3">
          <template #title>
            <div class="flex items-center gap-2"><i class="pi pi-chart-bar"></i><span>Portfolio Snapshot</span></div>
          </template>
          <template #content>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Student Retention Rate</span>
                <Tag :value="retentionRate + '%'" severity="success" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Average Student Tenure</span>
                <span class="font-semibold">{{ avgTenure }} months</span>
              </div>
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
import Chart from 'primevue/chart'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName?: string | null }>()

const { coachList, generateCoachUrl } = useCoaches()
const coach = computed(() => coachList.value.find(c => c.name === props.coachName) || null)
const coachInitials = computed(() => {
  const n = coach.value?.displayName || 'C D'
  return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)
})
const landingUrl = computed(() => generateCoachUrl(props.coachName || ''))

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

const monthlyEarnings = computed(() => rand(82000, 138000, 941))
const appointments = computed(() => rand(3200, 8200, 877))
const activeStudents = computed(() => rand(1200, 4200, 883))
const newStudents = computed(() => Math.max(100, Math.round(activeStudents.value * 0.08)))
const retentionRate = computed(() => 85 + (seed.value % 10))
const avgTenure = computed(() => 6 + (seed.value % 12))

// Revenue trend (6 months)
const months = computed(() => Array.from({ length: 6 }, (_, i) => new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString(undefined, { month: 'short' })))
const revenueSeries = computed(() => months.value.map((_, i) => 60000 + i * 8000 + ((seed.value % 5) * 1500)))
const revenueChartData = computed(() => ({
  labels: months.value,
  datasets: [
    {
      label: 'Revenue',
      data: revenueSeries.value,
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96,165,250,0.2)',
      fill: true,
      tension: 0.35,
      pointRadius: 0
    }
  ]
}))
const revenueChartOptions = { maintainAspectRatio: false,
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
    y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } }
  }
}

const leaderboard = computed(() => Array.from({length: 8}, (_, i) => ({
  rank: i + 1,
  name: ['Alex Riley','Samantha Chen','Marcus Bell','Jessica Vazquez','Noah Green','Emma Brooks','Liam Carter','Mia Patel'][i],
  calls: 900 + ((seed.value + i) % 600),
  conversions: 60 + ((seed.value + i) % 80),
  score: 50 + ((seed.value + i) % 50)
})))

const studentsNeedingAttention = computed(() => {
  const reasons = ['Low Answer Rate: 22%','Declining Call Volume: -15%','Poor Conversion: 1.2%','Not Logging In: 5 days ago']
  const names = ['Kevin Thompson','Brenda Garcia','Tom Franklin','Olivia White']
  return names.map((n, i) => ({ name: n, reason: reasons[i] }))
})

const newStudents30d = computed(() => newStudents.value + ((seed.value % 5)))
const messagesSent = computed(() => 200 + (seed.value % 300))
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
const goBack = () => { window.location.href = window.location.pathname }
const noop = () => {}
</script>
