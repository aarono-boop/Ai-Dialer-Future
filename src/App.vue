<template>
  <!-- Test change for PR functionality -->
  <div class="min-h-screen text-white flex flex-col relative overflow-x-hidden">
    
    <!-- Header -->
    <Header
      :isSignedIn="isSignedIn"
      @login="handleLogin"
      @switch-to-vulcan="handleSwitchToVulcan"
    />

    <!-- Main Content -->
    <main class="flex-1 flex items-start justify-center p-8 relative z-[5]">
      <div class="flex gap-6 w-full max-w-[1400px] h-[80vh] mt-2.5">
        <!-- Chat Container -->
        <div :class="showDialer ? 'w-2/3' : 'w-full max-w-6xl mx-auto'" class="rounded-xl p-5">
          <div class="w-full h-full flex flex-col">
          <!-- Top content area - scrollable -->
          <div class="flex-1 overflow-y-auto flex flex-col gap-8 pr-2 pb-4" ref="chatMessages">
            <!-- Chat Messages Area -->
            <div class="flex flex-col">
              <template v-for="(message, index) in messages" :key="index">
                <!-- Regular Chat Message -->
                <ChatMessage v-if="message.type !== 'separator'" :message="message" />

                <!-- Call Separator -->
                <CallSeparator v-else-if="message.type === 'separator'" :contactName="message.contactName || ''" />

                <!-- File Upload Area - shown after first message (welcome message) only -->
                <FileUpload
                  v-if="index === 0 && !isSignedIn"
                  @trigger-upload="simulateFileUpload"
                  @file-selected="onFileSelect"
                  @file-dropped="simulateFileUpload"
                />
              </template>
            </div>

            <!-- File Upload for Returning Users -->
            <FileUpload
              v-if="showFileUploadForReturningUser"
              @trigger-upload="simulateFileUpload"
              @file-selected="onFileSelect"
              @file-dropped="simulateFileUpload"
            />

            <!-- Contact Preview Buttons -->
            <div v-if="showContactPreviewButtons" class="flex gap-3 w-full">
              <button
                @click="handleLooksGood"
                class="flex-1 btn-primary px-6 py-3 rounded-lg font-semibold cursor-pointer"
              >
                Looks Good
              </button>
              <button
                @click="handleTryAgain"
                class="flex-1 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Try Again
              </button>
            </div>

            <!-- Phone Verification Button -->
            <div v-if="showPhoneVerificationButton" class="flex justify-center w-full">
              <button
                @click="handlePhoneVerification"
                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
              >
                Now lets verify my phone number
              </button>
            </div>

            <!-- Verification Code Buttons -->
            <div v-if="showVerificationButtons" class="flex gap-3 w-full">
              <button
                @click="handleResendCode"
                class="flex-1 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Resend Code
              </button>
              <button
                @click="handleTryAnotherNumber"
                class="flex-1 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Try Another Number
              </button>
            </div>

            <!-- Start Dialing Button -->
            <div v-if="showStartDialingButton" class="flex justify-center w-full">
              <button
                @click="handleStartDialing"
                class="w-1/2 btn-primary py-3 rounded-lg font-semibold cursor-pointer"
              >
                Start Dialing
              </button>
            </div>

            <!-- Disposition Buttons -->
            <div v-if="showDispositionButtons" class="grid grid-cols-4 gap-3 w-full">
              <button
                @click="handleDisposition('Follow up')"
                class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer"
              >
                Follow up
              </button>
              <button
                @click="handleDisposition('Not interested')"
                class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer"
              >
                Not interested
              </button>
              <button
                @click="handleDisposition('Do Not Call')"
                class="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer"
              >
                Do Not Call
              </button>
              <button
                @click="handleDisposition('Set Appointment')"
                class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer"
              >
                Set Appointment
              </button>
            </div>

            <!-- Signup Buttons -->
            <SignupButtons
              v-if="showSignupButtons && !isSignedIn"
              @google-signup="handleGoogleSignup"
              @email-signup="handleEmailSignup"
            />
          </div>

          <!-- Action Buttons - positioned above chat input -->
          <div v-if="showActionButtons" class="mt-4 flex justify-center">
            <div class="w-[70%]">
              <ActionButtons
                @action-selected="handleActionButton"
              />
            </div>
          </div>

          <!-- Chat Input - positioned at bottom -->
          <div class="mt-4 pt-4">
            <ChatInput
              ref="chatInputRef"
              :customPlaceholder="getPlaceholderText()"
              @send-message="sendMessage"
              @voice-input="handleVoiceInput"
            />
          </div>

          </div>
        </div>

        <!-- Dialer Container -->
        <div v-if="showDialer" class="w-1/3">
          <Dialer
            :callState="callState"
            :callDuration="callDuration"
            :queueTime="queueTime"
            :currentContact="currentContact"
            :nextContactName="nextContactName"
            :shouldCompleteQueue="shouldCompleteQueue"
            :isLastContact="isLastContact"
            @call-back="handleCallBack"
            @next-contact="handleNextContact"
            @hang-up="handleHangUp"
            @mute="handleMute"
            @hold="handleHold"
            @keypad="handleKeypad"
            @pause-queue="handlePauseQueue"
            @complete-queue="handleCompleteQueue"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Signup Modal -->
    <SignupModal 
      :visible="showSignupModal"
      @close="closeSignupModal"
      @submit="handleSignupSubmit"
      @switch-to-signin="switchToSignin"
    />

    <!-- Terms of Service Modal -->
    <TermsModal
      :visible="showTermsModal"
      @close="closeTermsModal"
      @cancel="handleTermsCancel"
      @agree="handleTermsAgree"
    />

    <!-- Account Creation Modal -->
    <AccountCreation
      v-if="showAccountCreation"
      @close="closeAccountCreation"
      @switch-to-signin="switchToSignin"
      @account-created="handleAccountCreated"
      @google-signup="handleGoogleSignupFromAccount"
      @show-terms="showTermsFromAccount"
    />

    <!-- Pricing Page -->
    <PricingPage
      v-if="showPricingPage"
      @upgrade-selected="handleUpgradeSelected"
      @show-payment="showPaymentFromPricing"
      @close="closePricingPage"
    />

    <!-- Payment Page -->
    <PaymentPage
      v-if="showPaymentPage"
      @purchase-completed="handlePurchaseCompleted"
      @close="closePaymentPage"
    />

    <!-- Toast for notifications -->
    <Toast />

    <!-- Session Summary Modal -->
    <SessionSummary
      v-if="showSessionSummary"
      :contactsLeft="contacts.length - currentContactIndex - 1"
      :contactsDialed="currentContactIndex"
      :queueDuration="queueTime"
      :totalCalls="totalCalls"
      :connectedCalls="connectedCalls"
      :skippedNumbers="skippedNumbers"
      :callLog="callLog"
      :isQueueComplete="shouldCompleteQueue"
      @close="closeSessionSummary"
      @continue-queue="continueQueue"
      @load-new-file="loadNewFile"
      @export-file="exportFile"
    />

    <!-- Login Modal -->
    <LoginModal
      v-if="showLoginModal"
      @close="closeLoginModal"
      @google-signin="handleGoogleSignin"
      @login-success="handleLoginSuccess"
      @show-signup="showSignupFromLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// Components
