<template>
  <!-- Test change for PR functionality -->
  <div class="min-h-screen text-white flex flex-col relative overflow-x-hidden" :class="showDialer ? 'dialer-active' : ''">
    
    <!-- Header -->
    <Header
      ref="headerRef"
      :isSignedIn="isSignedIn"
      @login="handleLogin"
      @switch-to-vulcan="handleSwitchToVulcan"
      @show-product="showProductPage"
      @go-home="goToMainApp"
      :style="showDialer ? 'margin-right: 33.333333%' : ''"
    />

    <!-- Main App Content -->
    <main v-if="currentPage === 'main'" class="flex-1 flex items-start justify-center p-8 relative z-[5]">
      <div class="flex gap-6 w-full max-w-[1400px] h-[80vh] mt-2.5">
        <!-- Chat Container -->
        <div :class="showDialer ? 'w-full' : 'w-full max-w-6xl mx-auto'" class="rounded-xl px-5" :style="showDialer ? 'margin-right: 33.333333%' : ''">
          <div class="w-full h-full flex flex-col">
          <!-- Top content area - scrollable -->
          <div class="flex-1 overflow-y-auto flex flex-col gap-8 pr-2 pb-4" ref="chatMessages">
            <!-- Chat Messages Area -->
            <div class="flex flex-col">
              <template v-for="(message, index) in messages" :key="index">
                <!-- Regular Chat Message -->
                <ChatMessage v-if="message.type !== 'separator'" :message="message" :isWide="shouldBeWideMessage(message, index)">
                  <template #additional-content>
                    <!-- File Upload Area - shown inside welcome message for new users or ready to upload message for returning users -->
                    <FileUpload
                      v-if="(index === 0 && !isSignedIn) || (isSignedIn && showFileUploadForReturningUser && isReadyToUploadMessage(message, index))"
                      @trigger-upload="simulateFileUpload"
                      @file-selected="onFileSelect"
                      @file-dropped="simulateFileUpload"
                    />
                  </template>
                </ChatMessage>

                <!-- Call Separator -->
                <CallSeparator v-else-if="message.type === 'separator'" :contactName="message.contactName || ''" />
              </template>
            </div>

            <!-- File Upload for Returning Users - now embedded in chat message instead -->


          </div>

          <!-- Action Buttons - positioned above chat input -->
          <div v-if="showActionButtons" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <ActionButtons
                @action-selected="handleActionButton"
              />
            </div>
          </div>

          <!-- Queue Action Buttons - shown when queue is paused -->
          <div v-if="showContinueQueueButton || showLoadNewFileButton" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <button
                v-if="showContinueQueueButton"
                @click="continueQueue"
                class="flex-1 btn-primary px-6 py-3 rounded-lg font-semibold cursor-pointer"
              >
                Continue Call Queue
              </button>
              <button
                v-if="showLoadNewFileButton"
                @click="loadNewFile"
                class="flex-1 btn-secondary px-6 py-3 rounded-lg font-semibold cursor-pointer"
              >
                Load New File
              </button>
            </div>
          </div>

          <!-- Contact Preview Buttons - always visible when active -->
          <div v-if="showContactPreviewButtons" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <button
                @click="handleLooksGood"
                class="flex-1 btn-primary px-6 py-3 rounded-lg font-semibold cursor-pointer"
                tabindex="3"
              >
                Looks Good
              </button>
              <button
                @click="handleTryAgain"
                class="btn-secondary flex-1 px-6 py-3 rounded-lg font-semibold cursor-pointer"
                tabindex="4"
              >
                Try Again
              </button>
            </div>
          </div>

          <!-- Phone Verification Button - always visible when active -->
          <div v-if="showPhoneVerificationButton" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <button
                @click="handlePhoneVerification"
                class="w-1/2 btn-primary px-8 py-3 rounded-lg font-semibold cursor-pointer mx-auto block"
                tabindex="3"
              >
                Now lets verify my phone number
              </button>
            </div>
          </div>

          <!-- Verification Code Buttons - always visible when active -->
          <div v-if="showVerificationButtons" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] flex gap-3">
              <button
                @click="handleResendCode"
                class="btn-secondary flex-1 px-6 py-3 rounded-lg font-semibold cursor-pointer"
                tabindex="3"
              >
                Resend Code
              </button>
              <button
                @click="handleTryAnotherNumber"
                class="btn-secondary flex-1 px-6 py-3 rounded-lg font-semibold cursor-pointer"
                tabindex="4"
              >
                Try Another Number
              </button>
            </div>
          </div>

          <!-- Start Dialing Button - always visible when active -->
          <div v-if="showStartDialingButton" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <button
                @click="handleStartDialing"
                class="w-1/2 btn-primary py-3 rounded-lg font-semibold cursor-pointer mx-auto block"
                tabindex="3"
              >
                Start Dialing
              </button>
            </div>
          </div>

          <!-- Disposition Buttons - always visible when active -->
          <div v-if="showDispositionButtons" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%] grid grid-cols-4 gap-3">
              <button
                @click="handleDisposition('Follow up')"
                class="btn-secondary py-3 px-4 rounded-lg font-medium cursor-pointer"
                tabindex="3"
              >
                Follow up
              </button>
              <button
                @click="handleDisposition('Not interested')"
                class="btn-secondary py-3 px-4 rounded-lg font-medium cursor-pointer"
                tabindex="4"
              >
                Not interested
              </button>
              <button
                @click="handleDisposition('Do Not Call')"
                class="btn-secondary py-3 px-4 rounded-lg font-medium cursor-pointer"
                tabindex="5"
              >
                Do Not Call
              </button>
              <button
                @click="handleDisposition('Set Appointment')"
                class="btn-primary py-3 px-4 rounded-lg font-medium cursor-pointer"
                tabindex="6"
              >
                Set Appointment
              </button>
            </div>
          </div>

          <!-- Signup Buttons - always visible when active -->
          <div v-if="showSignupButtons && !isSignedIn" class="mt-2 pt-5 flex justify-center">
            <div class="w-[70%]">
              <SignupButtons
                @google-signup="handleGoogleSignup"
                @email-signup="handleEmailSignup"
              />
            </div>
          </div>

          <!-- Chat Input - positioned at bottom -->
          <div class="mt-2">
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
        <div v-if="showDialer" class="fixed top-0 right-0 w-1/3 h-screen z-20 bg-gray-900">
          <Dialer
            :callState="callState"
            :callDuration="callDuration"
            :queueTime="queueTime"
            :currentContact="currentContact"
            :nextContactName="nextContactName"
            :shouldCompleteQueue="shouldCompleteQueue"
            :isLastContact="isLastContact"
            :dispositionSet="dispositionSet"
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

    <!-- Product Page -->
    <ProductPage
      v-if="currentPage === 'product'"
      @go-to-app="goToMainApp"
    />

    <!-- Login Page -->
    <LoginPage
      v-if="currentPage === 'login'"
      @google-signin="handleGoogleSignin"
      @login-success="handleLoginSuccess"
      @show-signup="showSignupFromLogin"
    />

    <!-- Signup Page -->
    <SignupPage
      v-if="currentPage === 'signup'"
      @google-signup="handleGoogleSignupFromSignup"
      @switch-to-signin="switchToSigninFromSignup"
    />

    <!-- Footer -->
    <Footer v-if="currentPage === 'main'" :style="showDialer ? 'margin-right: 33.333333%' : ''" @skip-to-dialer="skipToDialer" />

    <!-- Screen Reader Live Region for Announcements -->
    <div
      id="sr-announcements"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
      ref="screenReaderAnnouncements"
    ></div>


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

    <!-- Session Summary now displayed in chat area -->

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// Components
import Header from './components/Header.vue'
import ChatMessage from './components/ChatMessage.vue'
import FileUpload from './components/FileUpload.vue'
import ActionButtons from './components/ActionButtons.vue'
import SignupButtons from './components/SignupButtons.vue'
import ChatInput from './components/ChatInput.vue'
import TermsModal from './components/TermsModal.vue'
import AccountCreation from './components/AccountCreation.vue'
import ProductPage from './components/ProductPage.vue'
import LoginPage from './components/LoginPage.vue'
import SignupPage from './components/SignupPage.vue'
import PricingPage from './components/PricingPage.vue'
import PaymentPage from './components/PaymentPage.vue'
import Footer from './components/Footer.vue'
import Dialer from './components/Dialer.vue'
import CallSeparator from './components/CallSeparator.vue'

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
const currentPage = ref<string>('main') // 'main', 'product', 'login', 'signup'
const chatInputRef = ref<any>(null)
const chatMessages = ref<HTMLElement | null>(null)
const screenReaderAnnouncements = ref<HTMLElement | null>(null)
const headerRef = ref<any>(null)
const hasUploadedFile = ref<boolean>(false)
const showSignupButtons = ref<boolean>(false)
const showTermsModal = ref<boolean>(false)
const showAccountCreation = ref<boolean>(false)
const showPricingPage = ref<boolean>(false)
const showPaymentPage = ref<boolean>(false)
const isSignedIn = ref<boolean>(false)
const isReturningUser = ref<boolean>(false) // Track if user logged in vs created new account
const showActionButtons = ref<boolean>(false)
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
const showContinueQueueButton = ref<boolean>(false)
const showLoadNewFileButton = ref<boolean>(false)
const dispositionSet = ref<boolean>(false)
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

  // Establish focus context after new message appears
  nextTick(() => {
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
  })
}

