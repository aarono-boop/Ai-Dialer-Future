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

      <!-- Two-Column Layout: 2/3 Students table, 1/3 Student area -->
      <div class="flex gap-4">
        <div class="w-2/3">
          <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <DataTable :value="students" scrollable scrollHeight="730px" :tableStyle="{ tableLayout: 'fixed' }" size="large" :pt="{ root: { style: { borderRadius: '12px', overflow: 'hidden' } }, header: { style: { border: 'none', borderBottom: 'none', background: 'var(--p-surface-800)', padding: '10px 16px' } }, headerRow: { class: 'h-12', style: { background: 'var(--p-surface-800)' } }, headerCell: { style: { border: 'none', background: 'var(--p-surface-800)', padding: '12px 16px' } }, bodyRow: { class: 'h-14' }, bodyCell: { style: { padding: '12px 16px' } } }">
              <template #header>
                <div class="flex items-center justify-between">
                  <span class="font-semibold" style="color: var(--p-surface-0)">Top 20 Students</span>
                </div>
              </template>
              <Column field="rank" header="#" style="width: 60px" headerClass="py-6 px-4" :headerStyle="{ paddingLeft: '16px' }" bodyClass="py-6 px-4" :bodyStyle="{ paddingLeft: '16px' }" />
              <Column header="Avatar" headerClass="py-6 px-4" bodyClass="py-6 px-4">
                <template #body="{ data }">
                  <Avatar :image="getAvatarUrl(data.name)" shape="circle" style="width: 32px; height: 32px" :class="data.anonymous ? 'blur-sm' : ''" />
                </template>
              </Column>
              <Column header="Student Name" headerClass="py-6 px-4" bodyClass="py-6 px-4">
                <template #body="{ data }">
                  <span :class="data.anonymous ? 'blur-sm select-none' : ''">{{ data.name }}</span>
                </template>
              </Column>
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
              <Column field="followUps" headerClass="py-6 px-4" bodyClass="py-6 px-4" :bodyStyle="{ textAlign: 'right', paddingRight: '16px' }">
                <template #header>
                  <div class="ml-auto text-right pr-4">Follow-ups</div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="w-1/3">
          <div class="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <DataTable :value="studentSummary" scrollable scrollHeight="730px" :tableStyle="{ tableLayout: 'fixed' }" size="large" :pt="{ root: { style: { borderRadius: '12px', overflow: 'hidden' } }, header: { style: { border: 'none', borderBottom: 'none', background: 'var(--p-surface-800)', padding: '10px 16px' } }, headerRow: { class: 'h-12', style: { background: 'var(--p-surface-800)' } }, headerCell: { style: { border: 'none', background: 'var(--p-surface-800)', padding: '12px 16px' } }, bodyRow: { class: 'h-14' }, bodyCell: { style: { padding: '12px 16px', borderBottom: 'none' } } }">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Avatar :image="getAvatarUrl(currentStudent.name)" shape="circle" style="width: 28px; height: 28px" :class="!optInIdentity ? 'blur-sm' : ''" />
                    <div class="font-semibold" style="color: var(--p-surface-0)">{{ optInIdentity ? currentStudent.name : 'Anonymous' }}</div>
                  </div>
                  <span class="text-sm" style="color: var(--p-surface-300)">My Summary</span>
                </div>
              </template>
              <Column field="label" header="Metric" headerClass="py-6 px-4" :headerStyle="{ paddingLeft: '16px' }" bodyClass="py-6 px-4" :bodyStyle="{ paddingLeft: '16px' }" />
              <Column headerClass="py-6" bodyClass="py-6 px-4" :bodyStyle="{ textAlign: 'right', paddingRight: '16px' }">
                <template #header>
                  <div class="ml-auto text-right pr-4">Value</div>
                </template>
                <template #body="{ data }">{{ data.value }}</template>
              </Column>
            </DataTable>
          </div>

          <!-- Contact Coach Area -->
          <div class="mt-4">
            <Card :pt="{ root: { style: { background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', borderRadius: '12px' } }, body: { style: { padding: '16px' } } }">
              <template #title>
                <div class="flex items-center gap-2">
                  <img v-if="coach?.avatarUrl" :src="coach.avatarUrl" :alt="coach.displayName" class="w-6 h-6 rounded-full object-cover" />
                  <div v-else class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {{ coachInitials }}
                  </div>
                  <span>Contact Your Coach</span>
                </div>
              </template>
              <template #content>
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-sm text-gray-300">Subject</label>
                    <InputText v-model="contactSubject" class="w-full" :pt="{ root: { style: { background: 'var(--p-surface-900)', border: '1px solid var(--p-surface-600)' } } }" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm text-gray-300">Message</label>
                    <Textarea v-model="contactMessage" rows="4" autoResize class="w-full" :pt="{ root: { style: { background: 'var(--p-surface-900)', border: '1px solid var(--p-surface-600)' } } }" />
                  </div>
                  <div class="flex items-center justify-end gap-2 pt-1">
                    <Button icon="pi pi-calendar" label="Request Appointment" severity="secondary" size="small" @click="requestAppointment" />
                    <Button icon="pi pi-send" label="Send" :disabled="!contactMessage?.trim()" size="small" @click="sendMessage" />
                  </div>
                </div>
              </template>
            </Card>
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
    :style="{ width: '28rem' }"
    @update:visible="(v: boolean) => showSettingsDialog = v"
  >
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="w-4/5">
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

  <!-- Contact confirmation dialog -->
  <Dialog :visible="showContactConfirm" modal header="Coach Contact" :style="{ width: '24rem' }" @update:visible="(v: boolean) => showContactConfirm = v">
    <div class="text-sm text-gray-300">Your request has been recorded. We’ll notify your coach.</div>
    <template #footer>
      <Button label="Close" severity="secondary" @click="showContactConfirm = false" />
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
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
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

const currentStudent = computed(() => students.value[0] ?? { name: 'Student' } as StudentRow)

const studentSummary = computed(() => ([
  { label: 'Subscription', value: 'Premium' },
  { label: 'Calls', value: 284 },
  { label: 'Answer Rate', value: '32.5%' },
  { label: 'Appointments', value: 21 },
  { label: 'Follow-ups', value: 12 },
  { label: 'Opt-In Identity', value: optInIdentity.value ? 'Enabled' : 'Anonymous' },
  { label: 'Connect CRM', value: 'Not Connected' },
  { label: 'Next Session', value: 'Tomorrow 10:00 AM' },
  { label: 'Last Dial Session', value: 'Today 2:15 PM' },
  { label: 'Call Goal', value: '300 / 500' }
]))

// Coach contact form state
const contactSubject = ref('')
const contactMessage = ref('')
const showContactConfirm = ref(false)

const sendMessage = () => {
  if (!contactMessage.value.trim()) return
  showContactConfirm.value = true
  contactSubject.value = ''
  contactMessage.value = ''
}
const requestAppointment = () => {
  showContactConfirm.value = true
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

</script>
