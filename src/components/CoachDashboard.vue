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
          <Button label="Export" icon="pi pi-download" severity="secondary" size="small" @click="exportReport" />
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-wallet text-blue-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Monthly Earnings<span v-if="selectedRangeLabel"> ({{ selectedRangeLabel }})</span></p>
                <p class="text-2xl font-bold">{{ currency(monthlyEarnings) }}</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-calendar text-cyan-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">Appointments Set<span v-if="selectedRangeLabel"> ({{ selectedRangeLabel }})</span></p>
                <p class="text-2xl font-bold">{{ appointments.toLocaleString() }}</p>
              </div>
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center"><i class="pi pi-user-plus text-emerald-300"></i></div>
              <div>
                <p class="text-gray-400 text-xs">New Students<span v-if="selectedRangeLabel"> ({{ selectedRangeLabel }})</span></p>
                <p class="text-2xl font-bold">{{ newStudents.toLocaleString() }}</p>
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
                <p class="text-2xl font-bold">{{ activeStudents.toLocaleString() }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Revenue Trend and Attention -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-4 gap-x-4 lg:gap-x-[36px]">
        <div class="lg:col-span-2 space-y-2">
          <div class="flex items-center gap-2 px-1"><i class="pi pi-chart-line"></i><span>Revenue Trends<span v-if="selectedRangeLabel"> ({{ selectedRangeLabel }})</span></span></div>
          <div class="bg-gray-700 border border-gray-700 rounded-xl p-3 h-64">
            <Chart type="line" :data="revenueChartData" :options="revenueChartOptions" class="w-full" style="width: 100%; height: 100%;" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 px-1"><i class="pi pi-clipboard"></i><span>Coaching Actions</span></div>
          <div class="bg-gray-700 border border-gray-700 rounded-xl p-3 h-64 overflow-y-auto">
            <div class="space-y-3">
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-calendar text-blue-300"></i><span>Schedule Group Session</span></div>
                <Button label="Schedule" icon="pi pi-arrow-right" size="small" severity="secondary" class="w-28" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-video text-purple-300"></i><span>Send Video Message to All</span></div>
                <Button label="Send" icon="pi pi-send" size="small" severity="secondary" class="w-28" @click="noop" />
              </div>
              <div class="flex items-center justify-between bg-gray-700 rounded p-3">
                <div class="flex items-center gap-2"><i class="pi pi-file-edit text-green-300"></i><span>Update Coaching Scripts</span></div>
                <Button label="Update" icon="pi pi-pencil" size="small" severity="secondary" class="w-28" @click="noop" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard and Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-4 gap-x-4 lg:gap-x-[36px]">
        <div class="lg:col-span-2 space-y-2">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2"><i class="pi pi-trophy"></i><span>Student Performance Leaderboard</span></div>
            <Button icon="pi pi-share-alt" label="Share" size="small" text @click="openShare" />
          </div>
          <div class="bg-gray-700 border border-gray-700 rounded-xl p-0 overflow-hidden">
            <DataTable :value="leaderboard" size="large" >
              <Column field="rank" header="#" style="width: 50px" />
              <Column header="Avatar">
                <template #body="{ data }">
                  <Avatar :image="getAvatarUrl(data.name)" shape="circle" style="width: 28px; height: 28px" />
                </template>
              </Column>
              <Column field="name" header="Student" />
              <Column field="subscription" header="Subscription">
                <template #body="{ data }">
                  <Badge :value="data.subscription" :severity="subscriptionSeverity(data.subscription)" />
                </template>
              </Column>
              <Column field="calls" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Calls</div>
                </template>
              </Column>
              <Column field="answerRate" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right whitespace-nowrap">Answer Rate</div>
                </template>
                <template #body="{ data }">{{ (data.answerRate * 100).toFixed(1) }}%</template>
              </Column>
              <Column field="appointments" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Appointments</div>
                </template>
              </Column>
              <Column field="followUps" bodyStyle="text-align:right">
                <template #header>
                  <div class="w-full text-right">Follow-ups</div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="mt-5 space-y-2">
          <div class="flex items-center gap-2 px-1"><i class="pi pi-bell"></i><span>Students Requiring Attention</span></div>
          <div class="bg-gray-700 border border-gray-700 rounded-xl p-3">
            <div class="space-y-3">
              <div v-for="s in studentsNeedingAttention" :key="s.name" class="flex items-center justify-between bg-gray-700/60 rounded px-3 py-2">
                <div class="flex items-center gap-2 min-w-0">
                  <i class="pi pi-exclamation-circle text-red-400"></i>
                  <Avatar :image="getAvatarUrl(s.name)" shape="circle" style="width: 28px; height: 28px" />
                  <div class="min-w-0">
                    <p class="truncate font-medium">{{ s.name }}</p>
                    <p class="text-xs text-red-300 truncate">{{ s.reason }}</p>
                  </div>
                </div>
                <Button label="Intervene" size="small" severity="secondary" class="w-28" @click="noop" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Top Performers Modal -->
      <Dialog v-model:visible="showShare" modal header="Share Top Performers" :style="{ width: '42rem' }" :breakpoints="{ '960px': '95vw' }">
        <div class="space-y-4">
          <p class="text-gray-300 text-sm">Select which students to include in your post.</p>
          <div class="space-y-3">
            <div v-for="item in shareList" :key="item.rank" class="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
              <div class="flex items-center gap-3 min-w-0">
                <Checkbox v-model="item.selected" :binary="true" />
                <Avatar :image="getAvatarUrl(item.name)" shape="circle" size="large" />
                <span class="font-medium truncate">{{ item.name }}</span>
              </div>
              <span class="text-gray-400 text-sm whitespace-nowrap">Rank #{{ item.rank }}</span>
            </div>
          </div>

          <div>
            <Textarea v-model="shareText" autoResize rows="6" class="w-full" />
          </div>

          <div class="flex items-center gap-3">
            <Button label="Copy Text" class="flex-1" @click="copyShareText" />
            <Button icon="pi pi-twitter" text aria-label="Share on X" />
            <Button icon="pi pi-linkedin" text aria-label="Share on LinkedIn" />
            <Button icon="pi pi-facebook" text aria-label="Share on Facebook" />
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName?: string | null }>()

