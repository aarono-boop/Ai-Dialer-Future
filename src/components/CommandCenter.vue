<template>
  <div class="min-h-screen overflow-hidden bg-gray-900 text-white p-6" role="region" aria-label="Command Center">
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Header / Filters -->
      <div class="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <i class="pi pi-th-large text-blue-400" aria-hidden="true"></i>
          <h2 class="text-xl font-semibold truncate">Command Center</h2>
          <Badge :severity="summarySeverity" class="ml-2" :pt="{ root: { style: { padding: '0.125rem 0.375rem' } } }" v-tooltip.bottom="summaryTooltip">
            <i class="pi pi-dashboard" aria-hidden="true"></i>
            <span class="sr-only">{{ summaryLabel }}</span>
          </Badge>
          <span class="text-sm text-gray-400">Updated {{ lastUpdatedAbsolute }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Filter by status" class="w-48" />
          <Dropdown v-model="sortBy" :options="sortOptions" optionLabel="label" optionValue="value" placeholder="Sort by" class="w-44" />
          <Button icon="pi pi-refresh" text severity="secondary" @click="refresh" aria-label="Refresh" />
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid" :style="gridStyle">
        <Card v-for="m in filteredModules" :key="m.key" class="h-full" :pt="cardPt">
          <template #title>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <i :class="[m.icon, 'text-lg']" aria-hidden="true"></i>
                <span class="font-medium truncate">{{ m.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge :severity="statusSeverity(m.status)" :pt="getBadgePt(m.status)" v-tooltip.top="tooltipForStatus(m.status)">
                  <i :class="statusIcon(m.status)" aria-hidden="true"></i>
                  <span class="sr-only">{{ statusText(m.status) }}</span>
                </Badge>
              </div>
            </div>
          </template>
          <template #content>
            <Button link severity="secondary" size="small" class="mb-2 text-left" :label="m.statusReason" icon="pi pi-eye" :pt="{ root: { style: { padding: '0', paddingLeft: '0', color: 'var(--p-surface-200)' } } }" @click="openDetail(m)" />
            <div class="flex items-end justify-between mb-2 gap-3">
              <div v-if="firstKpi(m)" class="w-1/2 flex flex-col">
                <div class="text-xs text-gray-400 mb-1 px-2">{{ firstKpi(m)?.label }}</div>
                <div class="bg-gray-800/70 border border-gray-700 rounded-lg p-2">
                  <div class="text-base">{{ firstKpi(m)?.value }}</div>
                </div>
              </div>
              <div class="flex flex-col gap-2 shrink-0 w-1/2 items-end self-end">
                <Button class="w-full" size="small" :label="primaryCta(m.status)" :icon="primaryIcon(m.status)" severity="secondary" @click="openDetail(m)" />
              </div>
            </div>
            <div class="text-xs text-gray-400 inline-flex items-center gap-1">
              <i class="pi pi-clock" /> Last updated {{ toRelative(m.lastUpdated) }}
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Detail Drawer -->
    <Dialog v-model:visible="detailOpen" modal :style="{ width: '72rem', maxWidth: '95vw' }" :breakpoints="{ '960px': '95vw' }" :header="detailHeader">
      <div class="flex gap-4">
        <!-- Left: Tabs -->
        <div class="flex-1 min-w-0">
          <TabView>
            <TabPanel header="Overview">
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <Badge :severity="statusSeverity(selected?.status)" :pt="getBadgePt(selected?.status)" v-tooltip.top="tooltipForStatus(selected?.status)">
                    <i :class="statusIcon(selected?.status)" aria-hidden="true"></i>
                    <span class="sr-only">{{ statusText(selected?.status) }}</span>
                  </Badge>
                  <span class="text-sm text-gray-400">{{ selected?.statusReason }}</span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div v-for="k in selected?.kpis || []" :key="k.label" class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
                    <div class="text-xs text-gray-400">{{ k.label }}</div>
                    <div class="text-base">{{ k.value }}</div>
                  </div>
                </div>
                <div class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
                  <div class="text-sm font-medium mb-2">Status rationale</div>
                  <div class="text-sm text-gray-300">{{ selected?.statusReason }}</div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Recommendations">
              <div class="space-y-4">
                <div class="text-sm text-gray-300">AI proposes a plan. Review, approve, and I’ll execute. Every step is logged and reversible when possible.</div>
                <div class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
                  <div class="text-sm font-medium mb-2">Proposed actions</div>
                  <div class="flex flex-col gap-2">
                    <div v-for="(r, idx) in proposedActions" :key="idx" class="flex items-start justify-between">
                      <div class="flex items-start gap-2">
                        <Checkbox v-model="r.approved" :binary="true" :inputId="'rec-'+idx" />
                        <label :for="'rec-'+idx" class="text-sm">
                          <div class="font-medium">{{ r.title }}</div>
                          <div class="text-gray-400">Impact: {{ r.impact }} • Risk: {{ r.risk }} • Time: {{ r.time }}</div>
                        </label>
                      </div>
                      <Button text severity="secondary" icon="pi pi-eye" aria-label="View diff" @click="showDiff(r)" />
                    </div>
                  </div>
                  <div class="flex items-center justify-end gap-2 mt-3">
                    <Button label="Decline All" severity="secondary" @click="declineAll" />
                    <Button label="Approve Selected" icon="pi pi-check" @click="approveSelected" :disabled="!approvedCount" />
                  </div>
                </div>

                <div v-if="executionLog.length" class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
                  <div class="text-sm font-medium mb-2">Execution log</div>
                  <div class="flex flex-col gap-2 text-sm">
                    <div v-for="(e, i) in executionLog" :key="i" class="flex items-center justify-between">
                      <span><i class="pi pi-check-circle text-green-400 mr-2" />{{ e.message }}</span>
                      <Button text size="small" label="Undo" icon="pi pi-undo" @click="undoAction(i)" />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="History">
              <DataTable :value="history" tableStyle="min-width: 50rem">
                <Column field="ts" header="Timestamp"></Column>
                <Column field="actor" header="Actor"></Column>
                <Column field="action" header="Action"></Column>
                <Column field="details" header="Details"></Column>
              </DataTable>
            </TabPanel>
            <TabPanel header="Settings">
              <div class="space-y-3">
                <div class="text-sm text-gray-300">Editable fields with guardrails. Some changes may require admin approval.</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="(v, key) in selected?.signals || {}" :key="key" class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">{{ key }}</div>
                    <InputText v-if="isEditable(key, v)" v-model="(selected as any).signals[key]" class="w-full" />
                    <div v-else class="text-sm">{{ displaySignal(v) }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2">
                  <Button label="Save" icon="pi pi-check" @click="saveSettings" />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>

        <!-- Right: Assistant Pane -->
        <div class="w-80 shrink-0">
          <Card :pt="assistantPt">
            <template #title>
              <div class="flex items-center justify-between">
                <span>AI Assistant</span>
                <Button text severity="secondary" icon="pi pi-question-circle" @click="explain" aria-label="Explain" />
              </div>
            </template>
            <template #content>
              <div class="text-sm text-gray-300 space-y-2">
                <div v-for="(m, i) in assistantMessages" :key="i">{{ m }}</div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </Dialog>

    <!-- Diff Dialog -->
    <Dialog v-model:visible="diffOpen" modal header="Proposed change" :style="{ width: '40rem' }">
      <div class="text-sm">
        <div class="text-gray-300 mb-2">Before → After</div>
        <div class="bg-gray-800/70 border border-gray-700 rounded-lg p-3">
          <div class="text-xs text-gray-400">{{ diffData?.field }}</div>
          <div class="text-sm">{{ diffData?.before }} → <span class="text-green-400">{{ diffData?.after }}</span></div>
        </div>
      </div>
      <template #footer>
        <Button label="Close" severity="secondary" @click="diffOpen = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { seedModules, computeStatus, type ModuleState, applyActions, type Status } from '../utils/commandCenter'

const modules = ref<ModuleState[]>(seedModules())
const detailOpen = ref(false)
const selected = ref<ModuleState | null>(null)
const statusFilter = ref<'all' | Status>('all')
const sortBy = ref<'impact' | 'lastUpdated'>('impact')
const executionLog = ref<{ message: string; actions: string[] }[]>([])
const history = ref<{ ts: string; actor: string; action: string; details: string }[]>([])
const assistantMessages = ref<string[]>([
  'I’ll analyze your setup and propose safe, high‑impact steps. You approve, I execute.',
])

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Healthy (Green)', value: 'green' },
  { label: 'Needs Attention (Yellow)', value: 'yellow' },
  { label: 'Action Required (Red)', value: 'red' },
]
const sortOptions = [
  { label: 'By Impact', value: 'impact' },
  { label: 'By Last Updated', value: 'lastUpdated' },
]

const filteredModules = computed(() => {
  const list = modules.value.filter(m => statusFilter.value === 'all' ? true : m.status === statusFilter.value)
  if (sortBy.value === 'lastUpdated') {
    return list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
  }
  // impact: red > yellow > green
  const weight = (s: Status) => (s === 'red' ? 3 : s === 'yellow' ? 2 : 1)
  return list.sort((a, b) => weight(b.status) - weight(a.status))
})

const lastUpdatedAbsolute = computed(() => {
  const times = modules.value.map(m => new Date(m.lastUpdated).getTime()).filter(n => !isNaN(n))
  if (!times.length) return ''
  const latest = new Date(Math.max(...times))
  return dateTimeFmt.format(latest)
})

// Dynamic columns to limit rows and avoid vertical scroll
const targetRows = 3
const minColWidth = 260
const gridStyle = computed(() => {
  const count = (filteredModules.value.length || modules.value.length)
  const cols = Math.max(3, Math.ceil(count / targetRows))
  return { gridTemplateColumns: `repeat(${cols}, minmax(${minColWidth}px, 1fr))`, gap: '12px' }
})

const summarySeverity = computed(() => {
  const reds = modules.value.filter(m => m.status === 'red').length
  if (reds > 0) return 'danger'
  const yellows = modules.value.filter(m => m.status === 'yellow').length
  return yellows > 0 ? 'warning' : 'success'
})
const summaryLabel = computed(() => {
  const reds = modules.value.filter(m => m.status === 'red').length
  const yellows = modules.value.filter(m => m.status === 'yellow').length
  const greens = modules.value.filter(m => m.status === 'green').length
  return `${greens} Healthy • ${yellows} Needs Attention • ${reds} Action Required`
})

function statusText(s?: Status) {
  if (!s) return 'Unknown'
  return s === 'green' ? 'Healthy' : s === 'yellow' ? 'Needs Attention' : 'Action Required'
}
function statusSeverity(s?: Status) {
  if (!s) return 'secondary'
  return s === 'green' ? 'success' : s === 'yellow' ? 'warning' : 'danger'
}
function statusIcon(s?: Status) {
  if (!s) return 'pi pi-circle'
  return s === 'green' ? 'pi pi-check-circle' : s === 'yellow' ? 'pi pi-exclamation-circle' : 'pi pi-exclamation-triangle'
}
function tooltipForStatus(s?: Status) {
  if (!s) return 'Unknown status'
  return s === 'green' ? 'Healthy: Fully configured and meeting targets' : s === 'yellow' ? 'Needs Attention: Partially configured or performance degraded' : 'Action Required: Blocking issues or compliance risks'
}
const summaryTooltip = computed(() => `Summary — ${summaryLabel.value}`)
function getBadgePt(s?: Status) {
  const base = { root: { style: { padding: '0.125rem 0.375rem' } } } as any
  if (s === 'yellow') {
    base.root.style.background = 'var(--p-orange-400)'
    base.root.style.color = 'var(--p-orange-950)'
  }
  return base
}
function primaryCta(s: Status) {
  return s === 'green' ? 'Review' : s === 'yellow' ? 'Optimize' : 'Fix'
}
function primaryIcon(s: Status) {
  return s === 'green' ? 'pi pi-eye' : s === 'yellow' ? 'pi pi-cog' : 'pi pi-exclamation-triangle'
}
const firstKpi = (m: ModuleState) => (m.kpis && m.kpis.length ? m.kpis[0] : null)
const dateTimeFmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
function toRelative(ts: string) {
  const d = new Date(ts)
  return isNaN(d.getTime()) ? ts : dateTimeFmt.format(d)
}

const detailHeader = computed(() => selected.value ? selected.value.name : 'Module Details')

// Proposed actions per module
interface ProposedAction { title: string; impact: 'low' | 'medium' | 'high'; risk: 'low' | 'medium'; time: 'instant' | '5 min' | '15 min'; approved: boolean; diff?: { field: string; before: any; after: any } }
const proposedActions = ref<ProposedAction[]>([])

function generateRecommendations(m: ModuleState): ProposedAction[] {
  switch (m.key) {
    case 'armorStrategy':
      return [
        { title: 'Enable STIR/SHAKEN', impact: 'high', risk: 'low', time: '5 min', approved: true, diff: { field: 'stirShaken', before: m.signals.stirShaken, after: true } },
        { title: 'Rotate flagged numbers', impact: 'high', risk: 'low', time: '15 min', approved: true, diff: { field: 'spamLabelIncidence', before: `${Math.round((m.signals.spamLabelIncidence||0)*100)}%`, after: `${Math.max(0, Math.round(((m.signals.spamLabelIncidence||0)-0.08)*100))}%` } },
        { title: 'Improve reputation blend', impact: 'medium', risk: 'low', time: '5 min', approved: false, diff: { field: 'reputation', before: m.signals.reputation, after: Math.min(100, (m.signals.reputation||0)+15) } },
      ]
    case 'emailSetup':
      return [
        { title: 'Validate SPF', impact: 'high', risk: 'low', time: 'instant', approved: true, diff: { field: 'spf', before: m.signals.spf, after: true } },
        { title: 'Validate DKIM', impact: 'high', risk: 'low', time: 'instant', approved: true, diff: { field: 'dkim', before: m.signals.dkim, after: true } },
        { title: 'Enable DMARC (p=quarantine)', impact: 'high', risk: 'low', time: '5 min', approved: true, diff: { field: 'dmarc', before: m.signals.dmarc, after: true } },
        { title: 'Complete warmup', impact: 'medium', risk: 'low', time: '15 min', approved: false, diff: { field: 'warmupComplete', before: m.signals.warmupComplete, after: true } },
      ]
    case 'integrations':
      return [
        { title: 'Fix field mappings', impact: 'high', risk: 'low', time: '5 min', approved: true },
        { title: 'Force sync', impact: 'medium', risk: 'low', time: 'instant', approved: false },
      ]
    case 'voicemailDrops':
      return [
        { title: 'Approve template', impact: 'high', risk: 'low', time: 'instant', approved: true },
        { title: 'Document consent', impact: 'high', risk: 'low', time: 'instant', approved: true },
      ]
    case 'numberManagement':
      return [
        { title: 'Increase pool size', impact: 'medium', risk: 'low', time: '5 min', approved: true },
        { title: 'Enable local presence', impact: 'high', risk: 'low', time: 'instant', approved: true },
      ]
    case 'cadences':
      return [
        { title: 'Activate sequences', impact: 'high', risk: 'low', time: 'instant', approved: true },
        { title: 'Refresh stale sequences', impact: 'medium', risk: 'low', time: '5 min', approved: true },
      ]
    case 'callScripts':
      return [
        { title: 'Approve scripts', impact: 'high', risk: 'low', time: 'instant', approved: true },
        { title: 'Update outdated scripts', impact: 'medium', risk: 'low', time: '15 min', approved: false },
      ]
    case 'compliance':
      return [
        { title: 'Enable TCPA guardrails', impact: 'high', risk: 'low', time: 'instant', approved: true },
        { title: 'Acknowledge policy', impact: 'medium', risk: 'low', time: 'instant', approved: true },
      ]
    case 'billing':
      return [
        { title: 'Add payment method', impact: 'high', risk: 'low', time: '5 min', approved: true },
      ]
    case 'sms':
      return [
        { title: 'Register 10DLC', impact: 'high', risk: 'low', time: '15 min', approved: true },
        { title: 'Add opt-in policy', impact: 'high', risk: 'low', time: 'instant', approved: true },
      ]
    case 'businessVerification':
      return [
        { title: 'Submit documents', impact: 'high', risk: 'low', time: '5 min', approved: true },
        { title: 'Verify business', impact: 'high', risk: 'low', time: '15 min', approved: false },
      ]
    default:
      return []
  }
}

function openDetail(m: ModuleState) {
  selected.value = JSON.parse(JSON.stringify(m))
  proposedActions.value = generateRecommendations(m)
  detailOpen.value = true
  assistantMessages.value = [
    `Diagnosed current state for ${m.name}.`,
    'I generated recommended actions with expected impact. Select what you want me to do and click Approve.',
  ]
}

function refresh() {
  modules.value = modules.value.map(m => ({ ...m, lastUpdated: new Date().toISOString() }))
}

const approvedCount = computed(() => proposedActions.value.filter(a => a.approved).length)

function approveSelected() {
  if (!selected.value) return
  const actions = proposedActions.value.filter(a => a.approved).map(a => a.title)
  const beforeSignals = { ...selected.value.signals }
  const newSignals = applyActions(selected.value.key, beforeSignals, actions)
  const { status, reason } = computeStatus(selected.value.key, newSignals)
  selected.value.signals = newSignals
  selected.value.status = status
  selected.value.statusReason = reason
  selected.value.lastUpdated = new Date().toISOString()
  executionLog.value.push({ message: `Executed ${actions.length} action(s). Status: ${statusText(status)}.`, actions })
  history.value.push({ ts: new Date().toISOString(), actor: 'AI (with user approval)', action: 'Execute', details: `${actions.join(', ')}` })
  // Persist back into modules list
  modules.value = modules.value.map(m => m.key === selected.value!.key ? selected.value! : m)
  assistantMessages.value.push('Done. I verified results and updated your status. Want to take the next step?')
}

function declineAll() {
  proposedActions.value.forEach(a => a.approved = false)
}

function showDiff(r: ProposedAction) {
  if (!selected.value) return
  if (!r.diff) {
    diffData.value = { field: r.title, before: '—', after: '—' }
  } else {
    diffData.value = r.diff
  }
  diffOpen.value = true
}

function undoAction(i: number) {
  const log = executionLog.value[i]
  if (!selected.value || !log) return
  // Recompute signals by removing these actions
  const original = seedModules().find(m => m.key === selected.value!.key)
  if (!original) return
  const keptActions = executionLog.value
    .filter((_, idx) => idx !== i)
    .flatMap(l => l.actions)
  const newSignals = applyActions(selected.value.key, original.signals, keptActions)
  const { status, reason } = computeStatus(selected.value.key, newSignals)
  selected.value.signals = newSignals
  selected.value.status = status
  selected.value.statusReason = reason
  modules.value = modules.value.map(m => m.key === selected.value!.key ? selected.value! : m)
  executionLog.value.splice(i, 1)
  history.value.push({ ts: new Date().toISOString(), actor: 'User', action: 'Undo', details: log.actions.join(', ') })
}

function explain() {
  if (!selected.value) return
  assistantMessages.value.push(`Changing these settings is expected to move ${selected.value.name} to ${statusText(selected.value.status)}. All changes are logged and reversible when possible.`)
}

function isEditable(key: string, v: any) {
  // Basic guardrails: booleans and numbers editable, complex objects read-only
  return typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string'
}
function displaySignal(v: any) {
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return String(v)
}
function saveSettings() {
  if (!selected.value) return
  const { status, reason } = computeStatus(selected.value.key, selected.value.signals)
  selected.value.status = status
  selected.value.statusReason = reason
  selected.value.lastUpdated = new Date().toISOString()
  modules.value = modules.value.map(m => m.key === selected.value!.key ? selected.value! : m)
  history.value.push({ ts: new Date().toISOString(), actor: 'User', action: 'Settings saved', details: selected.value.key })
}

const diffOpen = ref(false)
const diffData = ref<{ field: string; before: any; after: any } | null>(null)

const cardPt = {
  root: { style: { background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', borderRadius: '12px', padding: '10px 20px' } },
}
const assistantPt = {
  root: { style: { background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', borderRadius: '12px' } },
}
</script>
