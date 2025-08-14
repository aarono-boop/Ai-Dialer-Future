<template>
  <div class="fixed inset-0 min-h-screen bg-slate-900 text-white z-50">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
          <i class="pi pi-chart-line text-white text-xs"></i>
        </div>
        <h1 class="text-xl font-bold text-white">ARKON</h1>
      </div>
      
      <!-- User Avatar -->
      <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
        <i class="pi pi-user text-slate-300 text-sm"></i>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-col items-center justify-center px-6 py-16 max-w-4xl mx-auto">
      <!-- Title Section -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">Pricing</h2>
        <p class="text-lg text-slate-400">The AI calling assistant that makes every call count</p>
      </div>

      <!-- Pricing Card -->
      <div class="bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-md w-full">
        <!-- Plan Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-white mb-3">Pro</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            For sales professionals who want unlimited AI calling assistance
          </p>
          
          <!-- Price -->
          <div class="mb-6">
            <span class="text-5xl font-bold text-white">$50</span>
            <span class="text-slate-400 text-lg">/month</span>
          </div>
          
          <!-- Upgrade Button -->
          <Button
            label="Upgrade to Pro"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
            @click="handleUpgrade"
          />
        </div>

        <!-- Features List -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">Unlimited calling</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">Connect Score analysis</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">AI-determined contact sorting</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">Chat-based calling interface</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">Calling data export</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-slate-300 text-sm">Priority chat support</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define emits
const emit = defineEmits(['upgrade-selected', 'close'])

// Methods
const handleUpgrade = () => {
  emit('upgrade-selected')
}
</script>

<style scoped>
/* Ensure proper styling for buttons */
:deep(.p-button) {
  border: none !important;
  font-weight: 500 !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}
</style>
