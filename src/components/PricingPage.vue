<template>
  <div class="fixed inset-0 min-h-screen bg-slate-900 text-white z-50 overflow-y-auto pricing-page-background">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-700">
      <div class="flex items-center gap-3">
        <svg
          class="logo-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="pricingArkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path fill="url(#pricingArkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
        </svg>
        <span class="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" aria-hidden="true">ARKON</span>
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
            severity="primary"
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
import Button from 'primevue/button'

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
