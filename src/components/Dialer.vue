<template>
  <div class="w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-white font-medium">Dial Queue</span>
        </div>
        <Button
          v-if="!shouldCompleteQueue"
          @click="completeQueue"
          :disabled="false"
          tabindex="8"
          severity="secondary"
          size="small"
          label="End Queue"
          style="flex-shrink: 0; position: relative;"
        />
      </div>

      <!-- Contact Progress -->
      <div class="mt-2 text-center">
        <div class="text-gray-400 text-xs">
          Contact {{ currentContactIndex + 1 }} of 3
        </div>
        <div class="mt-1 bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentContactIndex + 1) / 3) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3" style="min-height: 32px; box-sizing: border-box;">
        <div class="text-gray-400 text-sm" style="flex-shrink: 0;">
          Queue Time: <span class="text-white">{{ formatTime(queueTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Call Status -->
    <div class="p-4 border-b border-gray-700">
      <!-- Call Ended State -->
      <div v-if="callState === 'ended'" class="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center">
        <div class="text-red-400 font-medium">Call Ended</div>
        <div class="text-gray-300 text-sm">(312) 586-9748</div>
      </div>

      <!-- Ringing State -->
      <div v-else-if="callState === 'ringing'" class="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3 text-center">
        <div class="text-yellow-400 font-medium">Calling...</div>
        <div class="text-gray-300 text-sm">{{ currentContact.phone }}</div>
        <div class="flex justify-center mt-2">
          <div class="animate-pulse w-2 h-2 bg-yellow-400 rounded-full mx-1"></div>
          <div class="animate-pulse w-2 h-2 bg-yellow-400 rounded-full mx-1" style="animation-delay: 0.2s"></div>
          <div class="animate-pulse w-2 h-2 bg-yellow-400 rounded-full mx-1" style="animation-delay: 0.4s"></div>
        </div>
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
    </div>

    <!-- Contact Info -->
    <div class="flex-1 p-4 overflow-hidden min-h-0">
      <!-- For contacts other than the 3rd, show both cards -->
      <div v-if="currentContactIndex !== 2" class="h-full min-h-0 flex flex-col gap-4">
        <Card class="flex-1 min-h-0" :pt="{ root: { style: 'height:100%; min-height:0; overflow:hidden;' }, body: { style: 'height:100%; display:flex; flex-direction:column; flex:1; min-height:0;' }, content: { style: 'flex:1; min-height:0; overflow-y:auto; scrollbar-gutter: stable both-edges;' } }">
          <template #title>
            <div class="text-white text-lg font-bold">{{ currentContact.name }}</div>
            <div class="text-white text-sm">{{ currentContact.title }} at {{ currentContact.company }}</div>
          </template>
          <template #content>
            <div class="text-sm overflow-y-auto min-h-0">
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Phone:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.phone }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;"><span class="connect-score-tooltip" :data-tooltip="connectScoreTooltip">Connect Score</span>:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.connectScore }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Email:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.email }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Address:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.address }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Local Time:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.localTime }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Website:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.website }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">LinkedIn Profile:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.linkedin }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Industry:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.industry }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Company Size:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.companySize }}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Lead Source:</td>
                    <td style="padding: 4px 0; color: white;">{{ currentContact.leadSource }}</td>
                  </tr>
                  <tr v-if="currentContact.notes">
                    <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Notes:</td>
                    <td style="padding: 4px 0; color: white; white-space: pre-wrap;">{{ currentContact.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </Card>

        <!-- Live Transcription Card -->
        <Card :class="['min-h-0', transcriptionEnabled ? 'flex-1' : '']" :pt="{ root: { style: transcriptionEnabled ? 'height:100%; min-height:0; overflow:hidden;' : 'height:auto; min-height:0; overflow:hidden;' }, body: { style: transcriptionEnabled ? 'height:100%; display:flex; flex-direction:column; flex:1; min-height:0;' : 'display:flex; flex-direction:column; min-height:0;' }, content: { style: transcriptionEnabled ? 'flex:1; min-height:0; overflow-y:auto; scrollbar-gutter: stable both-edges;' : 'flex:0; height:0; padding:0; overflow:hidden;' } }">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-microphone text-sm" aria-hidden="true"></i>
                <span>Live Transcription</span>
              </div>
              <ToggleSwitch v-model="transcriptionEnabled" aria-label="Toggle live transcription" />
            </div>
          </template>
          <template #content>
            <div ref="transcriptContainer" :class="['space-y-2 text-sm min-h-0', transcriptionEnabled ? 'h-full overflow-y-auto' : 'hidden']" style="scroll-behavior: smooth;">
              <div v-for="(line, idx) in displayedTranscript" :key="idx" class="flex gap-2">
                <span class="text-gray-400 min-w-[64px]">{{ line.speaker }}:</span>
                <span class="text-white">{{ line.text }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- For 3rd contact, show tabs (no toggle) -->
      <div v-else class="h-full min-h-0 flex flex-col">
        <TabView class="flex-1 min-h-0">
          <TabPanel header="Contact Details">
            <div class="h-full min-h-0">
              <Card class="h-full min-h-0" :pt="{ root: { style: 'height:100%; min-height:0; overflow:hidden;' }, body: { style: 'height:100%; display:flex; flex-direction:column; flex:1; min-height:0;' }, content: { style: 'flex:1; min-height:0; overflow-y:auto;' } }">
                <template #title>
                  <div class="text-white text-lg font-bold">{{ currentContact.name }}</div>
                  <div class="text-white text-sm">{{ currentContact.title }} at {{ currentContact.company }}</div>
                </template>
                <template #content>
                  <div class="text-sm overflow-y-auto min-h-0">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tbody>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Phone:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.phone }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;"><span class="connect-score-tooltip" :data-tooltip="connectScoreTooltip">Connect Score</span>:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.connectScore }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Email:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.email }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Address:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.address }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Local Time:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.localTime }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Website:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.website }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">LinkedIn Profile:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.linkedin }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Industry:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.industry }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Company Size:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.companySize }}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Lead Source:</td>
                          <td style="padding: 4px 0; color: white;">{{ currentContact.leadSource }}</td>
                        </tr>
                        <tr v-if="currentContact.notes">
                          <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Notes:</td>
                          <td style="padding: 4px 0; color: white; white-space: pre-wrap;">{{ currentContact.notes }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </Card>
            </div>
          </TabPanel>
          <TabPanel header="Live Transcription">
            <div class="h-full min-h-0">
              <Card class="h-full min-h-0" :pt="{ root: { style: 'height:100%; min-height:0; overflow:hidden;' }, body: { style: 'height:100%; display:flex; flex-direction:column; flex:1; min-height:0;' }, content: { style: 'flex:1; min-height:0; overflow:hidden;' } }">
                <template #title>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-microphone text-sm" aria-hidden="true"></i>
                    <span>Live Transcription</span>
                  </div>
                </template>
                <template #content>
                  <div ref="transcriptContainer" class="space-y-2 text-sm h-full overflow-y-auto min-h-0" style="scroll-behavior: smooth;">
                    <div v-for="(line, idx) in displayedTranscript" :key="idx" class="flex gap-2">
                      <span class="text-gray-400 min-w-[64px]">{{ line.speaker }}:</span>
                      <span class="text-white">{{ line.text }}</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-4 border-t border-gray-700">
      <!-- Call Controls (visible when not ended) -->
      <div v-if="callState !== 'ended'" class="space-y-3">
        <!-- Call Control Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <Button
            ref="muteButtonRef"
            @click="toggleMute"
            @keydown="handleMuteKeydown"
            tabindex="9"
            :disabled="callState === 'idle'"
            :severity="isMuted ? 'warn' : 'secondary'"
            class="flex flex-col items-center justify-center gap-1 py-3"
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
            class="flex flex-col items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-calculator"></i>
            <span class="text-xs">Keypad</span>
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
      <div v-if="callState === 'ended'" class="space-y-2">
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
import { ref, nextTick, watch, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ToggleSwitch from 'primevue/toggleswitch'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

// Connect Score tooltip content
const connectScoreTooltip = `Connect Score is a premium add-on feature that uses real-world signals to help users prioritize high-value contacts and skip low-quality leads. It scores each phone number as High, Medium, or Low based on:

• Carrier data
• Engagement history
• Phone metadata

This lets teams focus their efforts on numbers with the greatest chance of a live answer—improving connect rates, morale, and performance.`

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
  }
  nextContactName: string
  shouldCompleteQueue: boolean
  isLastContact: boolean
  dispositionSet: boolean
  queueCompletionReady: boolean
  currentContactIndex: number
  totalContacts: number
}>()

