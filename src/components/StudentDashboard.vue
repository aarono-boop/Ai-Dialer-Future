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
            <p class="text-gray-400 text-xs flex items-center gap-3 flex-wrap">
              <span>Students: 4,357</span>
              <span class="hidden sm:inline">•</span>
              <span>Calls: {{ headerStats.calls.toLocaleString() }}</span>
              <span class="hidden sm:inline">•</span>
              <span>Appointments: {{ headerStats.appointments.toLocaleString() }}</span>
              <span class="hidden sm:inline">•</span>
              <span>Avg Answer Rate: {{ headerStats.avgAnswerRate.toFixed(1) }}%</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <Dropdown
            v-model="selectedLink"
            :options="linkOptions"
            optionLabel="label"
            placeholder="Links"
            class="w-36 mic-like-dropdown"
            variant="filled"
            appendTo="body"
            optionDisabled="disabled"
            @change="handleLinkSelect"
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
          <Dropdown
            v-model="selectedRange"
            :options="ranges"
            optionLabel="label"
            optionValue="value"
            class="w-40 mic-like-dropdown"
            variant="filled"
            appendTo="body"
            :pt="{
              root: { style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '0.5rem', marginLeft: '15px' } },
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

      <!-- Two-Column Layout: 2/3 Students table, 1/3 Student area -->
      <div class="flex gap-4 lg:gap-[36px]">
        <div class="w-2/3">
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="font-semibold" style="color: var(--p-surface-0)">Top 20 Students</span>
          </div>
          <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-0 overflow-hidden">
            <DataTable :value="sortedStudents" scrollable scrollHeight="730px" :tableStyle="{ tableLayout: 'fixed' }" size="large" sortMode="single" :sortField="sortField" :sortOrder="sortOrder" @sort="onSort">
              <Column header="#" style="width: 60px" headerClass="py-6 px-4" :headerStyle="{ paddingLeft: '16px' }" bodyClass="py-6 px-4" :bodyStyle="{ paddingLeft: '16px' }">
  <template #body="{ data }">
    {{ descSortedStudents.findIndex(s => s === data) + 1 }}
  </template>
