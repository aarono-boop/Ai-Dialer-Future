<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-white text-2xl font-bold">Queue Paused!</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-6 gap-4 mb-8">
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-users text-blue-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ contactsLeft }}</div>
            <div class="text-gray-400 text-sm">Contacts Left to Call</div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-phone text-green-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ contactsDialed }}</div>
            <div class="text-gray-400 text-sm">Contacts Dialed</div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-clock text-yellow-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ formatTime(queueDuration) }}</div>
            <div class="text-gray-400 text-sm">Queue Duration</div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-phone text-blue-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ totalCalls }}</div>
            <div class="text-gray-400 text-sm">Total Calls Made</div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-check-circle text-green-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ connectedCalls }}</div>
            <div class="text-gray-400 text-sm">Connected Calls</div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <i class="pi pi-forward text-orange-400 text-2xl mb-2"></i>
            <div class="text-white text-xl font-bold">{{ skippedNumbers }}</div>
            <div class="text-gray-400 text-sm">Skipped Numbers</div>
          </div>
        </div>
      </div>

      <!-- Call Log -->
      <div class="mb-8">
        <h3 class="text-white text-lg font-semibold mb-4">Call Log</h3>
        <div class="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-700">
              <tr>
                <th class="text-left text-gray-300 p-3 font-medium">CONTACT</th>
                <th class="text-left text-gray-300 p-3 font-medium">DURATION</th>
                <th class="text-left text-gray-300 p-3 font-medium">DISPOSITION</th>
                <th class="text-left text-gray-300 p-3 font-medium">NOTES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(call, index) in callLog" :key="index" class="border-b border-gray-600">
                <td class="text-white p-3">{{ call.contact }}</td>
                <td class="text-gray-300 p-3">{{ call.duration }}</td>
                <td class="text-gray-300 p-3">{{ call.disposition }}</td>
                <td class="text-gray-300 p-3">{{ call.notes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Your Calling Results -->
      <div class="mb-8">
        <div class="flex items-start gap-3 mb-4">
          <i class="pi pi-chart-line text-blue-400 text-xl mt-1"></i>
          <div>
            <h3 class="text-white text-lg font-semibold mb-2">Your Calling Results</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              Great work! Your queue is paused. While you were calling, I enriched your 
              contact file data with Connect Scores, call outcomes, and notes. You can 
              export your enriched results now or keep calling to build even more value.
            </p>
          </div>
        </div>
        
        <button 
          @click="$emit('export-file')"
          class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-download"></i>
          Export Enriched File
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button 
          @click="$emit('continue-queue')"
          class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
        >
          Continue Call Queue
        </button>
        
        <button 
          @click="$emit('load-new-file')"
          class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
        >
          Load New File
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props
defineProps<{
  contactsLeft: number
  contactsDialed: number
  queueDuration: number
  totalCalls: number
  connectedCalls: number
  skippedNumbers: number
  callLog: Array<{
    contact: string
    duration: string
    disposition: string
    notes: string
  }>
}>()

// Define emits
defineEmits(['close', 'continue-queue', 'load-new-file', 'export-file'])

// Helper function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