// Helper function to add user message
const addUserMessage = (content: string): void => {
  messages.value.push({
    type: 'user',
    content: [content]
  })
  scrollToBottom()

  // Establish focus context after new message appears
  nextTick(() => {
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
  })
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

// Helper function to identify if a message is the "Ready to upload" message for returning users
const isReadyToUploadMessage = (message: Message, index: number): boolean => {
  if (message.type !== 'ai') return false
  const content = Array.isArray(message.content) ? message.content[0] : message.content
  return content.includes('Ready to upload your contact file and start dialing')
}

// Helper function to determine which messages should be wide (for file upload)
const shouldBeWideMessage = (message: Message, index: number): boolean => {
  // Make message wide if it contains file upload content
  return (index === 0 && !isSignedIn.value) || // Welcome message for new users
         (isSignedIn.value && showFileUploadForReturningUser.value && isReadyToUploadMessage(message, index)) // Upload message for returning users
}

// Header Methods
const handleLogin = () => {
  currentPage.value = 'login'

  // Clear any existing focus when navigating to login page
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce page change to screen readers
    announceToScreenReader('Navigated to login page. Press Tab to navigate with keyboard.')
  })
}

const handleSwitchToVulcan = () => {
  toast.add({
    severity: 'info',
    summary: 'Switch to Vulcan',
    detail: 'Switching to Vulcan...',
    life: 3000
  })
}