import Header from './components/Header.vue'
import ChatMessage from './components/ChatMessage.vue'
import FileUpload from './components/FileUpload.vue'
import ActionButtons from './components/ActionButtons.vue'
import SignupButtons from './components/SignupButtons.vue'
import ChatInput from './components/ChatInput.vue'
import SignupModal from './components/SignupModal.vue'
import TermsModal from './components/TermsModal.vue'
import AccountCreation from './components/AccountCreation.vue'
import PricingPage from './components/PricingPage.vue'
import PaymentPage from './components/PaymentPage.vue'
import Footer from './components/Footer.vue'
import Dialer from './components/Dialer.vue'
import CallSeparator from './components/CallSeparator.vue'
import SessionSummary from './components/SessionSummary.vue'
import LoginModal from './components/LoginModal.vue'

// PrimeVue Components
import Toast from 'primevue/toast'

// Types
interface Message {
  type: 'ai' | 'user' | 'separator'
  content: string[]
  contactName?: string
}

// Toast functionality (only for login/vulcan actions)
const toast = useToast()

// Reactive data
const chatInputRef = ref<any>(null)
const chatMessages = ref<HTMLElement | null>(null)
const hasUploadedFile = ref<boolean>(false)
const showSignupButtons = ref<boolean>(false)
const showSignupModal = ref<boolean>(false)
const showTermsModal = ref<boolean>(false)
const showAccountCreation = ref<boolean>(false)
const showPricingPage = ref<boolean>(false)
const showPaymentPage = ref<boolean>(false)
const isSignedIn = ref<boolean>(false)
const isReturningUser = ref<boolean>(false) // Track if user logged in vs created new account
const showActionButtons = ref<boolean>(false)
const showLoginModal = ref<boolean>(false)
const showFileUploadForReturningUser = ref<boolean>(false)
const showContactPreviewButtons = ref<boolean>(false)
const showPhoneVerificationButton = ref<boolean>(false)
const verificationStep = ref<string>('default') // 'default', 'enter-phone', 'enter-code'
const enteredPhoneNumber = ref<string>('')
const showVerificationButtons = ref<boolean>(false)
const showStartDialingButton = ref<boolean>(false)
const showDialer = ref<boolean>(false)
const showDispositionButtons = ref<boolean>(false)
const showSessionSummary = ref<boolean>(false)
const callLog = ref<Array<{contact: string, duration: string, disposition: string, notes: string}>>([])
const totalCalls = ref<number>(0)
const connectedCalls = ref<number>(0)
const skippedNumbers = ref<number>(3) // Default for demo
const callState = ref<string>('ended') // 'ended', 'ringing', 'connected'
const callDuration = ref<number>(0)
const queueTime = ref<number>(14)