// Define emits
const emit = defineEmits(['call-back', 'next-contact', 'hang-up', 'mute', 'hold', 'keypad', 'keypad-press', 'pause-queue', 'complete-queue'])

// Reactive data
const isMuted = ref(false)
const isOnHold = ref(false)
const showKeypadModal = ref(false)

// Template refs for PrimeVue buttons
const muteButtonRef = ref<any>(null)
const holdButtonRef = ref<any>(null)
const keypadButtonRef = ref<any>(null)

// Live transcription state
const displayedTranscript = ref<{ speaker: 'You' | 'Contact'; text: string }[]>([])
const transcriptContainer = ref<HTMLElement | null>(null)
const transcriptionEnabled = ref(true)
let transcriptionHandle: number | null = null
let scriptIndex = 0
let wordIndex = 0

const scrollTranscriptToBottom = () => {
  nextTick(() => {
    const el = transcriptContainer.value
    if (el) {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      } catch {
        el.scrollTop = el.scrollHeight
      }
      if (el.parentElement) {
        el.parentElement.scrollTop = el.parentElement.scrollHeight
      }
    }
  })
}

watch(transcriptionEnabled, (enabled) => {
  if (enabled) scrollTranscriptToBottom()
})

const transcriptScript: { speaker: 'You' | 'Contact'; text: string }[] = [
  { speaker: 'You', text: 'Hi Sam, this is Aaron from PhoneBurner do you have a quick minute?' },
  { speaker: 'Contact', text: "Hi Aaron, what's this call about?" },
  { speaker: 'You', text: 'I have an amazing new AI phone dialer I want to tell you about.' },
  { speaker: 'Contact', text: 'I already have a phone dialer, I am using Aircall.' },
  { speaker: 'You', text: 'Totally understand. Many teams use us alongside Aircall to boost answer rates.' },
  { speaker: 'Contact', text: 'How would that work, exactly?' },
  { speaker: 'You', text: 'We prioritize numbers with the highest chance of picking up and automate the dialing.' },
  { speaker: 'Contact', text: 'Does it integrate with Salesforce?' },
  { speaker: 'You', text: 'Yes, native Salesforce logging plus outcome and notes synced automatically.' },
  { speaker: 'Contact', text: 'Interesting. What kind of lift do users see?' },
  { speaker: 'You', text: 'Typical teams see 20-35% more live conversations in week one.' },
  { speaker: 'Contact', text: 'Okay, can you show me a quick demo later today?' },
  { speaker: 'You', text: 'Absolutely. Does 3:30 PM your time work?' },
  { speaker: 'Contact', text: '3:30 works. Send me the invite.' },
  { speaker: 'You', text: 'Great, I just sent a calendar invite and a one-pager. Talk then!' }
]

