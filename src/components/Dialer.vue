<template>
  <div class="w-full h-full bg-gray-900 rounded-r-lg border border-gray-700 flex flex-col pt-4 pb-[10px] px-3">
    <!-- Call Status & Controls Card -->
    <div class="mx-[5px] mb-4 bg-gray-800 border border-gray-600 rounded-lg p-[14px]">
      <!-- Call Status -->
      <!-- Call Ended State -->
      <div v-if="callState === 'ended'" class="bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-center">
        <div class="text-red-400 font-medium">Call Ended</div>
        <div class="text-gray-300 text-sm">(312) 586-9748</div>
      </div>

      <!-- Ringing State -->
      <div v-else-if="callState === 'ringing'" class="bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="text-green-400 font-medium">Calling</div>
          <div class="flex items-center">
            <div class="animate-pulse w-2 h-2 bg-green-400 rounded-full mx-1"></div>
            <div class="animate-pulse w-2 h-2 bg-green-400 rounded-full mx-1" style="animation-delay: 0.2s"></div>
            <div class="animate-pulse w-2 h-2 bg-green-400 rounded-full mx-1" style="animation-delay: 0.4s"></div>
          </div>
        </div>
        <div class="text-gray-300 text-sm">{{ currentContact.phone }}</div>
      </div>

      <!-- Connected State -->
      <div v-else-if="callState === 'connected'" class="bg-green-900/50 border border-green-400 rounded-lg p-3 text-center animate-pulse" style="border-width: 1px;">
        <div class="text-green-400 font-medium">Live Call: <span class="font-mono">{{ formatTime(callDuration) }}</span></div>
        <div class="text-gray-300 text-sm">{{ currentContact.phone }}</div>
      </div>

      <!-- Idle State (initial state before any calls) -->
      <div v-else-if="callState === 'idle'" class="bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-center">
        <div class="text-gray-400 font-medium">Ready to Dial</div>
        <div class="text-gray-300 text-sm">{{ currentContact.phone }}</div>
      </div>

      <!-- Header -->
      <div class="mt-[17px]">
        <div class="bg-gray-700 rounded-full h-5 w-full relative flex items-center">
          <div
            class="h-5 rounded-full transition-all duration-300"
            :style="{ width: `${((currentContactIndex + 1) / 3) * 100}%`, background: 'linear-gradient(to right, #60a5fa, #7b68ee)' }"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
            Dial Queue {{ currentContactIndex + 1 }} of 3
          </div>
        </div>
      </div>

      <!-- AI Coach Controls -->
      <div class="mt-3">
        <div class="flex items-center justify-between" style="min-height: 32px; box-sizing: border-box;">
          <div class="flex items-center gap-2" style="flex-shrink: 0;">
            <!-- Dynamic Coach Avatar and Name -->
            <div v-if="currentCoach" class="flex items-center gap-2">
              <img
                v-if="currentCoach.avatarUrl"
                :src="currentCoach.avatarUrl"
                :alt="currentCoach.displayName"
                class="w-6 h-6 rounded-full object-cover"
              />
              <div
                v-else
                class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
              >
                {{ getCoachInitials(currentCoach.displayName) }}
              </div>
              <span
                class="text-gray-300 text-sm cursor-pointer select-none"
                @click="toggleAICoach(!props.aiCoachEnabled)"
              >{{ currentCoach.displayName }}'s AI Coach</span>
            </div>
            <!-- Default AI Coach when no coach parameter -->
            <span
              v-else
              class="text-gray-300 text-sm cursor-pointer select-none"
              @click="toggleAICoach(!props.aiCoachEnabled)"
            >AI Coach</span>
            <ToggleSwitch
              :model-value="props.aiCoachEnabled"
              @update:model-value="toggleAICoach"
              class="ai-coach-toggle"
            />
          </div>
          <div class="text-gray-400 text-sm text-center w-[160px] flex-shrink-0">
            Queue Time: <span class="text-white font-mono tabular-nums">{{ formatTime(queueTime) }}</span>
          </div>
          <Button
            v-if="!shouldCompleteQueue"
            @click="pauseQueue"
            :disabled="callState === 'connected'"
            tabindex="8"
            severity="secondary"
            size="small"
            class="pause-queue-compact"
          >
            <span class="text-xs">Pause Queue</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="flex-1 mx-[5px] mb-4 bg-gray-800 border border-gray-600 rounded-lg p-[14px] overflow-y-auto">
      <div class="space-y-4">
        <!-- Contact Header -->
        <div>
          <h3 class="text-white text-lg font-bold ml-[17px]">{{ currentContact.name }}</h3>
          <p class="text-white text-sm ml-[17px]">{{ currentContact.title }} at {{ currentContact.company }}</p>
        </div>

        <TabView :pt="{ inkbar: { style: { display: 'none' } } }">
          <TabPanel value="details">
            <template #header>
              <span class="flex items-center gap-2 text-xs"><i class="pi pi-id-card"></i><span>Details</span></span>
            </template>
            <div class="text-sm">
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Phone:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.phone }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Connect Score:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.connectScore }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Email:</td>
                    <td style="padding: 4px 0; color: white;"><a :href="`mailto:${currentContact.email}`" class="underline" aria-label="Send email">{{ currentContact.email }}</a></td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Address:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.address }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Local Time:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.localTime }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Website:</td>
                    <td style="padding: 4px 0; color: white;"><a :href="normalizeHref(currentContact.website)" target="_blank" rel="noopener noreferrer" class="underline" aria-label="Visit website">{{ displayUrl(currentContact.website) }}</a></td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">LinkedIn:</td>
                    <td style="padding: 4px 0; color: white;"><a :href="normalizeHref(currentContact.linkedin)" target="_blank" rel="noopener noreferrer" class="underline" aria-label="View LinkedIn profile">{{ displayUrl(currentContact.linkedin) }}</a></td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Industry:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.industry }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Company Size:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.companySize }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Lead Source:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.leadSource }}</td>
                  </tr>
                  <tr v-if="currentContact.sourceUrl">
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af; white-space: nowrap;">Data Source:</td>
                    <td style="padding: 4px 0; color: white;">
                      <a
                        :href="currentContact.sourceUrl && currentContact.sourceUrl.startsWith('http') ? currentContact.sourceUrl : `https://${currentContact.sourceUrl}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline"
                        :aria-label="currentContact.sourceType === 'crm' ? 'Open CRM record' : 'Open source spreadsheet'"
                      >
                        {{ currentContact.sourceName || (currentContact.sourceType === 'crm' ? 'CRM Record' : 'Spreadsheet') }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel value="notes">
            <template #header>
              <span class="flex items-center gap-2 text-xs"><i class="pi pi-pencil"></i><span>Notes</span></span>
            </template>
            <div class="space-y-4 text-sm" style="color: var(--p-surface-0);">
              <!-- Create Note -->
              <div class="space-y-1">
                <Textarea
                  v-model="newNote"
                  :autoResize="false"
                  rows="2"
                  placeholder="Type a note..."
                  class="w-full"
                  :pt="{ root: { style: { background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', color: 'var(--p-surface-0)', padding: '10px', fontSize: '.75rem', borderRadius: 'var(--p-border-radius-sm)' } } }"
                  style="overflow: auto;"
                />
                <div class="flex justify-end">
                  <Button
                    :disabled="!newNote.trim()"
                    size="small"
                    icon="pi pi-plus"
                    label="Add note"
                    severity="secondary"
                    class="pause-queue-compact"
                    @click="addNote"
                  />
                </div>
              </div>
              <!-- Notes List -->
              <div v-for="(n, i) in notesList" :key="i" class="flex items-start gap-2">
                <i class="pi pi-clock mt-1" style="color: var(--p-blue-400);"></i>
                <div>
                  <div class="text-xs" style="color: var(--p-surface-300);">{{ n.date }}</div>
                  <div style="white-space: pre-wrap;">{{ n.text }}</div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="activity">
            <template #header>
              <span class="flex items-center gap-2 text-xs"><i class="pi pi-history"></i><span>Activity</span></span>
            </template>
            <div class="space-y-3 text-sm" style="color: var(--p-surface-0);">
              <div v-for="(a, i) in activities" :key="i" class="flex items-start gap-2">
                <i :class="['pi', a.icon, 'mt-1']" style="color: var(--p-blue-400);"></i>
                <div>
                  <div class="text-xs" style="color: var(--p-surface-300);">{{ a.date }} · {{ a.type }}</div>
                  <div style="white-space: pre-wrap;">{{ a.text }}</div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mx-[5px] mb-2 bg-gray-800 border border-gray-600 rounded-lg pt-[14px] px-[14px] pb-[4px]">
      <!-- Call Controls (visible when not ended) -->
      <div v-if="callState !== 'ended'" class="space-y-3">
        <!-- Call Control Buttons -->
        <div class="grid grid-cols-3 gap-3">
          <Button
            ref="muteButtonRef"
            @click="toggleMute"
            @keydown="handleMuteKeydown"
            tabindex="9"
            :disabled="callState === 'idle'"
            :severity="isMuted ? 'warn' : 'secondary'"
            class="flex flex-row items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-microphone"></i>
            <span class="text-xs">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
          </Button>

          <Button
            ref="keypadButtonRef"
            @click="showKeypad"
            tabindex="10"
            :disabled="callState === 'idle'"
            severity="secondary"
            class="flex flex-row items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-calculator"></i>
            <span class="text-xs">Keypad</span>
          </Button>

          <Button
            ref="holdButtonRef"
            @click="toggleHold"
            @keydown="handleHoldKeydown"
            tabindex="11"
            :disabled="callState === 'idle'"
            :severity="isOnHold ? 'warn' : 'secondary'"
            class="flex flex-row items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-pause"></i>
            <span class="text-xs">{{ isOnHold ? 'Resume' : 'Hold' }}</span>
          </Button>
        </div>

        <!-- Hang Up Button -->
        <Button
          @click="hangUp"
          @keydown.tab="handleHangUpTab"
          tabindex="12"
          :disabled="callState === 'idle'"
          severity="danger"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i class="pi pi-phone" style="transform: rotate(135deg);"></i>
          Hang Up
        </Button>
      </div>

      <!-- Call Ended Action Buttons (only when call ended) -->
      <div v-if="callState === 'ended'" class="space-y-3">
        <Button
          @click="callBack"
          tabindex="13"
          severity="secondary"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i class="pi pi-phone"></i>
          Call {{ currentContact.name }} Back
        </Button>

        <Button
          @click="shouldCompleteQueue ? completeQueue() : nextContact()"
          @keydown.tab="handleNextContactTab"
          tabindex="14"
          :disabled="shouldCompleteQueue ? !dispositionSet : (callState === 'ended' && !dispositionSet)"
          :severity="shouldCompleteQueue ? (dispositionSet ? 'primary' : 'secondary') : dispositionSet ? 'primary' : 'secondary'"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i :class="shouldCompleteQueue ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
          {{ shouldCompleteQueue ? 'Queue Completed' : `Next: ${nextContactName}` }}
        </Button>
      </div>
    </div>

    <!-- Keypad Modal -->
    <div v-if="showKeypadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeKeypad" @keydown="handleKeypadKeydown" tabindex="-1">
      <div class="bg-gray-800 rounded-lg w-80 mx-4 my-8 overflow-hidden" @click.stop style="padding: 24px; min-height: 400px;">
        <!-- Modal Header -->
        <div class="flex justify-between items-center" style="margin-bottom: 24px;">
          <h3 class="text-white text-lg font-semibold">Keypad</h3>
          <Button @click="closeKeypad" @keydown.tab="handleCloseButtonTab" tabindex="113" severity="secondary" outlined size="small">
            <i class="pi pi-times text-xl"></i>
          </Button>
        </div>

        <!-- Keypad Grid -->
        <div class="grid grid-cols-3 gap-3" style="padding-bottom: 24px;">
          <!-- Row 1: 1, 2, 3 -->
          <button @click="pressKeyWithFeedback('1', $event)" @keydown="handleKeypadButtonKeydown('1', $event)" data-keypad-key="1" tabindex="101" class="keypad-btn">
            <span class="text-2xl font-bold">1</span>
          </button>
          <button @click="pressKeyWithFeedback('2', $event)" @keydown="handleKeypadButtonKeydown('2', $event)" data-keypad-key="2" tabindex="102" class="keypad-btn">
            <span class="text-2xl font-bold">2</span>
            <span class="text-xs text-gray-400">ABC</span>
          </button>
          <button @click="pressKeyWithFeedback('3', $event)" @keydown="handleKeypadButtonKeydown('3', $event)" data-keypad-key="3" tabindex="103" class="keypad-btn">
            <span class="text-2xl font-bold">3</span>
            <span class="text-xs text-gray-400">DEF</span>
          </button>

          <!-- Row 2: 4, 5, 6 -->
          <button @click="pressKeyWithFeedback('4', $event)" @keydown="handleKeypadButtonKeydown('4', $event)" data-keypad-key="4" tabindex="104" class="keypad-btn">
            <span class="text-2xl font-bold">4</span>
            <span class="text-xs text-gray-400">GHI</span>
          </button>
          <button @click="pressKeyWithFeedback('5', $event)" @keydown="handleKeypadButtonKeydown('5', $event)" data-keypad-key="5" tabindex="105" class="keypad-btn">
            <span class="text-2xl font-bold">5</span>
            <span class="text-xs text-gray-400">JKL</span>
          </button>
          <button @click="pressKeyWithFeedback('6', $event)" @keydown="handleKeypadButtonKeydown('6', $event)" data-keypad-key="6" tabindex="106" class="keypad-btn">
            <span class="text-2xl font-bold">6</span>
            <span class="text-xs text-gray-400">MNO</span>
          </button>

          <!-- Row 3: 7, 8, 9 -->
          <button @click="pressKeyWithFeedback('7', $event)" @keydown="handleKeypadButtonKeydown('7', $event)" data-keypad-key="7" tabindex="107" class="keypad-btn">
            <span class="text-2xl font-bold">7</span>
            <span class="text-xs text-gray-400">PQRS</span>
          </button>
          <button @click="pressKeyWithFeedback('8', $event)" @keydown="handleKeypadButtonKeydown('8', $event)" data-keypad-key="8" tabindex="108" class="keypad-btn">
            <span class="text-2xl font-bold">8</span>
            <span class="text-xs text-gray-400">TUV</span>
          </button>
          <button @click="pressKeyWithFeedback('9', $event)" @keydown="handleKeypadButtonKeydown('9', $event)" data-keypad-key="9" tabindex="109" class="keypad-btn">
            <span class="text-2xl font-bold">9</span>
            <span class="text-xs text-gray-400">WXYZ</span>
          </button>

          <!-- Row 4: *, 0, # -->
          <button @click="pressKeyWithFeedback('*', $event)" @keydown="handleKeypadButtonKeydown('*', $event)" data-keypad-key="*" tabindex="110" class="keypad-btn">
            <span class="text-2xl font-bold">*</span>
          </button>
          <button @click="pressKeyWithFeedback('0', $event)" @keydown="handleKeypadButtonKeydown('0', $event)" data-keypad-key="0" tabindex="111" class="keypad-btn">
            <span class="text-2xl font-bold">0</span>
            <span class="text-xs text-gray-400">+</span>
          </button>
          <button @click="pressKeyWithFeedback('#', $event)" @keydown="handleKeypadButtonKeydown('#', $event)" @keydown.tab="handleHashTab" data-keypad-key="#" tabindex="112" class="keypad-btn">
            <span class="text-2xl font-bold">#</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Textarea from 'primevue/textarea'
import { useCoaches } from '../composables/useCoaches'

// Connect Score tooltip content
const connectScoreTooltip = `Connect Score is a premium add-on feature that uses real-world signals to help users prioritize high-value contacts and skip low-quality leads. It scores each phone number as High, Medium, or Low based on:

• Carrier data
• Engagement history
�� Phone metadata

This lets teams focus their efforts on numbers with the greatest chance of a live answer���improving connect rates, morale, and performance.`

// Define props
const props = defineProps<{
  callState: string
  callDuration: number
  queueTime: number
  currentContact: {
    name: string
    title: string
    company: string
    phone: string
    connectScore: string
    email: string
    address: string
    localTime: string
    website: string
    linkedin: string
    industry: string
    companySize: string
    leadSource: string
    notes: string
    sourceUrl?: string
    sourceType?: string
    sourceName?: string
  }
  nextContactName: string
  shouldCompleteQueue: boolean
  isLastContact: boolean
  dispositionSet: boolean
  queueCompletionReady: boolean
  currentContactIndex: number
  totalContacts: number
  coachParameter: string
  aiCoachEnabled: boolean
}>()

// Define emits
const emit = defineEmits(['call-back', 'next-contact', 'hang-up', 'mute', 'hold', 'keypad', 'keypad-press', 'pause-queue', 'complete-queue', 'ai-coach-toggle'])

// Reactive data
const isMuted = ref(false)
const isOnHold = ref(false)
const showKeypadModal = ref(false)

// Template refs for PrimeVue buttons
const muteButtonRef = ref<any>(null)
const holdButtonRef = ref<any>(null)
const keypadButtonRef = ref<any>(null)

// Coach system integration
const { currentCoach } = useCoaches()

// Notes for contact (sample history if none present)
const notesList = ref<{ date: string; text: string }[]>([])
const newNote = ref('')

const formatDateTime = (d = new Date()): string => {
  const f = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  })
  return f.format(d)
}