const showProductPage = () => {
  currentPage.value = 'product'

  // Clear any existing focus when navigating to product page
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce page change to screen readers
    announceToScreenReader('Navigated to product page. Press Tab to navigate with keyboard.')
  })
}

const goToMainApp = () => {
  currentPage.value = 'main'

  // Clear any existing focus when navigating to main app
  nextTick(() => {
    // Remove focus from any current element so page loads with no focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Establish focus context by mimicking header click
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)

    // Announce page change to screen readers
    announceToScreenReader('Returned to main application. Press Tab to navigate with keyboard.')
  })
}

// Accessibility helper for screen reader announcements
const announceToScreenReader = (message: string) => {
  if (screenReaderAnnouncements.value) {
    screenReaderAnnouncements.value.textContent = message
    // Clear after announcement to allow repeat announcements
    setTimeout(() => {
      if (screenReaderAnnouncements.value) {
        screenReaderAnnouncements.value.textContent = ''
      }
    }, 1000)
  }
}

// Redirect focus from tab trap to ARKON logo
const redirectToArkonLogo = () => {
  const arkonLogo = document.querySelector('button[aria-label="Return to ARKON home page"]') as HTMLElement
  if (arkonLogo) {
    arkonLogo.focus()
  }
}

// Login Page Methods