// Contact data
const contacts = [
  {
    name: 'Sam Sample',
    title: 'Sales Development Representative',
    company: 'Innovate Inc.',
    phone: '(312) 586-9748',
    connectScore: 'High',
    email: 'samsample@getitonline.com',
    address: 'Address 1, Apt/Suite, CHICAGO, Illinois 60606',
    localTime: '12:59 PM (CHICAGO, IL)',
    website: 'https://www.innovate.com',
    linkedin: 'https://www.linkedin.com/in/samsample-fake',
    industry: 'Technology / SaaS',
    companySize: '250-500 employees',
    leadSource: 'Webinar Registration'
  },
  {
    name: 'George Sample',
    title: 'Marketing Manager',
    company: 'Solutions Co.',
    phone: '(202) 744-9556',
    connectScore: 'High',
    email: 'george@solutions.co',
    address: '123 Fake Street, Suite 100, Washington, DC 20001',
    localTime: '1:59 PM (WASHINGTON, DC)',
    website: 'https://www.solutions.co',
    linkedin: 'https://www.linkedin.com/in/georgesample-fake',
    industry: 'Marketing & Advertising',
    companySize: '11-50 employees',
    leadSource: 'Conference Booth'
  },
  {
    name: 'Jennifer Martinez',
    title: 'VP of Sales',
    company: 'TechFlow Inc.',
    phone: '(555) 456-7890',
    connectScore: 'Medium',
    email: 'jennifer@techflow.com',
    address: '456 Business Ave, San Francisco, CA 94102',
    localTime: '11:15 AM (SAN FRANCISCO, CA)',
    website: 'https://www.techflow.com',
    linkedin: 'https://www.linkedin.com/in/jennifermartinez',
    industry: 'Software Development',
    companySize: '100-250 employees',
    leadSource: 'LinkedIn Outreach'
  },
  {
    name: 'David Wilson',
    title: 'Operations Director',
    company: 'Global Systems',
    phone: '(555) 321-0987',
    connectScore: 'High',
    email: 'david@globalsystems.com',
    address: '789 Corporate Blvd, Austin, TX 78701',
    localTime: '1:30 PM (AUSTIN, TX)',
    website: 'https://www.globalsystems.com',
    linkedin: 'https://www.linkedin.com/in/davidwilson',
    industry: 'Enterprise Solutions',
    companySize: '500+ employees',
    leadSource: 'Trade Show'
  }
]

const currentContactIndex = ref<number>(0)
const currentContact = computed(() => contacts[currentContactIndex.value])
const nextContactName = computed(() => {
  const nextIndex = currentContactIndex.value + 1
  return nextIndex < contacts.length ? contacts[nextIndex].name : 'No more contacts'
})

const shouldCompleteQueue = computed(() => {
  return callLog.value.length >= 4 || currentContactIndex.value >= 3
})

const isLastContact = computed(() => {
  return currentContactIndex.value >= contacts.length - 1
})

// Chat messages array
const messages: Ref<Message[]> = ref([
  {
    type: 'ai',
    content: [
      'Welcome! I\'m <strong>ARKON</strong>, your AI calling assistant.<br><br>Drop your contact file here and I\'ll show you exactly who\'s most likely to pick up right now.'
    ]
  }
])