const initNotes = () => {
  notesList.value = []
  if (props.currentContact && props.currentContact.notes) {
    notesList.value.push({ date: `Today ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` , text: props.currentContact.notes })
  } else {
    notesList.value = [
      { date: 'Mar 4, 2025 3:42 PM', text: 'Call answered. Spoke with Sam; interested in a quick demo next week. Sent follow-up email with calendar link.' },
      { date: 'Feb 26, 2025 11:08 AM', text: 'Left voicemail #2. Mentioned recent product updates and invited to book time.' },
      { date: 'Feb 19, 2025 9:31 AM', text: 'Left voicemail #1. Number rang 5 times; no pickup.' }
    ]
  }
}

onMounted(initNotes)

const addNote = () => {
  const text = newNote.value.trim()
  if (!text) return
  notesList.value.unshift({ date: formatDateTime(new Date()), text })
  newNote.value = ''
}

// URL helpers: keep href intact but simplify visible text
const normalizeHref = (url?: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://${url}`
}
const displayUrl = (url?: string) => {
  if (!url) return ''
  return url.replace(/^https?:\/\/(www\.)?/i, '')
}

// Activity timeline (sample data)
const activities = computed(() => {
  return [
    { date: 'Mar 6, 2025 9:04 AM', type: 'Call Connected', icon: 'pi-phone', text: 'Spoke 6m 12s. Qualified interest; scheduled demo for Tue 10:00 AM.' },
    { date: 'Mar 5, 2025 3:18 PM', type: 'Email Sent', icon: 'pi-envelope', text: 'Intro email sent with case study and calendar link.' },
    { date: 'Mar 5, 2025 3:12 PM', type: 'Voicemail', icon: 'pi-volume-up', text: 'No answer; left voicemail with callback number.' },
    { date: 'Mar 4, 2025 11:45 AM', type: 'Call Attempt', icon: 'pi-phone', text: 'Rang 5 times; no pickup.' }
  ]
})