const handleGoogleSignin = (): void => {
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user
  addAIMessage('🚀 Welcome back! You\'re signed in with Google.')
  setTimeout(() => {
    addAIMessage('Ready to upload your contact file and start dialing?')
    showFileUploadForReturningUser.value = true
    scrollToBottom()
  }, 1000)

  // Clear any existing focus when navigating back to main app
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        arkonLogo.blur()
      }
    }, 50)
    announceToScreenReader('Signed in with Google successfully. Returned to main application.')
  })
}

const handleLoginSuccess = (userData: any): void => {
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true // This is a returning user

  // Since they're a returning user who has already set goals,
  // skip directly to file upload stage
  addAIMessage(`Welcome back, ${userData.name}! Ready to upload your contact file and start dialing?`)

  setTimeout(() => {
    showFileUploadForReturningUser.value = true
    scrollToBottom()
  }, 500)

  // Clear any existing focus when navigating back to main app
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      const arkonLogo = document.querySelector('[tabindex="1"]') as HTMLElement
      if (arkonLogo) {
        arkonLogo.focus()
        arkonLogo.blur()
      }
    }, 50)
    announceToScreenReader('Returned to main application after login.')
  })
}

const showSignupFromLogin = (): void => {
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

const handleGoogleSignupFromSignup = (): void => {
  // Show terms modal for new Google signup users
  showTermsModal.value = true
}

const switchToSigninFromSignup = (): void => {
  currentPage.value = 'login'

  // Clear any existing focus when navigating to login page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to login page. Press Tab to navigate with keyboard.')
  })
}