// Helper function to scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick()
  // Wait for DOM updates and then scroll multiple times to ensure it works
  setTimeout(() => {
    if (chatMessages.value) {
      // First scroll immediately
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight

      // Then scroll smoothly after a short delay
      setTimeout(() => {
        if (chatMessages.value) {
          chatMessages.value.scrollTo({
            top: chatMessages.value.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, 50)
}

// Helper function to add AI message
const addAIMessage = (content: string | string[]): void => {
  const contentArray = Array.isArray(content) ? content : [content]
  messages.value.push({
    type: 'ai',
    content: contentArray
  })
  scrollToBottom()
}

// Helper function to add user message
const addUserMessage = (content: string): void => {
  messages.value.push({
    type: 'user',
    content: [content]
  })
  scrollToBottom()
}

// Helper function to add separator message
const addSeparatorMessage = (contactName: string): void => {
  messages.value.push({
    type: 'separator',
    content: [],
    contactName: contactName
  })
  scrollToBottom()
}

// Header Methods
const handleLogin = () => {
  showLoginModal.value = true
}

const handleSwitchToVulcan = () => {
  toast.add({
    severity: 'info',
    summary: 'Switch to Vulcan',
    detail: 'Switching to Vulcan...',
    life: 3000
  })
}

// Login Modal Methods
const closeLoginModal = (): void => {
  showLoginModal.value = false
}

const handleGoogleSignin = (): void => {
  showLoginModal.value = false
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user
  addAIMessage('🚀 Welcome back! You\'re signed in with Google.')
  setTimeout(() => {
    addAIMessage('Ready to upload your contact file and start dialing?')
    showFileUploadForReturningUser.value = true
    scrollToBottom()
  }, 1000)
}

const handleLoginSuccess = (userData: any): void => {
  showLoginModal.value = false
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user

  // Since they're a returning user who has already set goals,
  // skip directly to file upload stage
  addAIMessage(`Welcome back, ${userData.name}! Ready to upload your contact file and start dialing?`)

  setTimeout(() => {
    showFileUploadForReturningUser.value = true
    scrollToBottom()
  }, 500)
}

const showSignupFromLogin = (): void => {
  showLoginModal.value = false
  showSignupModal.value = true
}

// File Upload Methods
const simulateFileUpload = () => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      const sampleContacts = `
      <div style="margin: 1rem 0; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1.5rem; max-width: 400px;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 600;">Sarah Johnson</h3>
          <p style="color: #9ca3af; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Sales Development Representative</p>
          <p style="color: #60a5fa; margin: 0.25rem 0 0 0; font-size: 0.9rem;">TechCorp Inc.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
          <div>
            <span style="color: #9ca3af;">Home Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4567</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #10b981; font-weight: 600;">High</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Mobile Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4568</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #f59e0b; font-weight: 600;">Medium</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Email: </span>
            <span style="color: #60a5fa;">sarah.johnson@techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Address: </span>
            <span style="color: #ffffff;">1234 Main St, Dallas, TX</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Local Time: </span>
            <span style="color: #ffffff;">2:45 PM CST</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Website: </span>
            <span style="color: #60a5fa;">techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">LinkedIn Profile: </span>
            <span style="color: #60a5fa;">linkedin.com/in/sarahjohnson</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Industry: </span>
            <span style="color: #ffffff;">Technology</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Company Size: </span>
            <span style="color: #ffffff;">250-500 employees</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Lead Source: </span>
            <span style="color: #ffffff;">Webinar Registration</span>
          </div>
        </div>
      </div>`

      addAIMessage([
        'Perfect! I\'ve analyzed your contact file. Here\'s a preview of your data. Does this look correct?',
        sampleContacts
      ])
      showContactPreviewButtons.value = true
      scrollToBottom()
    }, 1500)
  } else {
    // New user, go to account creation
    showAccountCreation.value = true
  }
}

const onFileSelect = (file: File): void => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      const sampleContacts = `
      <div style="margin: 1rem 0; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1.5rem; max-width: 400px;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 600;">Sarah Johnson</h3>
          <p style="color: #9ca3af; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Sales Development Representative</p>
          <p style="color: #60a5fa; margin: 0.25rem 0 0 0; font-size: 0.9rem;">TechCorp Inc.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
          <div>
            <span style="color: #9ca3af;">Home Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4567</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #10b981; font-weight: 600;">High</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Mobile Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4568</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #f59e0b; font-weight: 600;">Medium</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Email: </span>
            <span style="color: #60a5fa;">sarah.johnson@techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Address: </span>
            <span style="color: #ffffff;">1234 Main St, Dallas, TX</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Local Time: </span>
            <span style="color: #ffffff;">2:45 PM CST</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Website: </span>
            <span style="color: #60a5fa;">techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">LinkedIn Profile: </span>
            <span style="color: #60a5fa;">linkedin.com/in/sarahjohnson</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Industry: </span>
            <span style="color: #ffffff;">Technology</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Company Size: </span>
            <span style="color: #ffffff;">250-500 employees</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Lead Source: </span>
            <span style="color: #ffffff;">Webinar Registration</span>
          </div>
        </div>
      </div>`

      addAIMessage([
        'Perfect! I\'ve analyzed your contact file. Here\'s a preview of your data. Does this look correct?',
        sampleContacts
      ])
      showContactPreviewButtons.value = true
      scrollToBottom()
    }, 1500)
  } else {
    // New user, go to account creation
    showAccountCreation.value = true
  }
}