// Helper method for coach initials
const getCoachInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Methods
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getConnectScoreColor = (score: string): string => {
  switch (score.toLowerCase()) {
    case 'high': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

const getConnectScoreColorRgb = (score: string): string => {
  switch (score.toLowerCase()) {
    case 'high': return 'rgb(74, 222, 128)'
    case 'medium': return 'rgb(250, 204, 21)'
    case 'low': return 'rgb(248, 113, 113)'
    default: return 'rgb(156, 163, 175)'
  }
}

const callBack = () => {
  emit('call-back')
}

const nextContact = () => {
  emit('next-contact')
}

const hangUp = () => {
  emit('hang-up')
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  emit('mute', isMuted.value)

  // Maintain focus using template ref with multiple fallbacks
  nextTick(() => {
    setTimeout(() => {
      if (muteButtonRef.value) {
        // PrimeVue Button component - access DOM element
        const buttonElement = muteButtonRef.value.$el || muteButtonRef.value
        if (buttonElement && buttonElement.focus) {
          buttonElement.focus()
        } else {
          // Fallback: focus by tabindex
          const muteBtn = document.querySelector('[tabindex="9"]') as HTMLElement
          if (muteBtn) muteBtn.focus()
        }
      }
    }, 100)
  })
}

const toggleHold = () => {
  isOnHold.value = !isOnHold.value
  emit('hold', isOnHold.value)

  // Maintain focus using template ref with multiple fallbacks
  nextTick(() => {
    setTimeout(() => {
      if (holdButtonRef.value) {
        // PrimeVue Button component - access DOM element
        const buttonElement = holdButtonRef.value.$el || holdButtonRef.value
        if (buttonElement && buttonElement.focus) {
          buttonElement.focus()
        } else {
          // Fallback: focus by tabindex
          const holdBtn = document.querySelector('[tabindex="11"]') as HTMLElement
          if (holdBtn) holdBtn.focus()
        }
      }
    }, 100)
  })
}

const showKeypad = () => {
  showKeypadModal.value = true

  // Focus the modal container to enable keyboard events, then focus first button
  nextTick(() => {
    const modalContainer = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50') as HTMLElement
    if (modalContainer) {
      modalContainer.focus()
    }

    setTimeout(() => {
      const firstKeypadButton = document.querySelector('[tabindex="101"]') as HTMLElement
      if (firstKeypadButton) {
        firstKeypadButton.focus()
      }
    }, 50)
  })
}

const closeKeypad = () => {
  showKeypadModal.value = false

  // Return focus to the keypad button in the dialer
  nextTick(() => {
    if (keypadButtonRef.value) {
      // PrimeVue Button component - access DOM element
      const buttonElement = keypadButtonRef.value.$el || keypadButtonRef.value
      if (buttonElement && buttonElement.focus) {
        buttonElement.focus()
      } else {
        // Fallback: focus by tabindex
        const keypadBtn = document.querySelector('[tabindex="10"]') as HTMLElement
        if (keypadBtn) keypadBtn.focus()
      }
    }
  })
}

const pressKey = (key: string) => {
  // Emit the key press for DTMF tone generation or other functionality
  emit('keypad-press', key)
}

const pressKeyWithFeedback = (key: string, event: Event) => {
  // Trigger the key press
  pressKey(key)

  // Add visual feedback
  const button = event.target as HTMLElement
  if (button) {
    addVisualFeedback(button)
  }
}

const handleKeypadButtonKeydown = (key: string, event: KeyboardEvent) => {
  // Handle Enter and Space key presses on keypad buttons
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    // Trigger the key press
    pressKey(key)

    // Add the same visual feedback as direct keyboard input
    const button = event.target as HTMLElement
    if (button) {
      addVisualFeedback(button)
    }
  }
  // Let other keys (like Tab) work normally
}

const addVisualFeedback = (button: HTMLElement) => {
  // Add visual feedback animation
  button.style.transform = 'scale(0.95)'
  button.style.backgroundColor = 'rgb(75, 85, 99)' // gray-600

  setTimeout(() => {
    button.style.transform = ''
    button.style.backgroundColor = ''
  }, 150)
}

const handleHashTab = (event: KeyboardEvent) => {
  // From # button (tabindex 112), go to close button (tabindex 113)
  if (!event.shiftKey) {
    event.preventDefault()
    const closeButton = document.querySelector('[tabindex="113"]') as HTMLElement
    if (closeButton) {
      closeButton.focus()
    }
  }
}

const handleCloseButtonTab = (event: KeyboardEvent) => {
  // From close button (tabindex 113), cycle back to 1 button (tabindex 101)
  if (!event.shiftKey) {
    event.preventDefault()
    const firstButton = document.querySelector('[tabindex="101"]') as HTMLElement
    if (firstButton) {
      firstButton.focus()
    }
  }
}

const handleKeypadKeydown = (event: KeyboardEvent) => {
  // Handle keyboard input for keypad
  const key = event.key

  // Map keyboard keys to keypad keys
  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

  if (validKeys.includes(key)) {
    event.preventDefault()

    // Trigger the key press
    pressKey(key)

    // Visual feedback: briefly highlight the corresponding button
    const button = document.querySelector(`[data-keypad-key="${key}"]`) as HTMLElement
    if (button) {
      button.focus()
      addVisualFeedback(button)
    }
  }

  // Handle arrow key navigation
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    event.preventDefault()
    handleArrowNavigation(key)
  }

  // Handle Escape key to close keypad
  if (key === 'Escape') {
    event.preventDefault()
    closeKeypad()
  }
}