// File Upload Methods
const simulateFileUpload = () => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  // Announce to screen readers
  announceToScreenReader('File uploaded successfully. Analyzing contact data.')

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      announceToScreenReader('Contact file analysis complete. Preview available.')
      const sampleContacts = `
      <div style="color: #ffffff;">
        <div>
          <h3 style="font-weight: bold; font-size: 1.2em;">Sarah Johnson</h3>
          <p>Sales Development Representative</p>
          <p>TechCorp Inc.</p>
        </div>
        <br>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Home Phone:</td><td style="padding: 4px 0;">(555) 123-4567</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">High</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Mobile Phone:</td><td style="padding: 4px 0;">(555) 123-4568</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">Medium</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Email:</td><td style="padding: 4px 0;">sarah.johnson@techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Address:</td><td style="padding: 4px 0;">1234 Main St, Dallas, TX</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Local Time:</td><td style="padding: 4px 0;">2:45 PM CST</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Website:</td><td style="padding: 4px 0;">techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">LinkedIn Profile:</td><td style="padding: 4px 0;">linkedin.com/in/sarahjohnson</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Industry:</td><td style="padding: 4px 0;">Technology</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Company Size:</td><td style="padding: 4px 0;">250-500 employees</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Lead Source:</td><td style="padding: 4px 0;">Webinar Registration</td></tr>
        </table>
      </div>`

      addAIMessage([
        'Perfect! I\'ve analyzed your contact file. Here\'s a preview of your data. Does this look correct?<br><br>',
        sampleContacts
      ])
      showContactPreviewButtons.value = true
      scrollToBottom()
    }, 1500)
  } else {
    // New user, go to signup page
    currentPage.value = 'signup'

    // Clear any existing focus when navigating to signup page
    nextTick(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      setTimeout(() => {
        if (headerRef.value && headerRef.value.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
      announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
    })
  }
}

const onFileSelect = (file: File): void => {
  hasUploadedFile.value = true
  showFileUploadForReturningUser.value = false

  if (isSignedIn.value) {
    // User is already signed in, go directly to contact preview
    setTimeout(() => {
      const sampleContacts = `
      <div style="color: #ffffff;">
        <div>
          <h3 style="font-weight: bold; font-size: 1.2em;">Sarah Johnson</h3>
          <p>Sales Development Representative</p>
          <p>TechCorp Inc.</p>
        </div>
        <br>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Home Phone:</td><td style="padding: 4px 0;">(555) 123-4567</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">High</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Mobile Phone:</td><td style="padding: 4px 0;">(555) 123-4568</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">Medium</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Email:</td><td style="padding: 4px 0;">sarah.johnson@techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Address:</td><td style="padding: 4px 0;">1234 Main St, Dallas, TX</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Local Time:</td><td style="padding: 4px 0;">2:45 PM CST</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Website:</td><td style="padding: 4px 0;">techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">LinkedIn Profile:</td><td style="padding: 4px 0;">linkedin.com/in/sarahjohnson</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Industry:</td><td style="padding: 4px 0;">Technology</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Company Size:</td><td style="padding: 4px 0;">250-500 employees</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Lead Source:</td><td style="padding: 4px 0;">Webinar Registration</td></tr>
        </table>
      </div>`

      addAIMessage([
        'Perfect! I\'ve analyzed your contact file. Here\'s a preview of your data. Does this look correct?<br><br>',
        sampleContacts
      ])
      showContactPreviewButtons.value = true
      scrollToBottom()
    }, 1500)
  } else {
    // New user, go to signup page
    currentPage.value = 'signup'

    // Clear any existing focus when navigating to signup page
    nextTick(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      setTimeout(() => {
        if (headerRef.value && headerRef.value.establishFocusContext) {
          headerRef.value.establishFocusContext()
        }
      }, 100)
      announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
    })
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

      // Focus the chat input after the AI message appears
      setTimeout(() => {
        if (chatInputRef.value && chatInputRef.value.focus) {
          chatInputRef.value.focus()
          console.log('Auto-focused chat input for verification code')
        } else {
          console.log('Chat input ref not available for verification code auto-focus')
        }
      }, 500)
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
        '���� <strong>Voicemail Drop:</strong> Leaves personalized messages when they don\'t answer',
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
        '��� Rehearse your opening pitch with AI feedback',
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
        '���� Speaking of connections, did you know ARKON users make 3x more meaningful connections than traditional dialers?',
        'Ready to elevate your calling game?'
      ])
    } else if (lowerMessage.includes('jenn')) {
      addAIMessage([
        'Found Jenn! �������',
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
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.<br><br>I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.<br><br>Here\'s what I found:<br><div style="margin-left: 1em; text-indent: -1em;">• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.</div>'
      ])

      // Skip directly to verified phone and start dialing
      setTimeout(() => {
        addAIMessage([
          'Great! Your number (971) 235-1723 is verified and set as your Caller ID.<br><br>As the dialer calls each person, their contact information will be displayed. The first contact that will be called is Sam Sample.'
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
        'I\'ve analyzed your contact\'s phone numbers using real connection data from 900M+ calls, recent phone engagement, calling patterns, and carrier signals—so you only dial numbers likely to connect.<br><br>I\'ve prioritized the phone numbers most likely to connect so you spend time talking, not hitting dead lines.<br><br>Here\'s what I found:<br><div style="margin-left: 1em; text-indent: -1em;">• 40 numbers have \'High\' Connect Scores and show consistent calling activity in the last 12 months. These are highly likely to be connected and assigned to active subscribers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 67 numbers have \'Medium\' Connect Scores and are worth calling after you exhaust your \'High\' Connect Score numbers.</div><br><div style="margin-left: 1em; text-indent: -1em;">• 54 numbers have \'Low\' Connect Scores and are likely disconnected or inactive lines that won\'t answer when dialed.</div>'
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

  // Announce to screen readers
  announceToScreenReader('Phone verification started. Please enter your phone number.')

  // Set verification step to enter phone
  verificationStep.value = 'enter-phone'

  // Add AI response after a delay
  setTimeout(() => {
    addAIMessage('Great! To start dialing, you need to add a verified phone number to your account. What number would you like to use?')
    announceToScreenReader('AI response: Please enter your phone number to continue.')

    // Focus the chat input after the AI message appears
    setTimeout(() => {
      if (chatInputRef.value && chatInputRef.value.focus) {
        chatInputRef.value.focus()
        console.log('Auto-focused chat input for phone number entry')
      } else {
        console.log('Chat input ref not available for phone number auto-focus')
      }
    }, 500)
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

    // Focus the chat input after the AI message appears
    setTimeout(() => {
      if (chatInputRef.value && chatInputRef.value.focus) {
        chatInputRef.value.focus()
        console.log('Auto-focused chat input for try another number')
      } else {
        console.log('Chat input ref not available for try another number auto-focus')
      }
    }, 500)
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
  addAIMessage(`��� Calling ${currentContact.value.name} back on their number...`)
  simulateCall()
}

const handleNextContact = (): void => {
  // Stop current timers
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  // Reset disposition flag for new contact
  dispositionSet.value = false

  // Move to next contact
  if (currentContactIndex.value < contacts.length - 1) {
    currentContactIndex.value++
    addAIMessage(`➡️ Moving to next contact: ${currentContact.value.name}. Preparing to dial...`)
    callState.value = 'ended'
    callDuration.value = 0

    // Add separator message for the new contact
    setTimeout(() => {
      addSeparatorMessage(currentContact.value.name)
      scrollToBottom()

      // Start calling the next contact after showing separator
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

  // Hide dialer
  showDialer.value = false

  addAIMessage('⏸️ Queue paused. You can review your session summary.')

  // Add session summary content to chat
  setTimeout(() => {
    addSessionSummaryToChat()
  }, 1000)
}

const closeSessionSummary = (): void => {
  showSessionSummary.value = false
}

const handleExportFile = (): void => {
  addAIMessage('📊 Exporting your enriched contact file with Connect Scores and call results...')
}

const addSessionSummaryToChat = (): void => {
  // Create session summary content as HTML
  const summaryHTML = `
    <div style="background-color: rgb(31, 41, 55); border-radius: 12px; padding: 24px; margin: 12px 0;">
      <h2 style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 24px;">Queue Paused!</h2>

      <!-- Statistics Cards - 6 cards with icon+number above labels -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 32px;">
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-users"></i> ${contacts.length - currentContactIndex.value - 1}</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Contacts Left to Call</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-users"></i> ${currentContactIndex.value + 1}</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Contacts Dialed</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-phone"></i> ${totalCalls.value}</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Total Calls Made</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;"><i class="pi pi-clock"></i> ${queueTime.value}s</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Queue Duration</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;">💬 <i class="pi pi-comments"></i> ${connectedCalls.value}</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Connected Calls</div>
        </div>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 8px;">⏭️ <i class="pi pi-step-forward"></i> ${skippedNumbers.value}</div>
          <div style="color: white; font-size: 11px; line-height: 1.2;">Skipped Numbers</div>
        </div>
      </div>

      <!-- Call Log Section -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Call Log</h3>
        <div style="background-color: rgb(55, 65, 81); border-radius: 8px; overflow: hidden;">
          <!-- Table Header -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99); background-color: rgb(45, 55, 72);">
            <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">CONTACT</div>
            <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">DURATION</div>
            <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">DISPOSITION</div>
            <div style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase;">NOTES</div>
          </div>
          <!-- Table Rows -->
          ${callLog.value.map(call => `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 16px; border-bottom: 1px solid rgb(75, 85, 99);">
              <div style="color: white; font-size: 24px; font-weight: bold;">${call.contact}</div>
              <div style="color: white; font-size: 24px; font-weight: bold;">${call.duration}</div>
              <div style="color: white; font-size: 24px; font-weight: bold;">${call.disposition}</div>
              <div style="color: white; font-size: 24px; font-weight: bold;">${call.notes || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Results Section -->
      <div style="background-color: rgb(55, 65, 81); border-radius: 8px; padding: 20px;">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="color: white; font-size: 24px;"><i class="pi pi-chart-line"></i></div>
          <div style="flex: 1;">
            <h4 style="color: white; font-size: 16px; font-weight: 600; margin-bottom: 8px;">Your Calling Results</h4>
            <p style="color: rgb(209, 213, 219); font-size: 24px; font-weight: bold; line-height: 1.5; margin-bottom: 16px;">
              Great work! Your queue is paused. While you were calling, I enriched your contact file data with Connect Scores, call outcomes, and notes. You can export your enriched results now or keep calling to build even more value.
            </p>
            <button style="background-color: rgb(59, 130, 246); color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 24px; font-weight: bold; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="handleExportFile()">
              <i class="pi pi-download"></i> Export Enriched File
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  addAIMessage([summaryHTML])

  // Show action buttons for continuing or loading new file
  if (shouldCompleteQueue.value) {
    showLoadNewFileButton.value = true
  } else {
    showContinueQueueButton.value = true
    showLoadNewFileButton.value = true
  }
}

const continueQueue = (): void => {
  showSessionSummary.value = false
  showDialer.value = true
  showContinueQueueButton.value = false
  showLoadNewFileButton.value = false

  // Restart queue timer
  queueTimer = setInterval(() => {
    queueTime.value++
  }, 1000)

  addAIMessage('▶��� Resuming call queue where you left off.')
}

const skipToDialer = (): void => {
  // Skip all setup steps and go directly to dialer for internal testing
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = true
  hasUploadedFile.value = true
  showActionButtons.value = false
  showContactPreviewButtons.value = false
  showPhoneVerificationButton.value = false
  showStartDialingButton.value = false
  showDialer.value = true

  // Initialize dialer state
  callState.value = 'ended'
  currentContactIndex.value = 0

  // Clear messages and add dialer startup message
  messages.value = []
  addAIMessage('���� Dialer activated for testing! Starting first call...')

  // Set focus context for header
  nextTick(() => {
    if (headerRef.value?.establishFocusContext) {
      headerRef.value.establishFocusContext()
    }
  })

  // Automatically start a call after a brief delay
  setTimeout(() => {
    // Start the call simulation
    callState.value = 'ringing'
    currentContactIndex.value = 0 // Start with Sam Sample

    // Start queue timer
    queueTimer = setInterval(() => {
      queueTime.value++
    }, 1000)

    // Add call separator for first contact
    addSeparatorMessage(currentContact.value.name)

    // Simulate ringing for 3-5 seconds then connect
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
  }, 1500) // Brief delay to show the startup message
}

const loadNewFile = (): void => {
  showSessionSummary.value = false
  showDialer.value = false
  hasUploadedFile.value = false
  showContinueQueueButton.value = false
  showLoadNewFileButton.value = false

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

  // Hide dialer
  showDialer.value = false

  addAIMessage('🎉 Congratulations! You have completed your entire call queue. All contacts have been processed.')

  // Add session summary content to chat
  setTimeout(() => {
    addSessionSummaryToChat()
  }, 1000)
}

const handleDisposition = (disposition: string): void => {
  // Hide disposition buttons
  showDispositionButtons.value = false

  // Set disposition flag to enable next button
  dispositionSet.value = true

  // Update the last call log entry with the disposition
  if (callLog.value.length > 0) {
    const lastCall = callLog.value[callLog.value.length - 1]
    lastCall.disposition = disposition
  }

  // Add user message showing what disposition was selected
  addUserMessage(disposition)

  // Add AI response about the disposition
  setTimeout(() => {
    addAIMessage(`✅ ${disposition} disposition saved for ${currentContact.value.name}. Click "Next" to continue to the next contact.`)
    scrollToBottom()
  }, 1000)
}

// Signup Methods
const handleGoogleSignup = () => {
  // Show terms modal for new Google signup users
  showTermsModal.value = true
}

const handleEmailSignup = () => {
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

const handleSignupSubmit = () => {
  // Show terms modal for signup flow
  showTermsModal.value = true
}

const switchToSignin = () => {
  showAccountCreation.value = false
  currentPage.value = 'signup'

  // Clear any existing focus when navigating to signup page
  nextTick(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTimeout(() => {
      if (headerRef.value && headerRef.value.establishFocusContext) {
        headerRef.value.establishFocusContext()
      }
    }, 100)
    announceToScreenReader('Navigated to signup page. Press Tab to navigate with keyboard.')
  })
}

// Terms Modal Methods
const closeTermsModal = () => {
  showTermsModal.value = false
}

const handleTermsCancel = () => {
  closeTermsModal()
  // Take user back to the start (welcome page)
  currentPage.value = 'main'
  isSignedIn.value = false
  isReturningUser.value = false
  showActionButtons.value = false
  // Clear messages and show welcome message
  messages.value = []
  addAIMessage('��� Welcome to ARKON! I\'m your AI calling assistant. I\'ll help you connect with more prospects and close more deals. What would you like to accomplish today?')

  // Set focus context for header
  nextTick(() => {
    if (headerRef.value?.establishFocusContext) {
      headerRef.value.establishFocusContext()
    }
  })
}

const handleTermsAgree = () => {
  closeTermsModal()
  // Show pricing page after terms agreement
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
  // Close payment page and complete signup flow
  showPaymentPage.value = false
  showPricingPage.value = false
  currentPage.value = 'main'
  isSignedIn.value = true
  isReturningUser.value = false // This is a new user
  showActionButtons.value = true
  addAIMessage('���� Congratulations! You\'ve successfully upgraded to the Pro plan and have unlimited access to all features.<br><br>To help us understand what your goals are, what are you trying to accomplish?')

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
      <div style="color: #ffffff;">
        <div>
          <h3 style="font-weight: bold; font-size: 1.2em;">Sarah Johnson</h3>
          <p>Sales Development Representative</p>
          <p>TechCorp Inc.</p>
        </div>
        <br>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Home Phone:</td><td style="padding: 4px 0;">(555) 123-4567</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">High</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Mobile Phone:</td><td style="padding: 4px 0;">(555) 123-4568</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Connect Score:</td><td style="padding: 4px 0;">Medium</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Email:</td><td style="padding: 4px 0;">sarah.johnson@techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Address:</td><td style="padding: 4px 0;">1234 Main St, Dallas, TX</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Local Time:</td><td style="padding: 4px 0;">2:45 PM CST</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Website:</td><td style="padding: 4px 0;">techcorp.com</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">LinkedIn Profile:</td><td style="padding: 4px 0;">linkedin.com/in/sarahjohnson</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Industry:</td><td style="padding: 4px 0;">Technology</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Company Size:</td><td style="padding: 4px 0;">250-500 employees</td></tr>
          <tr><td style="font-weight: bold; padding: 4px 8px 4px 0; vertical-align: top;">Lead Source:</td><td style="padding: 4px 0;">Webinar Registration</td></tr>
        </table>
      </div>`
    
    switch (action) {
      case 'Set Appointments':
        response = [
          'Perfect! Setting appointments is our bread and butter. We\'ll help you fill your calendar.<br><br>I\'ve analyzed your contacts and checked phone numbers with Connect Score. Here\'s a preview of your data. Does this look correct?<br><br>',
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

// Lifecycle hook to establish focus context when app loads
onMounted(() => {
  // Give the app time to fully render, then establish focus context by mimicking header click
  setTimeout(() => {
    if (headerRef.value && headerRef.value.establishFocusContext) {
      headerRef.value.establishFocusContext()
      console.log('Focus context established by mimicking header click')
    }
  }, 500)
})
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