// Chat Input Methods
const sendMessage = (message: string): void => {
  // Add user message
  addUserMessage(message)

  // Handle verification flow
  if (verificationStep.value === 'enter-phone') {
    enteredPhoneNumber.value = message
    verificationStep.value = 'enter-code'
    showVerificationButtons.value = true

    setTimeout(() => {
      addAIMessage(`Perfect. We've sent a text with 6-digit verification code to ${message}. Please enter it below to continue.`)
      scrollToBottom()
    }, 1000)
    return
  }

  if (verificationStep.value === 'enter-code') {
    showVerificationButtons.value = false
    verificationStep.value = 'default'
    showStartDialingButton.value = true

    setTimeout(() => {
      addAIMessage([
        `Great! Your number ${enteredPhoneNumber.value} is verified and set as your Caller ID.`,
        '',
        'As the dialer calls each person, their contact information will be displayed. The first contact that will be called is Sam Sample.'
      ])
      scrollToBottom()
    }, 1000)
    return
  }

  // Simulate AI processing for regular messages
  setTimeout(() => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('anything about arkon')) {
      addAIMessage([
        '🚀 ARKON is PhoneBurner\'s revolutionary AI-powered dialer!',
        'It uses advanced algorithms to predict the best times to call prospects, automatically prioritizes your contact list, and helps you connect with more people in less time.',
        'Key features include smart scheduling, real-time connect predictions, and personalized calling strategies.',
        'What specific aspect of ARKON would you like to know more about?'
      ])
    } else if (lowerMessage.includes('connected to more calls') || lowerMessage.includes('get connected')) {
      addAIMessage([
        '📈 Great question! Here are ARKON\'s proven strategies to boost your connect rates:',
        '• <strong>Smart Timing:</strong> Calls prospects when they\'re most likely to answer',
        '• <strong>Local Presence:</strong> Uses local numbers to increase pickup rates',
        '• <strong>Voicemail Drop:</strong> Leaves personalized messages when they don\'t answer',
        '• <strong>Follow-up Sequences:</strong> Automatically schedules optimal callback times',
        'On average, users see a 40% increase in connect rates within their first week!'
      ])
    } else if (lowerMessage.includes('setup a demo') || lowerMessage.includes('demo')) {
      addAIMessage([
        '✨ I\'d love to show you ARKON in action!',
        'Let me set up a personalized demo where you can see:',
        '• Live contact scoring and prioritization',
        '• Real-time dialing with connect predictions',
        '�� Smart call disposition and follow-up automation',
        'What\'s your preferred time? I can schedule something for today or tomorrow.'
      ])
    } else if (lowerMessage.includes('who i should call now') || lowerMessage.includes('who should i call')) {
      addAIMessage([
        '🎯 Based on your contact data and current time analysis:',
        '<strong>Top 3 prospects to call right now:</strong>',
        '1. Sarah Johnson - 92% connect probability (last spoke 3 days ago)',
        '2. Mike Chen - 89% connect probability (opened your email yesterday)',
        '3. Jennifer Martinez - 84% connect probability (perfect timing window)',
        'Should I dial Sarah first? She\'s showing the highest engagement score today.'
      ])
    } else if (lowerMessage.includes('fire up a dial session') || lowerMessage.includes('dial session')) {
      addAIMessage([
        '🔥 Let\'s fire up a power dialing session!',
        'I can configure your session with:',
        '• <strong>Target audience:</strong> High-priority prospects, warm leads, or follow-ups',
        '• <strong>Call duration:</strong> 30 min, 1 hour, or 2-hour session',
        '• <strong>Connect goals:</strong> Number of conversations you want to have',
        'What type of prospects do you want to focus on for this session?'
      ])
    } else if (lowerMessage.includes('set a reminder') || lowerMessage.includes('reminder')) {
      addAIMessage([
        '⏰ I\'ll help you set up smart reminders!',
        'ARKON can remind you to:',
        '• Follow up with specific prospects at optimal times',
        '• Call back prospects who didn\'t answer',
        '• Review and update your call notes',
        '• Start your daily calling sessions',
        'What would you like to be reminded about and when?'
      ])
    } else if (lowerMessage.includes('practice a call') || lowerMessage.includes('practice')) {
      addAIMessage([
        '🎭 Great idea! Call practice makes perfect.',
        'ARKON\'s practice mode can help you:',
        '• Rehearse your opening pitch with AI feedback',
        '• Practice handling common objections',
        '• Test different conversation flows',
        '• Record and review your delivery',
        'Would you like to practice a cold call opening or work on handling objections?'
      ])
    } else if (lowerMessage.includes('appointments') && lowerMessage.includes('today')) {
      addAIMessage([
        '📅 Here\'s your schedule for today:',
        '<strong>Upcoming appointments:</strong>',
        '• 2:00 PM - Demo call with Sarah Johnson (confirmed)',
        '• 3:30 PM - Follow-up with ABC Corp (needs confirmation)',
        '• 4:15 PM - Discovery call with new lead Mike Chen',
        'You have 45 minutes before your next call. Perfect time for some prospecting!'
      ])
    } else if (lowerMessage.includes('tell a joke') || lowerMessage.includes('joke')) {
      addAIMessage([
        '😄 Why did the salesperson bring a ladder to work?',
        'Because they heard the job was about making <strong>high-level</strong> connections!',
        '',
        '🎯 Speaking of connections, did you know ARKON users make 3x more meaningful connections than traditional dialers?',
        'Ready to elevate your calling game?'
      ])
    } else if (lowerMessage.includes('jenn')) {
      addAIMessage([
        'Found Jenn! ����',
        'I found <strong>Jenn Peterson</strong> in your contacts.',
        'She has an <strong>89% pickup rate</strong> and is most likely available now.',
        'Ready to call Jenn?'
      ])
    } else if (lowerMessage.includes('call') || lowerMessage.includes('start')) {
      addAIMessage([
        'Perfect! Let\'s start calling. 📞',
        'I\'ll prioritize contacts with the highest pickup probability.',
        'Shall I begin with the top 23 most likely to answer?'
      ])
    } else {
      addAIMessage('I can help you find specific contacts, start calling sessions, or analyze your data. What would you like to do?')
    }
  }, 1000)
}

const handleVoiceInput = () => {
  addAIMessage('🎤 Listening... (voice recognition simulated)')

  // Simulate voice input
  setTimeout(() => {
    chatInputRef.value?.setInputValue("Call my highest priority contacts")
    addAIMessage('Voice captured! I heard: "Call my highest priority contacts"')
  }, 2000)
}