const handleArrowNavigation = (direction: string) => {
  // Get currently focused element
  const focused = document.activeElement as HTMLElement
  const currentKey = focused?.getAttribute('data-keypad-key')

  // If not focused on a keypad button, focus on center button (5)
  if (!currentKey) {
    const centerButton = document.querySelector('[data-keypad-key="5"]') as HTMLElement
    if (centerButton) {
      centerButton.focus()
    }
    return
  }

  // Define keypad grid layout
  const keypadGrid = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ]

  // Find current position
  let currentRow = -1
  let currentCol = -1

  for (let row = 0; row < keypadGrid.length; row++) {
    for (let col = 0; col < keypadGrid[row].length; col++) {
      if (keypadGrid[row][col] === currentKey) {
        currentRow = row
        currentCol = col
        break
      }
    }
  }

  if (currentRow === -1) return // Current key not found

  // Calculate new position based on direction
  let newRow = currentRow
  let newCol = currentCol

  switch (direction) {
    case 'ArrowUp':
      newRow = currentRow > 0 ? currentRow - 1 : keypadGrid.length - 1 // Wrap to bottom
      break
    case 'ArrowDown':
      newRow = currentRow < keypadGrid.length - 1 ? currentRow + 1 : 0 // Wrap to top
      break
    case 'ArrowLeft':
      newCol = currentCol > 0 ? currentCol - 1 : keypadGrid[currentRow].length - 1 // Wrap to right
      break
    case 'ArrowRight':
      newCol = currentCol < keypadGrid[currentRow].length - 1 ? currentCol + 1 : 0 // Wrap to left
      break
  }

  // Focus the new button
  const newKey = keypadGrid[newRow][newCol]
  const newButton = document.querySelector(`[data-keypad-key="${newKey}"]`) as HTMLElement
  if (newButton) {
    newButton.focus()
  }
}