</Column>
              <Column header="Avatar" headerClass="py-6 px-4" bodyClass="py-6 px-4">
                <template #body="{ data }">
                  <Avatar :image="getAvatarUrl(data.name)" shape="circle" style="width: 32px; height: 32px" :class="data.anonymous ? 'blur-sm' : ''" />
                </template>
              </Column>
              <Column field="name" header="Student" headerClass="py-6 px-4" bodyClass="py-6 px-4" sortable>
                <template #body="{ data }">
                  <span :class="data.anonymous ? 'blur-sm select-none' : ''">{{ data.name }}</span>
                </template>
              </Column>
              <Column field="subscription" header="Subscription" headerClass="py-6 px-4" bodyClass="py-6 px-4" sortable>
                <template #body="{ data }">
                  <Badge :value="data.subscription" :severity="subscriptionSeverity(data.subscription)" />
                </template>
              </Column>
              <Column field="callVolume" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right" sortable>
                <template #header>
                  <div class="ml-auto text-right">Calls</div>
                </template>
                <template #body="{ data }">{{ data.callVolume.toLocaleString() }}</template>
              </Column>
              <Column field="answerRate" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right" sortable>
                <template #header>
                  <div class="ml-auto text-right whitespace-nowrap">Answer Rate</div>
                </template>
                <template #body="{ data }">{{ (data.answerRate * 100).toFixed(1) }}%</template>
              </Column>
              <Column field="appointments" headerClass="py-6 px-4" bodyClass="py-6 px-4" bodyStyle="text-align:right" sortable>
                <template #header>
                  <div class="ml-auto text-right">Appointments</div>
                </template>
                <template #body="{ data }">{{ data.appointments.toLocaleString() }}</template>
              </Column>
              <Column field="followUps" headerClass="py-6 px-4" bodyClass="py-6 px-4" :bodyStyle="{ textAlign: 'right', paddingRight: '16px' }" sortable>
                <template #header>
                  <div class="ml-auto text-right">Follow-ups</div>
                </template>
                <template #body="{ data }">{{ data.followUps.toLocaleString() }}</template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="w-1/3">
          <div class="flex items-center justify-between mb-2 px-1">
            <div class="flex items-center gap-3">
              <Avatar :image="getAvatarUrl(currentStudent.name)" shape="circle" style="width: 28px; height: 28px" :class="!optInIdentity ? 'blur-sm' : ''" />
              <div class="font-semibold" style="color: var(--p-surface-0)">{{ optInIdentity ? currentStudent.name : 'Anonymous' }}</div>
            </div>
            <a href="#" class="text-link text-sm" style="text-decoration: none;">{{ userSubscription }} Tier</a>
          </div>
          <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-0 overflow-hidden">
            <DataTable :value="studentSummary" scrollable scrollHeight="730px" :tableStyle="{ tableLayout: 'fixed' }" size="large" class="student-details-table">
              <Column field="label" header="Metric" headerClass="py-6 px-4" :headerStyle="{ paddingLeft: '16px' }" bodyClass="py-6 px-4" :bodyStyle="{ paddingLeft: '16px' }" />
              <Column headerClass="py-6" bodyClass="py-6 px-4" :bodyStyle="{ textAlign: 'right' }">
                <template #header>
                  <div class="ml-auto text-right pr-4">Value</div>
                </template>
                <template #body="{ data }">
                  <template v-if="data.label === 'Connect CRM'">
                    <a href="#" class="text-link" style="text-decoration: none;">{{ data.value }}</a>
                  </template>
                  <template v-else-if="data.label === 'Opt-In Identity' && data.value === 'Enabled'">
                    <a href="#" class="text-link" style="text-decoration: none;" @click.prevent="showSettingsDialog = true">Enabled</a>
                  </template>
                  <span v-else>{{ data.value }}</span>
                </template>
              </Column>
              <Column headerClass="py-6 px-2" bodyClass="py-6 px-2" :bodyStyle="{ textAlign: 'right', paddingRight: '16px' }">
                <template #header>
                  <div class="ml-auto text-right">Trend</div>
                </template>
                <template #body="{ data }">
                  <Chart v-if="data.label === 'Calls'" type="line" :data="sparkData(currentStudent, 'calls')" :options="sparkOptions" style="width: 120px; height: 28px" />
                  <Chart v-else-if="data.label === 'Answer Rate'" type="line" :data="sparkData(currentStudent, 'answer')" :options="sparkOptions" style="width: 120px; height: 28px" />
                  <Chart v-else-if="data.label === 'Appointments'" type="line" :data="sparkData(currentStudent, 'appointments')" :options="sparkOptions" style="width: 120px; height: 28px" />
                  <Chart v-else-if="data.label === 'Follow-ups'" type="line" :data="sparkData(currentStudent, 'followUps')" :options="sparkOptions" style="width: 120px; height: 28px" />
                  <span v-else class="text-gray-500">—</span>
                </template>
              </Column>
            </DataTable>
          </div>


          <!-- Insights -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-2 px-1">
              <div class="flex items-center gap-2">
                <i class="pi pi-bolt text-yellow-300" aria-hidden="true"></i>
                <span class="font-semibold" style="color: var(--p-surface-0)">Your Insights</span>
              </div>
              <span class="text-xs text-gray-400">Powered by Marcus AI</span>
            </div>
            <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-0 overflow-hidden">
              <Card :pt="{ root: { style: { background: 'transparent', border: 'none', borderRadius: '0' } }, body: { style: { padding: '0' } } }">
                <template #content>
                  <div class="px-4 py-3 font-thin">
                    <ul class="list-disc list-outside pl-5 space-y-[13px] text-sm text-left break-words">
                      <li v-for="(it, idx) in insights" :key="idx">{{ it }}</li>
                    </ul>
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    :visible="showSettingsDialog"
    modal
    header="Dashboard Settings"
    :breakpoints="{ '960px': '95vw' }"
    :style="{ width: '34rem' }"
    @update:visible="(v: boolean) => showSettingsDialog = v"
  >
    <div class="space-y-5">
      <!-- Privacy -->
      <div class="flex items-center justify-between">
        <div class="w-4/5">
          <div class="font-medium">Show my information</div>
          <div class="text-sm text-gray-400">When off, your name and avatar will be hidden to remain anonymous.</div>
        </div>
        <ToggleSwitch v-model="optInIdentity" class="ai-coach-toggle" />
      </div>


      <!-- Goals -->
      <div class="space-y-3">
        <div class="font-medium">Goals</div>
        <div class="text-sm text-gray-400">Set your targets to track progress on your dashboard.</div>

        <!-- Interval -->
        <div class="space-y-2">
          <label for="goal-interval" class="text-sm">Interval</label>
          <Dropdown
            inputId="goal-interval"
            v-model="goalInterval"
            :options="intervalOptions"
            optionLabel="label"
            optionValue="value"
            class="mic-like-dropdown"
            variant="filled"
            appendTo="body"
            :pt="{
              root: { style: { width: '100%', boxSizing: 'border-box', background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', padding: '5px' } },
              panel: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' } },
              overlay: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' } },
              content: { class: 'mic-dropdown-content', style: { background: 'var(--p-surface-800)', padding: '5px' } },
              list: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
              items: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
              item: { class: 'mic-dropdown-item hover:bg-white/10', style: { padding: '5px' } }
            }"
          />
        </div>

        <!-- Stacked goals -->
        <div class="space-y-3">
          <div class="space-y-2">
            <label for="goal-calls" class="text-sm">Calls</label>
            <InputNumber
              inputId="goal-calls"
              v-model="goalCalls"
              :min="0"
              :max="100000"
              :pt="{ input: { style: { background: 'var(--p-surface-900)', border: '1px solid var(--p-surface-600)', width: '100%' } } }"
            />
          </div>
          <div class="space-y-2">
            <label for="goal-appointments" class="text-sm">Set Appointments</label>
            <InputNumber
              inputId="goal-appointments"
              v-model="goalAppointments"
              :min="0"
              :max="100000"
              :pt="{ input: { style: { background: 'var(--p-surface-900)', border: '1px solid var(--p-surface-600)', width: '100%' } } }"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <Button label="Close" severity="secondary" @click="showSettingsDialog = false" />
        <Button label="Save" icon="pi pi-check" severity="primary" @click="showSettingsDialog = false" aria-label="Save settings" />
      </div>
    </template>
  </Dialog>

  <!-- Contact confirmation dialog -->
  <Dialog :visible="showContactConfirm" modal header="Coach Contact" :style="{ width: '24rem' }" @update:visible="(v: boolean) => showContactConfirm = v">
    <div class="text-sm text-gray-300">Your request has been recorded. We’ll notify your coach.</div>
    <template #footer>
      <Button label="Close" severity="secondary" @click="showContactConfirm = false" />
    </template>
  </Dialog>
</template>

<style scoped>
/* Remove separators specifically for the right student details table */
:deep(.student-details-table tbody > tr > td),
:deep(.student-details-table .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid var(--p-surface-600) !important;
  box-shadow: none !important;
}
:deep(.student-details-table tbody > tr),
:deep(.student-details-table .p-datatable-tbody > tr) {
  border-bottom: 1px solid var(--p-surface-600) !important;
  box-shadow: none !important;
}
.thin-divider{}
/* Add separators for the right student details table to match Top 20 table */
::deep(.student-details-table .p-datatable-tbody > tr > td),
::deep(.student-details-table tbody > tr > td) {
  border-bottom: 1px solid var(--p-content-border-color, rgba(255,255,255,0.12)) !important;
  box-shadow: none !important;
}
::deep(.student-details-table .p-datatable-tbody > tr:last-child > td),
::deep(.student-details-table tbody > tr:last-child > td) {
  border-bottom: 1px solid var(--p-surface-600) !important;
  box-shadow: none !important;
}
:deep(.thin-divider.p-divider-horizontal) { margin: 6px 0 !important; }
:deep(.thin-divider.p-divider-horizontal):before,
:deep(.thin-divider.p-divider-horizontal):after { height: 1px !important; background: var(--p-surface-700) !important; }

/* Hide native number input spinners if present */
:deep(.p-inputnumber input[type="number"]) { -moz-appearance: textfield; }
:deep(.p-inputnumber input::-webkit-outer-spin-button),
:deep(.p-inputnumber input::-webkit-inner-spin-button) { -webkit-appearance: none; margin: 0; }
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import ToggleSwitch from 'primevue/toggleswitch'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Chart from 'primevue/chart'
import { useCoaches } from '../composables/useCoaches'

const props = defineProps<{ coachName: string | null }>()
const emit = defineEmits<{ (e: 'back-to-app'): void }>()

const displayName = computed(() => {
  if (!props.coachName) return null
  return props.coachName
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
})
const headerTitle = computed(() => displayName.value ? `${displayName.value}'s Student Dashboard` : 'Student Dashboard')

// Header aggregate metrics
const headerStats = computed(() => {
  const calls = students.value.reduce((a, s) => a + s.callVolume, 0)
  const appointments = students.value.reduce((a, s) => a + s.appointments, 0)
  const n = Math.max(1, students.value.length)
  const avgAnswerRate = students.value.reduce((a, s) => a + s.answerRate, 0) / n * 100
  return { calls, appointments, avgAnswerRate }
})

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

// Links dropdown
const selectedLink = ref<any>(null)
const linkOptions = computed(() => [
  { label: 'Contact', value: 'contact' },
  { label: 'Set Appointment', value: 'appointment' },
  { label: 'Coaching philosophy', value: 'philosophy', disabled: !coach.value?.videoId, url: coach.value?.videoId ? `https://www.youtube.com/watch?v=${coach.value.videoId}` : undefined },
  { label: 'Website', value: 'website', disabled: !coach.value?.websiteUrl, url: coach.value?.websiteUrl },
  { label: 'Resources', value: 'resources', disabled: !coachResourcesUrl.value, url: coachResourcesUrl.value || undefined }
])
const handleLinkSelect = () => {
  const v = selectedLink.value?.value || selectedLink.value
  if (!v) return
  if (v === 'contact') contactCoach()
  else if (v === 'appointment') requestAppointment()
  else {
    const opt = linkOptions.value.find(o => o.value === v)
    if (opt && (opt as any).url) window.open((opt as any).url as string, '_blank')
  }
  selectedLink.value = null
}

const showSettingsDialog = ref(false)
const optInIdentity = ref(true)

// Goals (persist per user locally)
const goalCalls = ref<number>(Number(localStorage.getItem('student_goal_calls') || 500))
const goalAppointments = ref<number>(Number(localStorage.getItem('student_goal_appointments') || 30))

// Interval (day/week/month)
const goalInterval = ref<'day' | 'week' | 'month'>((localStorage.getItem('student_goal_interval') as 'day'|'week'|'month') || 'week')
const intervalOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
]

