<template>
  <div class="w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-white font-medium">Dial Queue</span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="text-gray-400 text-sm">
          Queue Time: <span class="text-white">{{ formatTime(queueTime) }}</span>
        </div>
        <button
          v-if="!shouldCompleteQueue"
          @click="pauseQueue"
          tabindex="8"
          class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Pause Queue
        </button>
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
    </div>

    <!-- Contact Info -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div class="space-y-4">
        <!-- Contact Header -->
        <div>
          <h3 class="text-white text-lg font-bold">{{ currentContact.name }}</h3>
          <p class="text-white text-sm">{{ currentContact.title }} at {{ currentContact.company }}</p>
        </div>

        <!-- Contact Details -->
        <div class="text-sm">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Phone:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.phone }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Connect Score:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.connectScore }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Email:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.email }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Address:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.address }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Local Time:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.localTime }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Website:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.website }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">LinkedIn Profile:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.linkedin }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Industry:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.industry }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Company Size:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.companySize }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: white;">Lead Source:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.leadSource }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-4 border-t border-gray-700">
      <!-- Call Controls (when connected) -->
      <div v-if="callState === 'connected'" class="space-y-3">
        <!-- Call Control Buttons -->
        <div class="grid grid-cols-3 gap-3">
          <button
            ref="muteButtonRef"
            @click="toggleMute"
            @keydown="handleMuteKeydown"
            tabindex="9"
            :class="isMuted ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'"
            class="text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <i class="pi pi-microphone-slash" v-if="isMuted"></i>
            <i class="pi pi-microphone" v-else></i>
            <span class="text-xs">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
          </button>

          <button
            @click="showKeypad"
            tabindex="10"
            class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <i class="pi pi-th"></i>
            <span class="text-xs">Keypad</span>
          </button>

          <button
            ref="holdButtonRef"
            @click="toggleHold"
            @keydown="handleHoldKeydown"
            tabindex="11"
            :class="isOnHold ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'"
            class="text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <i class="pi pi-pause"></i>
            <span class="text-xs">{{ isOnHold ? 'Resume' : 'Hold' }}</span>
          </button>
        </div>

        <!-- Hang Up Button -->
        <button
          @click="hangUp"
          @keydown.tab="handleHangUpTab"
          tabindex="12"
          class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i class="pi pi-phone" style="transform: rotate(135deg);"></i>
          Hang Up
        </button>
      </div>

      <!-- Regular Action Buttons (when not connected) -->
      <div v-else class="space-y-2">
        <button
          @click="callBack"
          tabindex="9"
          class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i class="pi pi-phone"></i>
          Call {{ currentContact.name }} Back
        </button>

        <button
          @click="shouldCompleteQueue ? completeQueue() : nextContact()"
          @keydown.tab="handleNextContactTab"
          tabindex="10"
          :class="shouldCompleteQueue ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gray-700 hover:bg-gray-600'"
          class="w-full text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i :class="shouldCompleteQueue ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
          {{ shouldCompleteQueue ? 'Complete Queue' : `Next: ${nextContactName}` }}
        </button>
      </div>
    </div>

    <!-- Keypad Modal -->
    <div v-if="showKeypadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeKeypad">
      <div class="bg-gray-800 rounded-lg p-6 w-80 max-w-sm mx-4" @click.stop>
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-white text-lg font-semibold">Keypad</h3>
          <button @click="closeKeypad" class="text-gray-400 hover:text-white">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <!-- Keypad Grid -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Row 1: 1, 2, 3 -->
          <button @click="pressKey('1')" class="keypad-btn">
            <span class="text-2xl font-bold">1</span>
          </button>
          <button @click="pressKey('2')" class="keypad-btn">
            <span class="text-2xl font-bold">2</span>
            <span class="text-xs text-gray-400">ABC</span>
          </button>
          <button @click="pressKey('3')" class="keypad-btn">
            <span class="text-2xl font-bold">3</span>
            <span class="text-xs text-gray-400">DEF</span>
          </button>

          <!-- Row 2: 4, 5, 6 -->
          <button @click="pressKey('4')" class="keypad-btn">
            <span class="text-2xl font-bold">4</span>
            <span class="text-xs text-gray-400">GHI</span>
          </button>
          <button @click="pressKey('5')" class="keypad-btn">
            <span class="text-2xl font-bold">5</span>
            <span class="text-xs text-gray-400">JKL</span>
          </button>
          <button @click="pressKey('6')" class="keypad-btn">
            <span class="text-2xl font-bold">6</span>
            <span class="text-xs text-gray-400">MNO</span>
          </button>

          <!-- Row 3: 7, 8, 9 -->
          <button @click="pressKey('7')" class="keypad-btn">
            <span class="text-2xl font-bold">7</span>
            <span class="text-xs text-gray-400">PQRS</span>
          </button>
          <button @click="pressKey('8')" class="keypad-btn">
            <span class="text-2xl font-bold">8</span>
            <span class="text-xs text-gray-400">TUV</span>
          </button>
          <button @click="pressKey('9')" class="keypad-btn">
            <span class="text-2xl font-bold">9</span>
            <span class="text-xs text-gray-400">WXYZ</span>
          </button>

          <!-- Row 4: *, 0, # -->
          <button @click="pressKey('*')" class="keypad-btn">
            <span class="text-2xl font-bold">*</span>
          </button>
          <button @click="pressKey('0')" class="keypad-btn">
            <span class="text-2xl font-bold">0</span>
            <span class="text-xs text-gray-400">+</span>
          </button>
          <button @click="pressKey('#')" class="keypad-btn">
            <span class="text-2xl font-bold">#</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

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
  }
  nextContactName: string
  shouldCompleteQueue: boolean
  isLastContact: boolean
}>()

// Define emits
const emit = defineEmits(['call-back', 'next-contact', 'hang-up', 'mute', 'hold', 'keypad', 'keypad-press', 'pause-queue', 'complete-queue'])

// Reactive data
const isMuted = ref(false)
const isOnHold = ref(false)
const showKeypadModal = ref(false)

// Template refs for buttons
const muteButtonRef = ref<HTMLButtonElement | null>(null)
const holdButtonRef = ref<HTMLButtonElement | null>(null)
const keypadButtonRef = ref<HTMLButtonElement | null>(null)

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
        muteButtonRef.value.focus()
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
        holdButtonRef.value.focus()
      }
    }, 100)
  })
}

const showKeypad = () => {
  showKeypadModal.value = true
}

const closeKeypad = () => {
  showKeypadModal.value = false
}

const pressKey = (key: string) => {
  // Emit the key press for DTMF tone generation or other functionality
  emit('keypad-press', key)
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

/* Keypad button styles */
.keypad-btn {
  @apply bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg py-4 px-3 flex flex-col items-center justify-center gap-1 transition-colors min-h-16;
}

.keypad-btn:hover {
  transform: translateY(-1px);
}

.keypad-btn:active {
  transform: translateY(0);
}
</style>