const pauseQueue = () => {
  emit('pause-queue')
}

const completeQueue = () => {
  emit('complete-queue')
}

const toggleAICoach = (newValue: boolean) => {
  emit('ai-coach-toggle', newValue)
}

const handleHangUpTab = (event: KeyboardEvent) => {
  // If not holding Shift (forward tab), go back to ARKON logo
  if (!event.shiftKey) {
    event.preventDefault()
    // Find and focus the ARKON logo button (tabindex="1")
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
    }
  }
  // For Shift+Tab (backward), let default behavior handle it
}

const handleNextContactTab = (event: KeyboardEvent) => {
  // If not holding Shift (forward tab), go back to ARKON logo
  if (!event.shiftKey) {
    event.preventDefault()
    // Find and focus the ARKON logo button (tabindex="1")
    const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
    if (arkonLogo) {
      arkonLogo.focus()
    }
  }
  // For Shift+Tab (backward), let default behavior handle it
}

const handleMuteKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleMute()
  }
  // Let Tab key work normally for navigation
}

const handleHoldKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleHold()
  }
  // Let Tab key work normally for navigation
}
</script>

<style scoped>
/* Custom scrollbar for contact details */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Prevent transform effects and size changes on action buttons to avoid layout shift */
:deep(.ds-button) {
  transform: none !important;
  border-width: 1px !important;
  box-sizing: border-box !important;
}