// Contact Preview Button Methods
const handleLooksGood = (): void => {
  // Hide contact preview buttons
  showContactPreviewButtons.value = false

  // Add user message showing what button was clicked
  addUserMessage('Looks Good')

  if (isReturningUser.value) {
    // Skip phone verification for returning users (logged in users)
    setTimeout(() => {
      addAIMessage([
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.',
        '',
        'I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.',
        '',
        'Here\'s what I found:',
        '• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.',
        '• 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.',
        '• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.'
      ])

      // Skip directly to verified phone and start dialing
      setTimeout(() => {
        addAIMessage([
          'Great! Your number (971) 235-1723 is verified and set as your Caller ID.',
          '',
          'As the dialer calls each person, their contact information will be displayed. The first contact that will be called is Sam Sample.'
        ])
        showStartDialingButton.value = true
        scrollToBottom()
      }, 1500)

      scrollToBottom()
    }, 1000)
  } else {
    // Regular flow for new users
    setTimeout(() => {
      addAIMessage([
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.',
        '',
        'I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.',
        '',
        'Here\'s what I found:',
        '• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.',
        '• 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.',
        '• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.'
      ])

      // Show phone verification button after the message
      showPhoneVerificationButton.value = true
      scrollToBottom()
    }, 1000)
  }
}

const handleTryAgain = (): void => {
  // Hide contact preview buttons
  showContactPreviewButtons.value = false

  // Add user message showing what button was clicked
  addUserMessage('Try Again')

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('What didn\'t look right previously that I can fix?')
    // Reset the file upload state to show the upload area again
    hasUploadedFile.value = false
  }, 1000)
}

const handlePhoneVerification = (): void => {
  // Hide phone verification button
  showPhoneVerificationButton.value = false

  // Add user message showing what button was clicked
  addUserMessage('Now lets verify my phone number')

  // Set verification step to enter phone
  verificationStep.value = 'enter-phone'

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('Great! To start dialing, you need to add a verified phone number to your account. What number would you like to use?')
  }, 1000)
}

const getPlaceholderText = (): string => {
  switch (verificationStep.value) {
    case 'enter-phone':
      return 'Enter your business phone number'
    case 'enter-code':
      return 'Enter 6-digit verification code'
    default:
      return ''
  }
}

const handleResendCode = (): void => {
  // Add user message
  addUserMessage('Resend Code')

  // Add AI response
  setTimeout(() => {
    addAIMessage(`We've sent a new verification code to ${enteredPhoneNumber.value}. Please check your messages.`)
  }, 1000)
}

const handleTryAnotherNumber = (): void => {
  // Hide verification buttons
  showVerificationButtons.value = false

  // Add user message
  addUserMessage('Try Another Number')

  // Reset to phone entry step
  verificationStep.value = 'enter-phone'
  enteredPhoneNumber.value = ''

  // Add AI response
  setTimeout(() => {
    addAIMessage('No problem! Please enter a different phone number you\'d like to use for verification.')
  }, 1000)
}

const handleStartDialing = (): void => {
  // Hide start dialing button
  showStartDialingButton.value = false

  // Add user message showing what button was clicked
  addUserMessage('Start Dialing')

  // Show the dialer
  showDialer.value = true

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('🎯 Starting your dialing session! Connecting you to your first contact...')

    // Add separator for the first call
    setTimeout(() => {
      addSeparatorMessage(contacts[1].name) // George Sample (since we start at index 1)

      // Start the call simulation after showing separator
      setTimeout(() => {
        simulateCall()
      }, 500)
    }, 1000)
  }, 1000)
}

// Call simulation
let callTimer: number | null = null
let queueTimer: number | null = null

const simulateCall = (): void => {
  // Move to next contact (George Sample)
  currentContactIndex.value = 1

  // Start ringing
  callState.value = 'ringing'

  // Start queue timer
  queueTimer = setInterval(() => {
    queueTime.value++
  }, 1000)

  // Simulate ringing for 3-5 seconds
  setTimeout(() => {
    // Contact answers
    callState.value = 'connected'
    callDuration.value = 0
    connectedCalls.value++

    // Start call duration timer
    callTimer = setInterval(() => {
      callDuration.value++
    }, 1000)

    // Show AI message that call connected
    addAIMessage(`📞 Connected! You're now speaking with ${currentContact.value.name}.`)
    scrollToBottom()
  }, 3000)
}

// Dialer Methods
const handleCallBack = (): void => {
  addAIMessage(`📞 Calling ${currentContact.value.name} back on their number...`)
  simulateCall()
}

const handleNextContact = (): void => {
  // Stop current timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  // Move to next contact
  if (currentContactIndex.value < contacts.length - 1) {
    currentContactIndex.value++
    addAIMessage(`➡️ Moving to next contact: ${currentContact.value.name}. Preparing to dial...`)
    callState.value = 'ended'
    callDuration.value = 0

    // Start new call after a moment
    setTimeout(() => {
      simulateCall()
    }, 2000)
  } else {
    addAIMessage('📋 No more contacts in the queue.')
  }
}