watch(goalCalls, v => localStorage.setItem('student_goal_calls', String(v)))
watch(goalAppointments, v => localStorage.setItem('student_goal_appointments', String(v)))
watch(goalInterval, v => localStorage.setItem('student_goal_interval', v))

const currentStudent = computed(() => students.value.find(s => s.name === 'Liam Smith') ?? students.value.find(s => s.rank === 3) ?? students.value[0] ?? { name: 'Student' } as StudentRow)

const userSubscription = computed<SubscriptionLevel>(() => currentStudent.value?.subscription ?? 'Standard')

const sortField = ref<keyof StudentRow>('callVolume')
const sortOrder = ref<number>(-1)
const onSort = (e: any) => {
  const newField = e.sortField as keyof StudentRow
  if (newField !== sortField.value) {
    sortField.value = newField
    sortOrder.value = -1 // always start highest -> lowest on new column
  } else {
    sortOrder.value = e.sortOrder as number
  }
}

const sortedStudents = computed(() => {
  const arr = [...students.value]
  const dir = sortOrder.value >= 0 ? 1 : -1
  const field = sortField.value
  const cmp = (a: any, b: any) => {
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1
    if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
    return (a as number) - (b as number)
  }
  arr.sort((s1, s2) => dir * cmp((s1 as any)[field], (s2 as any)[field]))
  return arr
})