:deep(.ds-button:hover) {
  transform: none !important;
  border-width: 1px !important;
  box-sizing: border-box !important;
  padding: var(--original-padding) !important;
}

/* Remove hover effects for disabled buttons */
:deep(.ds-button:disabled),
:deep(.ds-button[disabled]) {
  pointer-events: none !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

:deep(.ds-button:disabled:hover),
:deep(.ds-button[disabled]:hover),
:deep(.p-button:disabled:hover),
:deep(.p-button[disabled]:hover) {
  transform: none !important;
  background-color: inherit !important;
  color: inherit !important;
  border-color: inherit !important;
  box-shadow: none !important;
  opacity: 0.6 !important;
}

:deep(.ds-button:active) {
  transform: none !important;
  border-width: 1px !important;
  box-sizing: border-box !important;
}

:deep(.ds-button:focus) {
  transform: none !important;
  border-width: 1px !important;
  box-sizing: border-box !important;
}

/* Override PrimeVue button specific hover effects */
:deep(.p-button) {
  border-width: 1px !important;
  box-sizing: border-box !important;
  min-height: auto !important;
  height: auto !important;
  line-height: inherit !important;
  font-size: inherit !important;
}

:deep(.p-button:hover) {
  border-width: 1px !important;
  box-sizing: border-box !important;
  transform: none !important;
  min-height: auto !important;
  height: auto !important;
  line-height: inherit !important;
  font-size: inherit !important;
  padding: inherit !important;
  margin: inherit !important;
}

/* Disabled PrimeVue button states */
:deep(.p-button:disabled),
:deep(.p-button[disabled]) {
  pointer-events: none !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

:deep(.p-button:focus) {
  border-width: 1px !important;
  box-sizing: border-box !important;
  transform: none !important;
  outline: none !important;
  box-shadow: none !important;
  min-height: auto !important;
  height: auto !important;
  line-height: inherit !important;
  font-size: inherit !important;
  padding: inherit !important;
  margin: inherit !important;
}

/* Lock down button dimensions completely */
:deep(.p-button), :deep(.ds-button) {
  transition: background-color 0.2s ease, color 0.2s ease !important;
}

/* Aggressive button height locking for ALL dialer buttons */
:deep(.p-button) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  border-width: 1px !important;
  margin: 0 !important;
  vertical-align: top !important;
}

:deep(.p-button:hover) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  border-width: 1px !important;
  margin: 0 !important;
  transform: none !important;
  vertical-align: top !important;
}