const handleHangUp = (): void => {
  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  callState.value = 'ended'
  showDispositionButtons.value = true
  totalCalls.value++

  // Add to call log with temporary entry (will be updated when disposition is set)
  const duration = `${Math.floor(callDuration.value / 60).toString().padStart(2, '0')}:${(callDuration.value % 60).toString().padStart(2, '0')}`
  callLog.value.push({
    contact: currentContact.value.name,
    duration: duration,
    disposition: 'No Disposition Set',
    notes: ''
  })

  addAIMessage(`📞 Call with ${currentContact.value.name} ended. Duration: ${duration}`)
  addAIMessage('Please select a disposition for this call:')
}

const handleMute = (muted: boolean): void => {
  addAIMessage(muted ? '🔇 Microphone muted' : '🎤 Microphone unmuted')
}

const handleHold = (onHold: boolean): void => {
  addAIMessage(onHold ? '⏸️ Call placed on hold' : '▶️ Call resumed')
}

const handleKeypad = (): void => {
  addAIMessage('📱 Keypad opened')
}

const handlePauseQueue = (): void => {
  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  if (queueTimer) {
    clearInterval(queueTimer)
    queueTimer = null
  }

  // Hide dialer and show session summary
  showDialer.value = false
  showSessionSummary.value = true

  addAIMessage('⏸️ Queue paused. You can review your session summary.')
}

const closeSessionSummary = (): void => {
  showSessionSummary.value = false
}

const continueQueue = (): void => {
  showSessionSummary.value = false
  showDialer.value = true

  // Restart queue timer
  queueTimer = setInterval(() => {
    queueTime.value++
  }, 1000)

  addAIMessage('▶️ Resuming call queue where you left off.')
}

const loadNewFile = (): void => {
  showSessionSummary.value = false
  showDialer.value = false
  hasUploadedFile.value = false

  // Reset all state
  currentContactIndex.value = 0
  callState.value = 'ended'
  callDuration.value = 0
  queueTime.value = 0
  totalCalls.value = 0
  connectedCalls.value = 0
  callLog.value = []

  addAIMessage('📁 Ready to load a new file. Please upload your contact list to start a new dialing session.')
}

const exportFile = (): void => {
  addAIMessage('📊 Exporting your enriched contact file with Connect Scores and call results...')
}

const handleCompleteQueue = (): void => {
  // Stop timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  if (queueTimer) {
    clearInterval(queueTimer)
    queueTimer = null
  }

  // Hide dialer and show session summary
  showDialer.value = false
  showSessionSummary.value = true

  addAIMessage('🎉 Congratulations! You have completed your entire call queue. All contacts have been processed.')
}

const handleDisposition = (disposition: string): void => {
  // Hide disposition buttons
  showDispositionButtons.value = false

  // Update the last call log entry with the disposition
  if (callLog.value.length > 0) {
    const lastCall = callLog.value[callLog.value.length - 1]
    lastCall.disposition = disposition
  }

  // Add user message showing what disposition was selected
  addUserMessage(disposition)

  // Add AI response about the disposition
  setTimeout(() => {
    addAIMessage(`✅ ${disposition} disposition saved for ${currentContact.value.name}.`)
    scrollToBottom()

    // Move to next contact if available
    if (currentContactIndex.value < contacts.length - 1) {
      currentContactIndex.value++

      setTimeout(() => {
        // Add separator message instead of regular AI message
        addSeparatorMessage(currentContact.value.name)
        scrollToBottom()

        // Start calling the next contact after a brief pause
        setTimeout(() => {
          simulateCall()
        }, 1000)
      }, 1500)
    } else {
      addAIMessage('📋 All contacts have been processed. Dialing session complete!')
      showDialer.value = false
      scrollToBottom()

      // Stop queue timer
      if (queueTimer) {
        clearInterval(queueTimer)
        queueTimer = null
      }
    }
  }, 1000)
}

// Signup Methods
const handleGoogleSignup = () => {
  addAIMessage('🚀 Great choice! Setting up your Google account integration...')
  setTimeout(() => {
    addAIMessage('Perfect! Your trial is ready. Let\'s start with your first smart calling session!')
  }, 1500)
}

const handleEmailSignup = () => {
  showSignupModal.value = true
}

const closeSignupModal = () => {
  showSignupModal.value = false
}

const handleSignupSubmit = () => {
  // Close signup modal and show terms modal
  closeSignupModal()
  showTermsModal.value = true
}

const switchToSignin = () => {
  showAccountCreation.value = false
  showSignupModal.value = true
}

// Terms Modal Methods
const closeTermsModal = () => {
  showTermsModal.value = false
}

const handleTermsCancel = () => {
  closeTermsModal()
  showAccountCreation.value = true
}

const handleTermsAgree = () => {
  closeTermsModal()
  showPricingPage.value = true
}

// Pricing Page Methods
const closePricingPage = () => {
  showPricingPage.value = false
}

const showPaymentFromPricing = () => {
  showPricingPage.value = false
  showPaymentPage.value = true
}

const closePaymentPage = () => {
  showPaymentPage.value = false
  showPricingPage.value = true
}

const handlePurchaseCompleted = () => {
  // Close payment page and go directly to main interface
  showPaymentPage.value = false
  showPricingPage.value = false
  isSignedIn.value = true
  showActionButtons.value = true
  addAIMessage('🎉 Congratulations! You\'ve successfully upgraded to the Pro plan and have unlimited access to all features.<br><br>To help us understand what your goals are, what are you trying to accomplish?')

  // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
}