const resetTranscription = () => {
  displayedTranscript.value = []
  scriptIndex = 0
  wordIndex = 0
  if (transcriptionHandle) {
    clearTimeout(transcriptionHandle)
    transcriptionHandle = null
  }
}

const stepTranscription = () => {
  if (scriptIndex >= transcriptScript.length) return
  if (!transcriptionEnabled.value) {
    transcriptionHandle = window.setTimeout(stepTranscription, 150)
    return
  }
  const current = transcriptScript[scriptIndex]
  const words = current.text.split(' ')

  // Ensure current line exists
  if (!displayedTranscript.value[scriptIndex]) {
    displayedTranscript.value.push({ speaker: current.speaker, text: '' })
  }

  if (wordIndex < words.length) {
    const prefix = displayedTranscript.value[scriptIndex].text ? ' ' : ''
    displayedTranscript.value[scriptIndex].text += prefix + words[wordIndex]
    wordIndex++
    scrollTranscriptToBottom()
    transcriptionHandle = window.setTimeout(stepTranscription, 150)
  } else {
    // Move to next line after a short pause
    scriptIndex++
    wordIndex = 0
    scrollTranscriptToBottom()
    if (scriptIndex < transcriptScript.length) {
      transcriptionHandle = window.setTimeout(stepTranscription, 300)
    }
  }
}