:deep(.p-button:focus) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  border-width: 1px !important;
  margin: 0 !important;
  transform: none !important;
  vertical-align: top !important;
}

/* Explicit borders for call control buttons (mute, keypad, hold) */
:deep([tabindex="9"]),
:deep([tabindex="10"]),
:deep([tabindex="11"]) {
  border: 1px solid var(--p-button-secondary-border-color) !important;
}

:deep([tabindex="9"]:hover),
:deep([tabindex="10"]:hover),
:deep([tabindex="11"]:hover) {
  border: 1px solid var(--p-button-secondary-hover-border-color) !important;
}

/* Allow focus styles for call control buttons (tabindex 9-12) */
:deep([tabindex="9"]:focus),
:deep([tabindex="10"]:focus),
:deep([tabindex="11"]:focus),
:deep([tabindex="12"]:focus) {
  outline: none !important;
  box-shadow: inset 0 0 0 2px #60a5fa !important;
}

/* Lock down the action button containers */
:deep(.space-y-3) {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.75rem !important;
}

:deep(.grid.grid-cols-3.gap-3) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
}

/* Specific py-3 class override */
:deep(.py-3) {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
}

/* Lock down the entire action buttons section */
.space-y-3 {
  min-height: 120px !important;
  max-height: 120px !important;
}

/* Prevent any flex item growth that could cause movement */
:deep(.flex-col) {
  flex-shrink: 0 !important;
}

/* Ultra-aggressive button stabilization */
:deep(button) {
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
}



/* Specific targeting for call control buttons (mute, keypad, hold, hang up) */
:deep([tabindex="11"]),
:deep([tabindex="12"]) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
}

:deep([tabindex="11"]:hover),
:deep([tabindex="12"]:hover) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  transform: none !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
}

/* Action buttons (call back, next) need aggressive height locking */
:deep([tabindex="9"]),
:deep([tabindex="10"]) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  margin-bottom: 0.5rem !important; /* Add explicit spacing */
  transform: none !important;
  vertical-align: top !important;
}

:deep([tabindex="9"]:hover),
:deep([tabindex="10"]:hover) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  transform: none !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  vertical-align: top !important;
  padding: inherit !important;
  margin: 0 0 0.5rem 0 !important;
}

:deep([tabindex="9"]:focus),
:deep([tabindex="10"]:focus) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
  box-sizing: border-box !important;
  transform: none !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  vertical-align: top !important;
  padding: inherit !important;
  margin: 0 0 0.5rem 0 !important;
  outline: none !important;
  box-shadow: inset 0 0 0 2px #60a5fa !important;
}

/* Ensure space-y-2 class works properly */
:deep(.space-y-2 > *:not(:last-child)) {
  margin-bottom: 0.5rem !important;
}

/* Keypad button styles */
.keypad-btn {
  @apply bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg px-3 flex flex-col items-center justify-center gap-1 transition-colors min-h-20;
  margin: 1px;
  box-sizing: border-box;
  padding-top: 30px;
  padding-bottom: 30px;
}

.keypad-btn:hover {
  transform: translateY(-1px);
}

.keypad-btn:active {
  transform: translateY(0);
}