const handleUpgradeSelected = () => {
  closePricingPage()
  isSignedIn.value = true
  showActionButtons.value = true
  addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

  // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
}

// Account Creation Methods
const closeAccountCreation = () => {
  showAccountCreation.value = false
}

const handleAccountCreated = (accountData: any) => {
  closeAccountCreation()
  isSignedIn.value = true
  showActionButtons.value = true
  addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

  // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
}

const showTermsFromAccount = () => {
  showAccountCreation.value = false
  showTermsModal.value = true
}

const handleGoogleSignupFromAccount = () => {
  closeAccountCreation()
  addAIMessage('🚀 Great choice! Setting up your Google account integration...')
  setTimeout(() => {
    isSignedIn.value = true
    showActionButtons.value = true
    addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')

    // Ensure scroll happens after action buttons are rendered
  setTimeout(() => {
    scrollToBottom()
  }, 500)
  }, 2000)
}

// Action Button Methods
const handleActionButton = (action: string): void => {
  // Hide action buttons after selection
  showActionButtons.value = false
  // Show contact preview buttons
  showContactPreviewButtons.value = true
  
  // Add user message showing their selection
  addUserMessage(`I want to ${action.toLowerCase()}`)
  
  // Add AI response based on the action
  setTimeout(() => {
    let response = []
    const sampleContacts = `
      <div style="margin: 1rem 0; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1.5rem; max-width: 400px;">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 600;">Sarah Johnson</h3>
          <p style="color: #9ca3af; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Sales Development Representative</p>
          <p style="color: #60a5fa; margin: 0.25rem 0 0 0; font-size: 0.9rem;">TechCorp Inc.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
          <div>
            <span style="color: #9ca3af;">Home Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4567</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #10b981; font-weight: 600;">High</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Mobile Phone: </span>
            <span style="color: #60a5fa;">(555) 123-4568</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Connect Score: </span>
            <span style="color: #f59e0b; font-weight: 600;">Medium</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Email: </span>
            <span style="color: #60a5fa;">sarah.johnson@techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Address: </span>
            <span style="color: #ffffff;">1234 Main St, Dallas, TX</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Local Time: </span>
            <span style="color: #ffffff;">2:45 PM CST</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Website: </span>
            <span style="color: #60a5fa;">techcorp.com</span>
          </div>

          <div>
            <span style="color: #9ca3af;">LinkedIn Profile: </span>
            <span style="color: #60a5fa;">linkedin.com/in/sarahjohnson</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Industry: </span>
            <span style="color: #ffffff;">Technology</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Company Size: </span>
            <span style="color: #ffffff;">250-500 employees</span>
          </div>

          <div>
            <span style="color: #9ca3af;">Lead Source: </span>
            <span style="color: #ffffff;">Webinar Registration</span>
          </div>
        </div>
      </div>`
    
    switch (action) {
      case 'Set Appointments':
        response = [
          'Perfect! Setting appointments is our bread and butter. We\'ll help you fill your calendar.<br><br>I\'ve analyzed your contacts and checked phone numbers with Connect Score. Here\'s a preview of your data. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Close Live Sales':
        response = [
          'Outstanding! Closing live sales is where the magic happens. We\'ll get you connected with your hottest prospects.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and prioritized those ready to buy with Connect Score.',
          'Here\'s a preview of your highest-intent prospects. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Create Opportunities':
        response = [
          'Perfect! Creating opportunities is all about finding the right prospects at the right time. We\'ll build your pipeline.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and identified potential opportunities with Connect Score.',
          'Here\'s a preview of your warmest leads. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Set Follow Ups':
        response = [
          'Smart choice! Follow-ups are where deals are won. We\'ll help you reconnect with precision timing.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and optimized follow-up timing with Connect Score.',
          'Here\'s a preview of your follow-up targets. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Make Live Transfers':
        response = [
          'Brilliant! Live transfers maximize your team\'s efficiency. We\'ll connect you with prospects ready to talk.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and identified transfer-ready prospects with Connect Score.',
          'Here\'s a preview of your transfer candidates. Does this look correct?',
          sampleContacts
        ]
        break
      case 'Live Conversations':
        response = [
          'Fantastic! Live conversations are the heart of great sales. We\'ll get you talking to the right people.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and found conversation-ready prospects with Connect Score.',
          'Here\'s a preview of your best conversation targets. Does this look correct?',
          sampleContacts
        ]
        break
      default:
        response = [`I\'ll help you with ${action.toLowerCase()}. Let me prepare your optimal calling strategy.`]
    }
    addAIMessage(response)
    scrollToBottom()
  }, 1500)
}
</script>

<style scoped>
/* Message bubble text styling */
.message-bubble p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .grid-cols-3 {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}

/* Custom PrimeVue overrides */
::deep(.p-fileupload) {
  background: transparent;
  border: none;
}

::deep(.p-fileupload-buttonbar) {
  display: none;
}

::deep(.p-fileupload-content) {
  background: transparent;
  border: none;
  padding: 0;
}
</style>