// Always-descending order used to compute ranks regardless of visible sort direction
const descSortedStudents = computed(() => {
  const arr = [...students.value]
  const field = sortField.value
  const cmp = (a: any, b: any) => {
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1
    if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
    return (a as number) - (b as number)
  }
  // dir = -1 for descending (highest to lowest)
  arr.sort((s1, s2) => -1 * cmp((s1 as any)[field], (s2 as any)[field]))
  return arr
})

const currentRank = computed(() => {
  const idx = descSortedStudents.value.findIndex(s => s === currentStudent.value)
  return idx >= 0 ? idx + 1 : null
})

const studentSummary = computed(() => ([
  { label: 'Rank', value: currentRank.value },
  { label: 'Calls', value: `${currentStudent.value.callVolume} / ${goalCalls.value}` },
  { label: 'Answer Rate', value: `${(currentStudent.value.answerRate * 100).toFixed(1)}%` },
  { label: 'Appointments', value: `${currentStudent.value.appointments} / ${goalAppointments.value}` },
  { label: 'Follow-ups', value: currentStudent.value.followUps },
  { label: 'Opt-In Identity', value: optInIdentity.value ? 'Enabled' : 'Anonymous' },
  { label: 'Connect CRM', value: 'Not Connected' },
  { label: 'Next Session', value: 'Tomorrow 10:00 AM' },
  { label: 'Last Dial Session', value: 'Today 2:15 PM' },
]))