const { coachList, generateCoachUrl } = useCoaches()
const coach = computed(() => coachList.value.find(c => c.name === props.coachName) || null)
const coachInitials = computed(() => {
  const n = coach.value?.displayName || 'C D'
  return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2)
})

// Fake avatar pool (static images)
const avatarPool = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/71.jpg',
  'https://randomuser.me/api/portraits/women/19.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/women/72.jpg',
  'https://randomuser.me/api/portraits/men/50.jpg',
  'https://randomuser.me/api/portraits/women/52.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
  'https://randomuser.me/api/portraits/women/9.jpg'
]
const getAvatarUrl = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = Math.imul(31, h) + name.charCodeAt(i) | 0
  const idx = Math.abs(h) % avatarPool.length
  return avatarPool[idx]
}
const landingUrl = computed(() => generateCoachUrl(props.coachName || ''))

const ranges = [
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' }
]
const selectedRange = ref('30d')
const selectedRangeLabel = computed(() => ranges.find(r => r.value === selectedRange.value)?.label || '')

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

const baseMonthlyEarnings = computed(() => rand(82000, 138000, 941))
const baseAppointments = computed(() => rand(3200, 8200, 877))
const activeStudents = computed(() => rand(1200, 4200, 883))
const baseNewStudents = computed(() => Math.max(100, Math.round(activeStudents.value * 0.08)))

const daysSinceJan1 = computed(() => {
  const start = new Date(new Date().getFullYear(), 0, 1).getTime()
  const now = Date.now()
  return Math.max(1, Math.round((now - start) / 86400000))
})
const rangeFactor = computed(() => {
  switch (selectedRange.value) {
    case '90d': return 3
    case 'ytd': return Math.max(1, Math.round(daysSinceJan1.value / 30))
    default: return 1 // '30d'
  }
})

const monthlyEarnings = computed(() => Math.round(baseMonthlyEarnings.value * rangeFactor.value))
const appointments = computed(() => Math.round(baseAppointments.value * rangeFactor.value))
const newStudents = computed(() => Math.round(baseNewStudents.value * rangeFactor.value))

// Revenue trend reflects selected time range
const revenueLabels = computed(() => {
  const range = selectedRange.value
  if (range === 'ytd') {
    const now = new Date()
    const monthsCount = now.getMonth() + 1 // Jan=0
    return Array.from({ length: monthsCount }, (_, i) => new Date(now.getFullYear(), i, 1).toLocaleString(undefined, { month: 'short' }))
  }
  const days = range === '90d' ? 90 : 30
  const labels: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleString(undefined, { month: 'short', day: 'numeric' }))
  }
  return labels
})

