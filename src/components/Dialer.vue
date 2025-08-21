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

      <!-- Contact Progress -->
      <div class="mt-2 text-center">
        <div class="text-gray-400 text-xs">
          Contact {{ currentContactIndex + 1 }} of {{ totalContacts }}
        </div>
        <div class="mt-1 bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentContactIndex + 1) / totalContacts) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="text-gray-400 text-sm">
          Queue Time: <span class="text-white">{{ formatTime(queueTime) }}</span>
        </div>
        <DSButton
          v-if="!shouldCompleteQueue"
          @click="pauseQueue"
          :disabled="callState === 'connected' || callState === 'ringing'"
          tabindex="8"
          variant="secondary"
          size="small"
          label="Pause Queue"
        />
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
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Phone:</td>
              <td style="padding: 4px 0; color: white;">{{ currentContact.phone }}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top; color: #9ca3af;">Connect Score:</td>
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
          <DSButton
            ref="muteButtonRef"
            @click="toggleMute"
            @keydown="handleMuteKeydown"
            tabindex="9"
            :variant="isMuted ? 'error' : 'secondary'"
            class="flex flex-col items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-microphone-slash" v-if="isMuted"></i>
            <i class="pi pi-microphone" v-else></i>
            <span class="text-xs">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
          </DSButton>

          <DSButton
            ref="keypadButtonRef"
            @click="showKeypad"
            tabindex="10"
            variant="secondary"
            class="flex flex-col items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-th"></i>
            <span class="text-xs">Keypad</span>
          </DSButton>

          <DSButton
            ref="holdButtonRef"
            @click="toggleHold"
            @keydown="handleHoldKeydown"
            tabindex="11"
            :variant="isOnHold ? 'warning' : 'secondary'"
            class="flex flex-col items-center justify-center gap-1 py-3"
          >
            <i class="pi pi-pause"></i>
            <span class="text-xs">{{ isOnHold ? 'Resume' : 'Hold' }}</span>
          </DSButton>
        </div>

        <!-- Hang Up Button -->
        <DSButton
          @click="hangUp"
          @keydown.tab="handleHangUpTab"
          tabindex="12"
          variant="error"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i class="pi pi-phone" style="transform: rotate(135deg);"></i>
          Hang Up
        </DSButton>
      </div>

      <!-- Regular Action Buttons (when not connected) -->
      <div v-else class="space-y-2">
        <DSButton
          @click="callBack"
          tabindex="9"
          variant="secondary"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i class="pi pi-phone"></i>
          Call {{ currentContact.name }} Back
        </DSButton>

        <DSButton
          @click="shouldCompleteQueue ? completeQueue() : nextContact()"
          @keydown.tab="handleNextContactTab"
          tabindex="10"
          :disabled="shouldCompleteQueue && !queueCompletionReady"
          :variant="shouldCompleteQueue ? (queueCompletionReady ? 'success' : 'secondary') : dispositionSet ? 'primary' : 'secondary'"
          class="w-full flex items-center justify-center gap-2 py-3"
        >
          <i :class="shouldCompleteQueue ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
          {{ shouldCompleteQueue ? 'Queue Completed' : `Next: ${nextContactName}` }}
        </DSButton>
      </div>
    </div>

    <!-- Keypad Modal -->
    <div v-if="showKeypadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeKeypad" @keydown="handleKeypadKeydown" tabindex="-1">
      <div class="bg-gray-800 rounded-lg p-6 w-80 max-w-sm mx-4" @click.stop>
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-white text-lg font-semibold">Keypad</h3>
          <DSButton @click="closeKeypad" @keydown.tab="handleCloseButtonTab" tabindex="113" variant="tertiary" size="small">
            <i class="pi pi-times text-xl"></i>
          </DSButton>
        </div>

        <!-- Keypad Grid -->
        <div class="grid grid-cols-3 gap-3">
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
import { ref, nextTick } from 'vue'
import { DSButton } from '@/design-system/components'

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
        // DSButton component - need to find the actual DOM element
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
        // DSButton component - need to find the actual DOM element
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
      // DSButton component - need to find the actual DOM element
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
