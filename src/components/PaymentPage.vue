<template>
  <div class="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
    <div class="min-h-screen flex">
      <!-- Left Side - Order Summary -->
      <div class="w-full md:w-2/5 bg-white p-8 shadow-lg">
        <!-- PhoneBurner Logo -->
        <div class="flex items-center gap-2 mb-8">
          <div class="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
            <i class="pi pi-shopping-cart text-white text-xs"></i>
          </div>
          <h1 class="text-xl font-bold text-gray-800">PhoneBurner</h1>
        </div>

        <!-- Order Details -->
        <div class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Purchase ARKON Pro</h2>
          
          <!-- Line Item -->
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <div class="flex-1">
              <div class="text-gray-800 font-medium">ARKON Pro</div>
            </div>
            <div class="text-center w-12">
              <span class="text-gray-600">1</span>
            </div>
            <div class="text-right w-20">
              <span class="text-gray-800 font-medium">$50.00</span>
            </div>
          </div>

          <!-- Tax -->
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-gray-600">Tax</span>
            <span class="text-gray-800">$0.00</span>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center py-4 border-t-2 border-gray-300">
            <span class="text-lg font-bold text-gray-800">Total</span>
            <span class="text-lg font-bold text-gray-800">$50.00</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Payment Form -->
      <div class="flex-1 bg-gray-50 p-8">
        <div class="max-w-md mx-auto">
          <!-- Contact Information -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <InputText
                v-model="email"
                type="email"
                placeholder="charles+1@phoneburner.com"
                class="w-full"
                :pt="{
                  root: { class: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none bg-white' }
                }"
              />
            </div>
          </div>

          <!-- Payment Information -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            
            <!-- Payment Method Tabs -->
            <div class="flex border-b border-gray-200 mb-6">
              <button 
                class="px-4 py-2 border-b-2 border-purple-600 text-purple-600 font-medium flex items-center gap-2"
              >
                <i class="pi pi-credit-card"></i>
                Card
              </button>
              <button class="px-4 py-2 text-gray-500 font-medium ml-6">US bank account</button>
              <button class="px-4 py-2 text-gray-500 font-medium ml-6">Pre-authorized Debit</button>
            </div>

            <!-- Secure Checkout Banner -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex items-center justify-center gap-2">
              <i class="pi pi-shield-check text-purple-600"></i>
              <span class="text-purple-800 font-medium">Secure, fast checkout with</span>
              <span class="text-purple-600 font-bold">Link</span>
              <i class="pi pi-arrow-down text-purple-600"></i>
            </div>

            <!-- Card Form -->
            <div class="space-y-4">
              <!-- Card Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                <div class="relative">
                  <InputText
                    v-model="cardNumber"
                    placeholder="1234 1234 1234 1234"
                    class="w-full pr-20"
                    :pt="{
                      root: { class: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none bg-white' }
                    }"
                  />
                  <!-- Card Icons -->
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <div class="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                    <div class="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                    <div class="w-6 h-4 bg-blue-400 rounded text-white text-xs flex items-center justify-center">A</div>
                    <div class="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">D</div>
                  </div>
                </div>
              </div>

              <!-- Expiration and Security Code -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expiration date</label>
                  <InputText
                    v-model="expirationDate"
                    placeholder="MM / YY"
                    :pt="{
                      root: { class: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none bg-white' }
                    }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Security code</label>
                  <div class="relative">
                    <InputText
                      v-model="securityCode"
                      placeholder="CVC"
                      :pt="{
                        root: { class: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none bg-white pr-8' }
                      }"
                    />
                    <i class="pi pi-question-circle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <Dropdown
                  v-model="selectedCountry"
                  :options="countries"
                  optionLabel="name"
                  placeholder="United States"
                  class="w-full"
                  :pt="{
                    root: { class: 'w-full border border-gray-300 rounded-lg bg-white' },
                    input: { class: 'px-4 py-3 text-gray-900' }
                  }"
                />
              </div>

              <!-- ZIP Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ZIP code</label>
                <InputText
                  v-model="zipCode"
                  placeholder="12345"
                  :pt="{
                    root: { class: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none bg-white' }
                  }"
                />
              </div>
            </div>

            <!-- Terms Text -->
            <p class="text-xs text-gray-500 mt-6 leading-relaxed">
              By providing your card information, you allow Armor by PhoneBurner to charge your card for future 
              payments in accordance with their terms.
            </p>

            <!-- Purchase Button -->
            <Button
              label="Purchase"
              class="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-lg transition-all duration-200"
              @click="handlePurchase"
            />

            <!-- Stripe Footer -->
            <p class="text-center text-xs text-gray-400 mt-4">
              Payments powered by stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

// Reactive data
const email = ref('charles+1@phoneburner.com')
const cardNumber = ref('')
const expirationDate = ref('')
const securityCode = ref('')
const zipCode = ref('')
const selectedCountry = ref({ name: 'United States', code: 'US' })

const countries = ref([
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'UK' }
])

// Define emits
const emit = defineEmits(['purchase-completed', 'close'])

// Methods
const handlePurchase = () => {
  // Simulate purchase processing
  emit('purchase-completed')
}
</script>

<style scoped>
/* Custom input styling */
:deep(.p-inputtext) {
  background-color: white !important;
  border-color: rgb(209 213 219) !important;
  color: rgb(17 24 39) !important;
}

:deep(.p-inputtext:focus) {
  border-color: rgb(147 51 234) !important;
  box-shadow: none !important;
}

:deep(.p-dropdown) {
  background-color: white !important;
  border-color: rgb(209 213 219) !important;
}

:deep(.p-dropdown:focus) {
  border-color: rgb(147 51 234) !important;
  box-shadow: none !important;
}

:deep(.p-button) {
  border: none !important;
  font-weight: 500 !important;
}

:deep(.p-button:focus) {
  box-shadow: none !important;
}
</style>