const startTranscription = () => {
  resetTranscription()
  transcriptionHandle = window.setTimeout(stepTranscription, 150)
}

watch(() => props.callState, (state) => {
  if (state === 'ringing') {
    // Next call is starting; clear previous transcript now
    resetTranscription()
  }
  if (state === 'connected') {
    startTranscription()
  }
})

// Also scroll whenever transcript array updates
watch(displayedTranscript, () => {
  scrollTranscriptToBottom()
}, { deep: true })

onUnmounted(() => resetTranscription())

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

/* Parent container stabilization for Pause Queue button */
:deep(.flex.items-center.justify-between.mt-3) {
  min-height: 32px !important;
  max-height: 32px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  position: relative !important;
}

:deep(.flex.items-center.justify-between.mt-3:hover) {
  min-height: 32px !important;
  max-height: 32px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  position: relative !important;
}

/* Nuclear option: Override all global button styles for Pause Queue button */
:deep([tabindex="8"].btn-secondary),
:deep([tabindex="8"].ds-button),
:deep([tabindex="8"].p-button),
:deep([tabindex="8"]) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  vertical-align: top !important;
  width: auto !important;
  height: auto !important;
  min-width: auto !important;
  min-height: auto !important;
  max-width: none !important;
  max-height: none !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  background-color: #344054 !important;
  color: white !important;
}

:deep([tabindex="8"].btn-secondary:hover),
:deep([tabindex="8"].ds-button:hover),
:deep([tabindex="8"].p-button:hover),
:deep([tabindex="8"]:hover) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  vertical-align: top !important;
  width: auto !important;
  height: auto !important;
  min-width: auto !important;
  min-height: auto !important;
  max-width: none !important;
  max-height: none !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  background-color: #475467 !important;
  color: white !important;
}

:deep([tabindex="8"].btn-secondary:focus),
:deep([tabindex="8"].ds-button:focus),
:deep([tabindex="8"].p-button:focus),
:deep([tabindex="8"]:focus) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  vertical-align: top !important;
  outline: none !important;
  box-shadow: inset 0 0 0 2px #6b7280 !important;
  width: auto !important;
  height: auto !important;
  min-width: auto !important;
  min-height: auto !important;
  max-width: none !important;
  max-height: none !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  background-color: #475467 !important;
  color: white !important;
}

:deep([tabindex="8"].btn-secondary:active),
:deep([tabindex="8"].ds-button:active),
:deep([tabindex="8"].p-button:active),
:deep([tabindex="8"]:active) {
  transition: none !important;
  animation: none !important;
  transform: none !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  vertical-align: top !important;
  width: auto !important;
  height: auto !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  background-color: #475467 !important;
  color: white !important;
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
  /* TabView styling: neutral label color with primary ink bar underline */
  :deep(.p-tabview .p-tabview-nav) {
    border-bottom: 1px solid var(--p-content-border-color) !important;
  }
  :deep(.p-tabview .p-tabview-nav .p-tabview-nav-link) {
    color: var(--p-surface-0) !important; /* white for inactive */
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
  :deep(.p-tabview .p-tabview-nav .p-tabview-nav-link:hover),
  :deep(.p-tabview .p-tabview-nav .p-tabview-nav-link:focus),
  :deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link),
  :deep(.p-tabview .p-tabview-nav li[aria-selected="true"] .p-tabview-nav-link) {
    color: var(--p-surface-0) !important; /* keep active text white too */
    background: transparent !important;
  }
  :deep(.p-tabview .p-tabview-nav .p-tabview-nav-link .p-tabview-nav-title),
  :deep(.p-tabview .p-tabview-nav .p-tabview-nav-link span) {
    color: inherit !important;
  }
  :deep(.p-tabview-ink-bar) {
    display: block !important;
    background-color: var(--p-blue-500) !important; /* blue underline */
    height: 2px !important;
  }
</style>
