<template>
  <div class="min-h-screen bg-slate-900 text-white overflow-y-auto">
    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-6 py-16">
      <!-- Hero Section -->
      <section class="text-center mb-16">
        <h1 class="text-5xl font-bold text-white mb-6">About ARKON</h1>
        <h2 class="text-2xl text-slate-300 leading-relaxed">
          Stop Fighting Your Dialer. Start Connecting with ARKON.
        </h2>
        <p class="text-lg text-slate-400 mt-6 leading-relaxed">
          If you're tired of wrestling with complicated calling software that slows you down instead of speeding you up, you're in the right place.
        </p>
      </section>

      <!-- Problem Section -->
      <section class="mb-16">
        <h3 class="text-3xl font-bold text-white mb-8">The Problem Every Sales Rep Faces</h3>
        <p class="text-lg text-slate-300 mb-8 leading-relaxed">
          You have leads to call, but your current tools make everything harder than it should be:
        </p>
        <ul class="space-y-4 text-lg text-slate-300">
          <li class="flex items-start gap-3">
            <span class="text-red-400 mt-1">•</span>
            <span>Wasted time figuring out who to call next</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-red-400 mt-1">•</span>
            <span>Poor contact data that leaves you unprepared for conversations</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-red-400 mt-1">•</span>
            <span>Complex interfaces that require training just to make a phone call</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-red-400 mt-1">•</span>
            <span>No guidance on when you're having good days or bad days—or why</span>
          </li>
        </ul>
        <p class="text-xl text-slate-300 mt-8 font-medium">
          You shouldn't need a computer science degree to make sales calls.
        </p>
      </section>

      <!-- Solution Section -->
      <section class="mb-16">
        <h3 class="text-3xl font-bold text-white mb-8">What If Calling Could Be This Simple?</h3>
        <p class="text-lg text-slate-300 mb-8 leading-relaxed">
          Imagine having an AI assistant that actually makes you better at your job:
        </p>
        <div class="space-y-6">
          <div class="bg-slate-800 border border-slate-600 rounded-lg p-6">
            <p class="text-blue-400 font-semibold mb-2">"I need to call my leads today"</p>
            <p class="text-slate-300">→ ARKON instantly prioritizes your contacts, shows you exactly who to call first, and tells you why.</p>
          </div>
          <div class="bg-slate-800 border border-slate-600 rounded-lg p-6">
            <p class="text-blue-400 font-semibold mb-2">"How am I doing?"</p>
            <p class="text-slate-300">→ Get real-time insights on your call performance, answer rates, and what's working.</p>
          </div>
          <div class="bg-slate-800 border border-slate-600 rounded-lg p-6">
            <p class="text-blue-400 font-semibold mb-2">"I'm not sure who to call next"</p>
            <p class="text-slate-300">→ ARKON analyzes your results and guides you to the prospects most likely to convert.</p>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="mb-16">
        <h3 class="text-3xl font-bold text-white mb-8">Your Success is Our Success</h3>
        <p class="text-lg text-slate-300 mb-8 leading-relaxed">With ARKON, you'll:</p>
        <ul class="space-y-4 text-lg text-slate-300">
          <li class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span>Connect with more people because you're calling the right prospects at the right time</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span>Have better conversations with AI-enhanced contact insights and context</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span>Improve faster with performance guidance that shows you exactly what's working</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-green-400 mt-1">•</span>
            <span>Save hours every week by eliminating manual data work and guesswork</span>
          </li>
        </ul>
      </section>

      <!-- Target Audience Section -->
      <section class="mb-16">
        <h3 class="text-3xl font-bold text-white mb-8">Built for Sales Professionals Who Want Results</h3>
        <p class="text-lg text-slate-300 mb-8 leading-relaxed">ARKON is perfect if you:</p>
        <ul class="space-y-4 text-lg text-slate-300">
          <li class="flex items-start gap-3">
            <span class="text-blue-400 mt-1">•</span>
            <span>Manage your own prospect lists and want them to work harder for you</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-blue-400 mt-1">•</span>
            <span>Believe your tools should make you smarter, not just busier</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-blue-400 mt-1">•</span>
            <span>Want to focus on selling, not learning complicated software</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-blue-400 mt-1">•</span>
            <span>Need confidence that you're making the most of every calling session</span>
          </li>
        </ul>
      </section>

      <!-- Differentiation Section -->
      <section class="mb-16">
        <h3 class="text-3xl font-bold text-white mb-8">This Isn't Another Dialer</h3>
        <p class="text-lg text-slate-300 mb-6 leading-relaxed">
          Most calling tools bolt AI onto old technology. We built intelligence first, then added world-class calling capability. 
          The result? A calling assistant that actually assists—guiding every decision to help you connect with more prospects and close more deals.
        </p>
        <p class="text-xl text-slate-300 leading-relaxed">
          Ready to see what calling with intelligence feels like? Let ARKON show you how much more you can accomplish when your tools work as hard as you do.
        </p>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <Button
          label="Get Started with ARKON"
          class="btn-primary px-8 py-4 rounded-lg font-semibold text-lg"
          @click="$emit('go-to-app')"
          tabindex="0"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

// Define emits
defineEmits(['go-to-app'])
</script>

<style scoped>
/* Ensure proper spacing and typography */
section {
  scroll-margin-top: 2rem;
}

/* Custom scrollbar for the page */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
