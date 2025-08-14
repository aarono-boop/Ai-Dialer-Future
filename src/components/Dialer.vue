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
          Queue Time: <span class="text-white">00:14</span>
        </div>
        <button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors">
          Pause Queue
        </button>
      </div>
    </div>

    <!-- Call Status -->
    <div class="p-4 border-b border-gray-700">
      <div class="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center">
        <div class="text-red-400 font-medium">Call Ended</div>
        <div class="text-gray-300 text-sm">(312) 586-9748</div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="flex-1 p-4 overflow-y-auto">
      <div class="space-y-4">
        <!-- Contact Header -->
        <div>
          <h3 class="text-white text-lg font-semibold">Sam Sample</h3>
          <p class="text-gray-400 text-sm">Sales Development Representative at <span class="text-blue-400">Innovate Inc.</span></p>
        </div>

        <!-- Contact Details -->
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Home Phone:</span>
            <div class="text-right">
              <div class="text-blue-400">(312) 586-9748</div>
            </div>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Connect Score:</span>
            <span class="text-green-400 font-medium">High</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Mobile Phone:</span>
            <div class="text-right">
              <div class="text-blue-400">(312) 555-0199</div>
            </div>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Connect Score:</span>
            <span class="text-yellow-400 font-medium">Medium</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Email:</span>
            <span class="text-blue-400">samsample@getitonline.com</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Address:</span>
            <span class="text-white">Address 1, Apt/Suite, CHICAGO, Illinois 60606</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Local Time:</span>
            <span class="text-white">12:59 PM (CHICAGO, IL)</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Website:</span>
            <span class="text-blue-400">https://www.innovate.com</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">LinkedIn Profile:</span>
            <span class="text-blue-400">https://www.linkedin.com/in/samsample-fake</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-400">Industry:</span>
            <span class="text-white">Technology / SaaS</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-4 space-y-2 border-t border-gray-700">
      <button 
        @click="callBack"
        class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <i class="pi pi-phone"></i>
        Call Sam Sample (Home) Back
      </button>
      
      <button 
        @click="nextContact"
        class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <i class="pi pi-arrow-right"></i>
        Next: George Sample
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define emits
const emit = defineEmits(['call-back', 'next-contact'])

// Methods
const callBack = () => {
  emit('call-back')
}

const nextContact = () => {
  emit('next-contact')
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
