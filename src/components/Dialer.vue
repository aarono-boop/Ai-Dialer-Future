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
      <div v-else-if="callState === 'connected'" class="bg-green-900/50 border border-green-700 rounded-lg p-3 text-center">
        <div class="text-green-400 font-medium">Live Call: {{ formatTime(callDuration) }}</div>
        <div class="text-gray-300 text-sm">{{ currentContact.phone }}</div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div class="space-y-4">
        <!-- Contact Header -->
        <div>
          <h3 class="text-white text-lg font-semibold">{{ currentContact.name }}</h3>
          <p class="text-gray-400 text-sm">{{ currentContact.title }} at <span class="text-blue-400">{{ currentContact.company }}</span></p>
        </div>

        <!-- Contact Details -->
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Phone:</span>
            <div class="text-right">
              <div class="text-blue-400">{{ currentContact.phone }}</div>
            </div>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Connect Score:</span>
            <span :class="getConnectScoreColor(currentContact.connectScore)" class="font-medium">{{ currentContact.connectScore }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Email:</span>
            <span class="text-blue-400">{{ currentContact.email }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Address:</span>
            <span class="text-white">{{ currentContact.address }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Local Time:</span>
            <span class="text-white">{{ currentContact.localTime }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Website:</span>
            <span class="text-blue-400">{{ currentContact.website }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">LinkedIn Profile:</span>
            <span class="text-blue-400">{{ currentContact.linkedin }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Industry:</span>
            <span class="text-white">{{ currentContact.industry }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Company Size:</span>
            <span class="text-white">{{ currentContact.companySize }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Lead Source:</span>
            <span class="text-white">{{ currentContact.leadSource }}</span>
          </div>
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
            @click="toggleMute"
            :class="isMuted ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'"
            class="text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <i class="pi pi-microphone-slash" v-if="isMuted"></i>
            <i class="pi pi-microphone" v-else></i>
            <span class="text-xs">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
          </button>

          <button
            @click="showKeypad"
            class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <i class="pi pi-th"></i>
            <span class="text-xs">Keypad</span>
          </button>

          <button
            @click="toggleHold"
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
          class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i class="pi pi-phone"></i>
          Call {{ currentContact.name }} Back
        </button>

        <button
          @click="shouldCompleteQueue ? completeQueue() : nextContact()"
          :class="shouldCompleteQueue ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gray-700 hover:bg-gray-600'"
          class="w-full text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i :class="shouldCompleteQueue ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
          {{ shouldCompleteQueue ? 'Complete Queue' : `Next: ${nextContactName}` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
const emit = defineEmits(['call-back', 'next-contact', 'hang-up', 'mute', 'hold', 'keypad', 'pause-queue'])

// Reactive data
const isMuted = ref(false)
const isOnHold = ref(false)

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
}

const toggleHold = () => {
  isOnHold.value = !isOnHold.value
  emit('hold', isOnHold.value)
}

const showKeypad = () => {
  emit('keypad')
}

const pauseQueue = () => {
  emit('pause-queue')
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
</style>