// Coach contact form state
const contactSubject = ref('')
const contactMessage = ref('')
const showContactConfirm = ref(false)
const coachResourcesUrl = computed<string | null>(() => {
  const url = coach.value?.websiteUrl
  if (!url) return null
  try { return new URL('/resources', url).toString() } catch { return null }
})
const contactCoach = () => { showContactConfirm.value = true }
const requestAppointment = () => { showContactConfirm.value = true }

// Marcus AI insights based on rank, call activity, and cohort
const cohortAverages = computed(() => {
  const total = students.value.reduce((acc, s) => {
    acc.calls += s.callVolume
    acc.appointments += s.appointments
    return acc
  }, { calls: 0, appointments: 0 })
  const n = Math.max(1, students.value.length)
  return {
    calls: Math.round(total.calls / n),
    apptPer100: Math.round((total.appointments / Math.max(1, total.calls)) * 1000) / 10
  }
})

const insights = computed<string[]>(() => {
  const s = currentStudent.value
  const out: string[] = []
  const callsGoal = Math.max(0, Number(goalCalls.value) || 0)
  const callsPctOfGoal = callsGoal > 0 ? Math.round((s.callVolume / callsGoal) * 100) : null
  const apptPer100 = Math.round((s.appointments / Math.max(1, s.callVolume)) * 1000) / 10

  out.push(`Rank ${s.rank}: Positioned based on recent performance across calls and appointments versus your cohort.`)

  if (callsPctOfGoal === null) {
    out.push(`Calls: ${s.callVolume} made in the current period.`)
  } else {
    out.push(`Calls: ${s.callVolume} (${callsPctOfGoal}% of your ${goalInterval.value} goal of ${callsGoal}).`)
  }

  const cohort = cohortAverages.value
  if (s.callVolume >= cohort.calls) {
    out.push(`Your call volume is above cohort average (${s.callVolume} vs ${cohort.calls}).`)
  } else {
    out.push(`Your call volume is below cohort average (${s.callVolume} vs ${cohort.calls}).`)
  }

  if (apptPer100 >= cohort.apptPer100) {
    out.push(`Appointment efficiency is strong at ${apptPer100}% per 100 calls (cohort avg ${cohort.apptPer100}%).`)
  } else {
    out.push(`Appointment efficiency is ${apptPer100}% per 100 calls (cohort avg ${cohort.apptPer100}%). Consider improving conversion.`)
  }

  out.push(`Marcus AI recommends consistent ${goalInterval.value === 'day' ? 'daily' : goalInterval.value === 'week' ? 'weekly' : 'monthly'} calling blocks to lift rank by increasing calls while maintaining quality conversations.`)
  return out
})

const sendMessage = () => {
  if (!contactMessage.value.trim()) return
  showContactConfirm.value = true
  contactSubject.value = ''
  contactMessage.value = ''
}

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
  anonymous: boolean
}