/* Disabled keypad button styles */
.keypad-btn:disabled,
.keypad-btn[disabled] {
  pointer-events: none !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.keypad-btn:disabled:hover,
.keypad-btn[disabled]:hover {
  transform: none !important;
  background-color: #374151 !important; /* gray-700 */
}

/* Hang Up button custom hover color */
:deep([tabindex="12"]:hover) {
  background-color: #b91c1c !important; /* red-700 - darker red for hover */
}

/* TabView active tab underline and base nav styling */
:deep(.p-tabview .p-tabview-nav) {
  border-bottom: none;
}

:deep(.p-tabview .p-tabview-ink-bar) {
  display: none;
}

:deep(.p-tabview .p-tabview-tablist) {
  border-bottom: none !important;
}

:deep(.p-tabview .p-tabview-tablist .p-tabview-tablist-item > a.p-tabview-tab-header),
:deep(.p-tabview .p-tabview-nav .p-tabview-tablist-item > a.p-tabview-tab-header) {
  border-bottom: 1px solid transparent !important;
  padding-bottom: 6px !important;
}

:deep(.p-tabview .p-tabview-tablist .p-tabview-tablist-item[data-p-active="true"] > a.p-tabview-tab-header),
:deep(.p-tabview .p-tabview-nav .p-tabview-tablist-item[data-p-active="true"] > a.p-tabview-tab-header) {
  border-bottom-color: var(--p-blue-400) !important;
  box-shadow: inset 0 -1px 0 var(--p-blue-400) !important;
  color: var(--p-blue-400) !important;
}

:deep(.p-tabview .p-tabview-tablist .p-tabview-tablist-item[data-p-active="true"] > a.p-tabview-tab-header .p-tabview-tab-title),
:deep(.p-tabview .p-tabview-nav .p-tabview-tablist-item[data-p-active="true"] > a.p-tabview-tab-header .p-tabview-tab-title) {
  color: var(--p-blue-400) !important;
}

:deep(.p-tabview .p-tabview-tablist .p-tabview-tablist-item:not([data-p-active="true"]) > a.p-tabview-tab-header),
:deep(.p-tabview .p-tabview-nav .p-tabview-tablist-item:not([data-p-active="true"]) > a.p-tabview-tab-header) {
  color: var(--p-surface-0) !important;
}

:deep(.p-tabview .p-tabview-tablist .p-tabview-tablist-item:not([data-p-active="true"]) > a.p-tabview-tab-header .p-tabview-tab-title),
:deep(.p-tabview .p-tabview-nav .p-tabview-tablist-item:not([data-p-active="true"]) > a.p-tabview-tab-header .p-tabview-tab-title) {
  color: var(--p-surface-0) !important;
}

/* Custom ToggleSwitch styling - try multiple approaches */
.custom-toggle .p-toggleswitch-slider {
  background-color: #374151 !important; /* Default background - gray-700 */
  border-color: #6b7280 !important; /* gray-500 */
}

.custom-toggle.p-toggleswitch-checked .p-toggleswitch-slider {
  background-color: #8b5cf6 !important; /* Purple when checked */
  border-color: #8b5cf6 !important;
}

.custom-toggle .p-toggleswitch-handle {
  background-color: #ffffff !important; /* White handle always */
  border-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important; /* Add shadow for better visibility */
}

::deep(.custom-toggle .p-toggleswitch-slider) {
  background-color: #374151 !important; /* Default background - gray-700 */
  border-color: #6b7280 !important; /* gray-500 */
}

::deep(.custom-toggle.p-toggleswitch-checked .p-toggleswitch-slider) {
  background-color: #8b5cf6 !important; /* Purple when checked */
  border-color: #8b5cf6 !important;
}

::deep(.custom-toggle .p-toggleswitch-handle) {
  background-color: #ffffff !important; /* White handle always */
  border-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important; /* Add shadow for better visibility */
}
</style>

<style>
/* Unscoped global styles for AI Coach Toggle - Maximum specificity */
body .ai-coach-toggle.p-toggleswitch {
  height: 20px !important;
  width: 40px !important;
}

html body .ai-coach-toggle.p-toggleswitch .p-toggleswitch-slider {
  background-color: #374151 !important;
  background: #374151 !important;
  border-color: #6b7280 !important;
  height: 20px !important;
  width: 40px !important;
  border-radius: 10px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
}

html body .ai-coach-toggle.p-toggleswitch[data-p-checked="true"] .p-toggleswitch-slider,
html body .ai-coach-toggle.p-toggleswitch-checked .p-toggleswitch-slider {
  background-color: #8b5cf6 !important;
  background: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  height: 20px !important;
  width: 40px !important;
  border-radius: 10px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
}

html body .ai-coach-toggle.p-toggleswitch .p-toggleswitch-handle {
  background-color: #ffffff !important;
  background: #ffffff !important;
  border-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  height: 16px !important;
  width: 16px !important;
  position: absolute !important;
  top: 13px !important;
  left: 2px !important;
  transform: none !important;
  transition: left 0.2s ease !important;
}

html body .ai-coach-toggle.p-toggleswitch[data-p-checked="true"] .p-toggleswitch-handle,
html body .ai-coach-toggle.p-toggleswitch-checked .p-toggleswitch-handle {
  background-color: #ffffff !important;
  background: #ffffff !important;
  border-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  height: 16px !important;
  width: 16px !important;
  position: absolute !important;
  top: 13px !important;
  left: 22px !important;
  transform: none !important;
  transition: left 0.2s ease !important;
}

/* Compact styling for Pause Queue button */
html body .pause-queue-compact.p-button {
  padding: 4px 8px !important;
  font-size: 0.75rem !important;
  min-height: 24px !important;
  height: 24px !important;
  line-height: 1 !important;
}

html body .pause-queue-compact.p-button .text-xs {
  font-size: 0.75rem !important;
  line-height: 1 !important;
}

html body .pause-queue-compact.p-button:hover {
  padding: 4px 8px !important;
  min-height: 24px !important;
  height: 24px !important;
}
</style>