const revenueSeries = computed(() => {
  const n = revenueLabels.value.length
  let value = 55000 + (seed.value % 8000)
  const out: number[] = []
  const isMonthly = selectedRange.value === 'ytd'
  for (let i = 0; i < n; i++) {
    const seasonal = isMonthly
      ? Math.round(3000 * Math.sin((i + (seed.value % 3)) * Math.PI / 3))
      : Math.round(250 * Math.sin((i + (seed.value % 5)) * Math.PI / 7))
    const noise = isMonthly
      ? (((seed.value * (i + 11)) % 1200) - 600)
      : (((seed.value * (i + 17)) % 120) - 60)
    const trend = isMonthly
      ? (2500 + ((seed.value + i) % 2000))
      : (120 + ((seed.value + i) % 60))
    value = Math.max(5000, value + trend + seasonal + noise)
    out.push(value)
  }
  return out
})

const revenueChartData = computed(() => ({
  labels: revenueLabels.value,
  datasets: [
    {
      label: 'Revenue',
      data: revenueSeries.value,
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96,165,250,0.2)',
      fill: true,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      pointRadius: 2
    }
  ]
}))
const revenueChartOptions = { maintainAspectRatio: false,
  responsive: true,
  interaction: { mode: 'index', intersect: false, axis: 'x' },
  plugins: {
    legend: { display: false },
    tooltip: {
      intersect: false,
      displayColors: false,
      callbacks: {
        label: (context: any) => {
          const label = (context.dataset && context.dataset.label) ? context.dataset.label : 'Revenue'
          const v = typeof context.parsed?.y === 'number' ? context.parsed.y : Number(context.formattedValue || 0)
          return `${label}: $${Number(v).toLocaleString()}`
        }
      }
    }
  },
  elements: { point: { hitRadius: 20, hoverRadius: 6 } },
  scales: {
    x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
    y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } }
  }
}

const baseLeaderboard = computed(() => Array.from({length: 8}, (_, i) => {
  const name = ['Alex Riley','Samantha Chen','Marcus Bell','Jessica Vazquez','Noah Green','Emma Brooks','Liam Carter','Mia Patel'][i]
  const calls = 900 + ((seed.value + i) % 600)
  const appointments = 60 + ((seed.value + i) % 80)
  const answerRate = Math.min(0.95, Math.max(0.05, appointments / Math.max(1, calls)))
  const followUps = 10 + ((seed.value + i) % 20)
  const subs = ['Standard','Premium','Platinum'][(seed.value + i) % 3] as 'Standard' | 'Premium' | 'Platinum'
  return {
    rank: i + 1,
    name,
    subscription: subs,
    calls,
    answerRate,
    appointments,
    followUps
  }
}))

const leaderboard = computed(() => baseLeaderboard.value.map((s, i) => {
  const jitterSeed = (selectedRange.value === '90d' ? 17 : selectedRange.value === 'ytd' ? 29 : 11)
  const jitter = 1 + ((((seed.value + i * 13 + jitterSeed) % 7) - 3) / 100) // ±3%
  const calls = Math.max(1, Math.round(s.calls * rangeFactor.value * jitter))
  const appointments = Math.round(calls * s.answerRate)
  const followUps = Math.round(Math.max(5, appointments * 0.25))
  return {
    rank: s.rank,
    name: s.name,
    subscription: s.subscription,
    calls,
    answerRate: appointments / Math.max(1, calls),
    appointments,
    followUps
  }
}))

const studentsNeedingAttention = computed(() => {
  const reasons = ['Low Answer Rate: 22%','Declining Call Volume: -15%','Poor Conversion: 1.2%','Not Logging In: 5 days ago']
  const names = ['Kevin Thompson','Brenda Garcia','Tom Franklin','Olivia White']
  return names.map((n, i) => ({ name: n, reason: reasons[i] }))
})


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

// Share dialog state
const showShare = ref(false)
const shareList = ref<{ rank:number; name:string; selected:boolean }[]>([])
const shareText = ref('')

const buildShareText = () => {
  const selected = shareList.value.filter(s => s.selected).map(s => s.name)
  const medals = ['����', '🥈', '🥉']
  const lines = selected.map((n, i) => `${medals[i] || '🏅'} ${n}`)
  return [
    'Incredible performance from my students this week! 🚀 Shoutout to our top performers on the leaderboard:',
    '',
    ...lines
  ].join('\n')
}

const openShare = () => {
  shareList.value = leaderboard.value.slice(0, 5).map((s, i) => ({ rank: s.rank, name: s.name, selected: i < 3 }))
  shareText.value = buildShareText()
  showShare.value = true
}

watch(shareList, () => { shareText.value = buildShareText() }, { deep: true })

const copyShareText = async () => {
  try {
    await navigator.clipboard.writeText(shareText.value)
  } catch {}
}

const noop = () => {}

const subscriptionSeverity = (level: 'Standard' | 'Premium' | 'Platinum') => {
  switch (level) {
    case 'Platinum': return 'info'
    case 'Premium': return 'success'
    default: return 'secondary'
  }
}
</script>