const students = ref<StudentRow[]>([
  { rank: 1,  name: 'Alex Johnson',    subscription: 'Platinum', callVolume: 420, answerRate: 0.41, appointments: 36, followUps: 18, anonymous: false },
  { rank: 2,  name: 'Maria Garcia',    subscription: 'Premium',  callVolume: 395, answerRate: 0.38, appointments: 32, followUps: 21, anonymous: true },
  { rank: 3,  name: 'Liam Smith',      subscription: 'Standard', callVolume: 360, answerRate: 0.35, appointments: 29, followUps: 17, anonymous: false },
  { rank: 4,  name: 'Sophia Lee',      subscription: 'Platinum', callVolume: 345, answerRate: 0.42, appointments: 31, followUps: 19, anonymous: false },
  { rank: 5,  name: 'Noah Williams',   subscription: 'Premium',  callVolume: 330, answerRate: 0.33, appointments: 27, followUps: 15, anonymous: false },
  { rank: 6,  name: 'Emma Davis',      subscription: 'Standard', callVolume: 315, answerRate: 0.29, appointments: 22, followUps: 14, anonymous: true },
  { rank: 7,  name: 'Olivia Martinez', subscription: 'Premium',  callVolume: 298, answerRate: 0.31, appointments: 24, followUps: 13, anonymous: false },
  { rank: 8,  name: 'William Brown',   subscription: 'Standard', callVolume: 287, answerRate: 0.27, appointments: 20, followUps: 12, anonymous: true },
  { rank: 9,  name: 'Ava Taylor',      subscription: 'Platinum', callVolume: 275, answerRate: 0.36, appointments: 23, followUps: 11, anonymous: false },
  { rank: 10, name: 'James Wilson',    subscription: 'Standard', callVolume: 260, answerRate: 0.25, appointments: 19, followUps: 10, anonymous: false },
  { rank: 11, name: 'Mia Thompson',    subscription: 'Premium',  callVolume: 255, answerRate: 0.28, appointments: 18, followUps: 9,  anonymous: false },
  { rank: 12, name: 'Benjamin Clark',  subscription: 'Standard', callVolume: 248, answerRate: 0.26, appointments: 17, followUps: 9,  anonymous: true },
  { rank: 13, name: 'Charlotte Hall',  subscription: 'Platinum', callVolume: 242, answerRate: 0.34, appointments: 21, followUps: 10, anonymous: false },
  { rank: 14, name: 'Lucas Young',     subscription: 'Premium',  callVolume: 237, answerRate: 0.29, appointments: 19, followUps: 10, anonymous: false },
  { rank: 15, name: 'Amelia King',     subscription: 'Standard', callVolume: 230, answerRate: 0.24, appointments: 16, followUps: 8,  anonymous: true },
  { rank: 16, name: 'Henry Scott',     subscription: 'Premium',  callVolume: 224, answerRate: 0.27, appointments: 17, followUps: 8,  anonymous: false },
  { rank: 17, name: 'Evelyn Green',    subscription: 'Standard', callVolume: 219, answerRate: 0.22, appointments: 14, followUps: 7,  anonymous: false },
  { rank: 18, name: 'Alexander Baker', subscription: 'Platinum', callVolume: 213, answerRate: 0.31, appointments: 18, followUps: 9,  anonymous: true },
  { rank: 19, name: 'Harper Adams',    subscription: 'Premium',  callVolume: 208, answerRate: 0.23, appointments: 15, followUps: 7,  anonymous: false },
  { rank: 20, name: 'Daniel Perez',    subscription: 'Standard', callVolume: 200, answerRate: 0.21, appointments: 13, followUps: 6,  anonymous: false }
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

// Sparkline helpers for Liam
const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return Math.abs(h)
}
const sparkOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  elements: { point: { radius: 0 }, line: { tension: 0.35 } },
  scales: { x: { display: false }, y: { display: false } }
}
const sparkData = (row: StudentRow, metric: 'calls' | 'answer' | 'appointments' | 'followUps') => {
  const seed = hash(row.name + '|' + metric)
  const n = 16
  const baseVal = (() => {
    switch (metric) {
      case 'calls': return Math.max(10, Math.round(row.callVolume / 20))
      case 'appointments': return Math.max(2, Math.round(row.appointments / 4))
      case 'followUps': return Math.max(1, Math.round(row.followUps / 3))
      case 'answer': return Math.max(20, Math.round(row.answerRate * 100))
    }
  })()
  const values: number[] = []
  let v = baseVal
  let dips = 0
  for (let i = 0; i < n; i++) {
    const upBias = 1 + ((seed + i * 7) % 3) / 20 // 0..0.1
    const jitter = (((seed + i * 13) % 9) - 4) / 100 // -0.04..0.04
    let next = v * upBias * (1 + jitter)
    if (((seed + i) % 19) === 0 && dips < 2) { // occasional small dip
      next = v * 0.95
      dips++
    }
    v = Math.max(0, next)
    values.push(Number(v.toFixed(2)))
  }
  // Normalize ranges for percent-type metric
  if (metric === 'answer') {
    for (let i = 0; i < values.length; i++) values[i] = Math.min(100, Math.max(10, values[i]))
  }
  return {
    labels: Array.from({ length: n }, (_, i) => String(i + 1)),
    datasets: [{
      data: values,
      borderColor: '#86efac',
      backgroundColor: 'rgba(134,239,172,0.15)',
      fill: true
    }]
  }
}
</script>
