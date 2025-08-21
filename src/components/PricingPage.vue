<template>
  <div class="fixed inset-0 min-h-screen bg-slate-900 text-white z-50 overflow-y-auto pricing-page-background">
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
    <main class="flex flex-col items-center px-6 py-16 max-w-4xl mx-auto">
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
            <span class="text-5xl font-bold text-white">$100</span>
            <span class="text-slate-400 text-lg">/month</span>
          </div>
          
          <!-- Upgrade Button -->
          <Button
            label="Upgrade to Pro"
variant="primary"
            size="large"
            class="w-full font-medium"
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

      <!-- Built Different Section -->
      <section class="text-center max-w-4xl mx-auto mt-20 mb-16 px-6">
        <h3 class="text-3xl font-bold text-white mb-6">Built different from the ground up</h3>
        <p class="text-slate-400 text-lg leading-relaxed">
          Unlike traditional dialers with AI features bolted on, ARKON is an AI assistant that uses proven dialer
          technology. Every interaction delivers more value than you put in—upload a contact list, get back
          intelligence that transforms how you call. No training required. No complex setup. Just upload your
          contacts and start calling smarter immediately.
        </p>
      </section>

      <!-- FAQ Section -->
      <section class="max-w-6xl mx-auto px-6 pb-16">
        <h3 class="text-3xl font-bold text-white text-center mb-12">FAQ</h3>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-8">
            <!-- Question 1 -->
            <div>
              <h4 class="text-white font-semibold text-lg mb-3">How is this different from my current dialer?</h4>
              <p class="text-slate-400 text-sm leading-relaxed">
                Most dialers add AI features on top of old technology.
                ARKON is built from the ground up as an AI assistant that
                happens to use proven dialer technology. Instead of just
                making calls faster, ARKON tells you who to call, when to
                call them, and why they're likely to answer.
              </p>
            </div>

            <!-- Question 2 -->
            <div>
              <h4 class="text-white font-semibold text-lg mb-3">How accurate is the Connect Score?</h4>
              <p class="text-slate-400 text-sm leading-relaxed">
                Connect Score analyzes recent phone engagement to
                identify which numbers are actively used. Each contact is
                rated as High, Medium, or Low activity based on calling
                patterns and carrier signals. While no prediction is 100%
                accurate, our beta users consistently see higher
                connected calls when they prioritize High and Medium
                activity contacts using ARKON's recommendations.
              </p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <!-- Question 3 -->
            <div>
              <h4 class="text-white font-semibold text-lg mb-3">What file formats do you support?</h4>
              <p class="text-slate-400 text-sm leading-relaxed">
                Upload your contact lists in CSV, XLS, or XLSX format.
                ARKON automatically enhances your data and analyzes
                each contact for their Connect Score—no formatting or
                cleanup required on your end.
              </p>
            </div>

            <!-- Question 4 -->
            <div>
              <h4 class="text-white font-semibold text-lg mb-3">Can I cancel anytime?</h4>
              <p class="text-slate-400 text-sm leading-relaxed">
                Yes, absolutely. Cancel your Pro subscription anytime
                with no penalties or fees. Your data remains accessible
                during your billing period, and you can export your
                enriched contact lists before canceling.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { DSButton } from '@/design-system/components'

// Define emits
const emit = defineEmits(['upgrade-selected', 'close', 'show-payment'])

// Methods
const handleUpgrade = () => {
  emit('show-payment')
}
</script>

<style scoped>
/* Background pattern */
.pricing-page-background {
  background-color: #242733;
  background-image:
    /* A vignette to create the radial gradient effect for the dots */
    radial-gradient(ellipse at center, transparent 0%, #242733 80%),
    /* The dot pattern */
    radial-gradient(circle, #5D5F69 1px, transparent 1px);
  background-size: 100% 100%, 16px 16px;
}

/* Ensure proper styling for buttons */
:deep(.p-button) {
  border: none !important;
  font-weight: 500 !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}
</style>
