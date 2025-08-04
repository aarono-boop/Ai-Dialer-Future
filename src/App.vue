<template>
  <!-- Test change for PR functionality -->
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col relative overflow-x-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(75,0,130,0.05)_0%,transparent_50%)] before:pointer-events-none">
    <!-- Header -->
    <header class="relative z-10 p-6 lg:px-8 border-b border-white/10 bg-gray-800">
      <div class="flex justify-between items-center max-w-6xl mx-auto">
        <div class="flex items-center gap-3">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <defs>
              <linearGradient id="arkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#arkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
          </svg>
          <span class="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ARKON</span>
        </div>
        
        <div class="text-gray-400 font-medium">
          Calling made smarter
        </div>
        
        <div class="flex gap-4 items-center">
          <Button 
            label="Login" 
            text 
            class="text-white font-medium hover:text-purple-400 transition-colors"
            @click="handleLogin"
          />
          <Button 
            label="Switch to Vulcan?" 
            text 
            class="text-gray-400 font-medium hover:text-purple-400 transition-colors"
            @click="handleSwitchToVulcan"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-8 relative z-[5]">
      <div class="max-w-2xl w-full bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-xl p-10 shadow-2xl">
        <div class="w-full flex flex-col gap-8">

          <!-- Chat Messages Area -->
          <div class="max-h-96 overflow-y-auto flex flex-col mb-4 pr-2 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50" ref="chatMessages">
            <template v-for="(message, index) in messages" :key="index">
              <div :class="['flex items-start mb-4', message.type === 'user' ? 'justify-end' : 'justify-start']">
                <div v-if="message.type === 'ai'" class="flex gap-4 items-start w-full">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-robot text-white text-lg"></i>
                  </div>
                  <div class="max-w-[80%] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-lg rounded-tl-none p-5 text-sm">
                    <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
                  </div>
                </div>
                <div v-else class="flex gap-4 items-start flex-row-reverse">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-user text-white text-lg"></i>
                  </div>
                  <div class="max-w-[80%] bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg rounded-br-sm p-5 text-white">
                    <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
                  </div>
                </div>
              </div>

              <!-- File Upload Area - shown after first message (welcome message) only -->
              <div v-if="index === 0" class="max-w-[80%] my-6 flex flex-col justify-start items-start gap-4">
                <div class="border-2 border-dashed border-white/30 rounded-lg p-10 text-center bg-transparent transition-all duration-300 cursor-pointer w-full hover:border-purple-400/60 hover:bg-white/[0.02]" @click="triggerFileInput" @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave">
                  <i class="pi pi-cloud-upload text-4xl text-gray-500 mb-4 block"></i>
                  <p class="text-base mb-2 text-white">
                    <span class="text-blue-400 hover:text-blue-300 no-underline">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-sm text-gray-400 m-0">CSV, XLS, or XLSX files</p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  @change="onFileInputChange"
                  style="display: none;"
                />
              </div>
            </template>
          </div>

          <!-- Action Buttons -->
          <div v-if="showActionButtons" class="my-6">
            <div class="grid grid-cols-3 gap-3 md:gap-3 sm:grid-cols-2 xs:grid-cols-1">
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Set Appointments')"
              >
                Set Appointments
              </Button>
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Close Live Sales')"
              >
                Close Live Sales
              </Button>
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Create Opportunities')"
              >
                Create Opportunities
              </Button>
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Set Follow Ups')"
              >
                Set Follow Ups
              </Button>
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Make Live Transfers')"
              >
                Make Live Transfers
              </Button>
              <Button
                class="bg-gray-700/80 border border-gray-600/60 text-white/90 px-4 py-3.5 rounded-lg font-medium text-sm text-center transition-all duration-300 backdrop-blur-[10px] min-h-[48px] flex items-center justify-center hover:bg-gray-600/80 hover:border-gray-500/80 hover:text-white hover:-translate-y-0.5"
                @click="handleActionButton('Live Conversations')"
              >
                Live Conversations
              </Button>
            </div>
          </div>

          <!-- Signup Buttons -->
          <div v-if="showSignupButtons && !isSignedIn" class="flex flex-col gap-3 my-6">
            <Button
              class="w-full py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 border border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 hover:text-white"
              @click="handleGoogleSignup"
            >
              <i class="pi pi-google"></i>
              Continue with Google
            </Button>
            <Button
              class="w-full py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 border border-purple-400/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white"
              @click="handleEmailSignup"
            >
              <i class="pi pi-envelope"></i>
              Continue with Email
            </Button>
          </div>

          <!-- Chat Input -->
          <div class="mt-4">
            <div class="flex items-center bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-xl px-3 py-2 gap-2">
              <InputText
                v-model="chatMessage"
                placeholder="Ask me to talk to Jenn"
                class="flex-1 bg-transparent border-none text-white text-base px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-0"
                @keyup.enter="sendMessage"
              />
              <Button
                icon="pi pi-microphone"
                class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white"
                text
                @click="handleVoiceInput"
              />
              <Button
                icon="pi pi-send"
                class="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 transition-all duration-300 hover:bg-purple-400/20 hover:text-white disabled:opacity-50 disabled:text-gray-600"
                @click="sendMessage"
                :disabled="!chatMessage.trim()"
              />
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center p-6 text-gray-500 text-sm relative z-[5]">
      <p>&copy; 2024 PhoneBurner. All rights reserved.</p>
    </footer>

    <!-- Toast for notifications -->
    <Toast />

    <!-- Signup Modal -->
    <div v-if="showSignupModal" class="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] z-[1000] flex items-center justify-center p-8 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(75,0,130,0.05)_0%,transparent_50%)] before:pointer-events-none" @click="closeSignupModal">
      <div class="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl p-10 max-w-md w-full relative shadow-2xl" @click.stop>
        <button class="absolute top-4 right-4 bg-none border-none text-white/60 text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 hover:text-white/90" @click="closeSignupModal">
          <i class="pi pi-times"></i>
        </button>

        <div class="text-center">
          <div class="mb-6 flex justify-center">
            <svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
              <defs>
                <linearGradient id="modalArkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path fill="url(#modalArkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
            </svg>
          </div>

          <h2 class="text-white text-2xl font-semibold mb-8">Create Free Account</h2>

          <form class="flex flex-col gap-5 text-left" @submit.prevent="handleSignupSubmit">
            <div class="flex flex-col gap-2">
              <label class="text-white text-sm font-medium">Email Address</label>
              <InputText
                v-model="signupEmail"
                placeholder="Email address"
                class="bg-white/5 border border-white/20 rounded-lg px-4 py-3.5 text-white text-sm placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/10 focus:outline-none"
                type="email"
                required
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-white text-sm font-medium">Password</label>
              <InputText
                v-model="signupPassword"
                placeholder="Password"
                class="bg-white/5 border border-white/20 rounded-lg px-4 py-3.5 text-white text-sm placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/10 focus:outline-none"
                type="password"
                required
              />
            </div>

            <div class="flex items-center gap-2 my-2">
              <input type="checkbox" id="rememberMe" v-model="rememberMe" class="w-4 h-4 bg-white/5 border border-white/20 rounded accent-purple-500" />
              <label for="rememberMe" class="text-white/80 text-sm cursor-pointer">Remember me</label>
            </div>

            <Button
              type="submit"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-lg py-3.5 px-6 text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="!signupEmail || !signupPassword"
            >
              <i class="pi pi-user"></i>
              Sign In
            </Button>

            <p class="text-center text-white/60 text-sm mt-4 mb-0">
              Already have an account? <a href="#" @click.prevent="switchToSignin" class="text-purple-400 no-underline font-medium hover:text-purple-300 hover:underline">Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- Terms of Service Modal -->
    <div v-if="showTermsModal" class="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] z-[1000] flex items-center justify-center p-8 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(75,0,130,0.05)_0%,transparent_50%)] before:pointer-events-none" @click="closeTermsModal">
      <div class="bg-slate-700/95 backdrop-blur-[20px] border border-white/10 rounded-xl max-w-lg w-full relative shadow-2xl" @click.stop>
        <div class="flex items-center justify-between px-8 py-6 pb-4 border-b border-white/10">
          <h2 class="text-white text-xl font-semibold m-0">Terms of Service</h2>
          <button class="absolute top-4 right-4 bg-none border-none text-white/60 text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 hover:text-white/90" @click="closeTermsModal">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="px-8 py-6 pb-8">
          <p class="text-white/90 text-sm leading-relaxed mb-6 mt-0">
            To create your PhoneBurner account and start your free trial, please review and agree to our policies.
          </p>

          <div class="flex items-start gap-3 mb-8 p-4 bg-white/5 border border-white/10 rounded-lg">
            <input
              type="checkbox"
              id="agreeTerms"
              v-model="agreeToTerms"
              class="w-[18px] h-[18px] bg-white/5 border border-white/20 rounded accent-purple-500 mt-0.5 flex-shrink-0"
            />
            <label for="agreeTerms" class="text-white/90 text-sm leading-relaxed cursor-pointer">
              I agree with PhoneBurner's
              <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">terms of service</a>,
              <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">privacy policy</a>
              and <a href="#" class="text-blue-400 no-underline hover:text-blue-300 hover:underline">acceptable use policy</a>.
            </label>
          </div>

          <div class="flex gap-4 justify-end">
            <Button
              class="bg-transparent border border-white/30 text-white/80 px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5 hover:border-white/50 hover:text-white"
              @click="handleTermsCancel"
            >
              Cancel
            </Button>
            <Button
              class="bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              @click="handleTermsAgree"
              :disabled="!agreeToTerms"
            >
              Agree and Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'

// Toast functionality (only for login/vulcan actions)
const toast = useToast()

// Reactive data
const chatMessage = ref('')
const fileUpload = ref()
const fileInput = ref()
const chatMessages = ref()
const hasUploadedFile = ref(false)
const showSignupButtons = ref(false)
const showSignupModal = ref(false)
const showTermsModal = ref(false)
const isSignedIn = ref(false)
const showActionButtons = ref(false)
const signupEmail = ref('')
const signupPassword = ref('')
const rememberMe = ref(false)
const agreeToTerms = ref(false)

// Chat messages array
const messages = ref([
  {
    type: 'ai',
    content: [
      'Welcome to PhoneBurner\'s new product called <strong>ARKON</strong>.',
      'I\'m here to help you start calling smarter.',
      'Drop your contact file here and I\'ll show you exactly who\'s most likely to pick up right now.'
    ]
  }
])

// Helper function to scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// Helper function to add AI message
const addAIMessage = (content) => {
  const contentArray = Array.isArray(content) ? content : [content]
  messages.value.push({
    type: 'ai',
    content: contentArray
  })
  scrollToBottom()
}

// Helper function to add user message
const addUserMessage = (content) => {
  messages.value.push({
    type: 'user',
    content: [content]
  })
  scrollToBottom()
}

// Methods
const handleLogin = () => {
  toast.add({
    severity: 'info',
    summary: 'Login',
    detail: 'Login functionality coming soon!',
    life: 3000
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

const triggerFileInput = () => {
  // Simulate file upload instead of opening file dialog
  simulateFileUpload()
}

const onFileInputChange = (event) => {
  // This won't be called since we're simulating the upload
  const file = event.target.files[0]
  if (file) {
    onFileSelect({ files: [file] })
  }
}

const simulateFileUpload = () => {
  // Go directly to signup prompt
  addAIMessage('Great! To get your free trial started and see it in action, how would you like to sign up?')
  showSignupButtons.value = true
}

const onFileSelect = (event) => {
  const file = event.files[0]
  if (file) {
    addAIMessage(`Great! I received your file: <strong>${file.name}</strong>. Let me analyze your contacts...`)

    // Simulate AI analysis
    setTimeout(() => {
      addAIMessage([
        'Analysis complete! 📊',
        'I found <strong>847 contacts</strong> in your file.',
        '<strong>23 contacts</strong> are most likely to pick up right now based on optimal calling times.',
        'Would you like me to start calling them, or would you prefer to see the list first?'
      ])
    }, 2000)
  }
}

const onFileUpload = (event) => {
  // Handled in onFileSelect
}

const onDrop = (event) => {
  event.preventDefault()
  // Simulate file upload instead of processing actual files
  simulateFileUpload()
}

const onDragOver = (event) => {
  event.preventDefault()
}

const onDragLeave = (event) => {
  event.preventDefault()
}

const sendMessage = () => {
  if (chatMessage.value.trim()) {
    const message = chatMessage.value.trim()

    // Add user message
    addUserMessage(message)

    // Clear input
    chatMessage.value = ''

    // Simulate AI processing
    setTimeout(() => {
      if (message.toLowerCase().includes('jenn')) {
        addAIMessage([
          'Found Jenn! 🎯',
          'I found <strong>Jenn Peterson</strong> in your contacts.',
          'She has an <strong>89% pickup rate</strong> and is most likely available now.',
          'Ready to call Jenn?'
        ])
      } else if (message.toLowerCase().includes('call') || message.toLowerCase().includes('start')) {
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
}

const handleVoiceInput = () => {
  addAIMessage('🎤 Listening... (voice recognition simulated)')

  // Simulate voice input
  setTimeout(() => {
    chatMessage.value = "Call my highest priority contacts"
    addAIMessage('Voice captured! I heard: "Call my highest priority contacts"')
  }, 2000)
}

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
  signupEmail.value = ''
  signupPassword.value = ''
  rememberMe.value = false
}

const handleSignupSubmit = () => {
  // Close signup modal and show terms modal
  closeSignupModal()
  showTermsModal.value = true
}

const switchToSignin = () => {
  // Could implement signin modal here
  addAIMessage('Sign in functionality would redirect to login page.')
}

const closeTermsModal = () => {
  showTermsModal.value = false
  agreeToTerms.value = false
}

const handleTermsCancel = () => {
  closeTermsModal()
  // Could optionally show signup modal again
}

const handleTermsAgree = () => {
  if (agreeToTerms.value) {
    closeTermsModal()
    isSignedIn.value = true
    showActionButtons.value = true
    addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')
  }
}

const handleActionButton = (action) => {
  // Hide action buttons after selection
  showActionButtons.value = false

  // Add user message showing their selection
  addUserMessage(`I want to ${action.toLowerCase()}`)

  // Add AI response based on the action
  setTimeout(() => {
    let response = []
    const sampleContacts = `
      <div style="margin: 1rem 0; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
              <th style="text-align: left; padding: 0.5rem; color: #60a5fa;">Name</th>
              <th style="text-align: left; padding: 0.5rem; color: #60a5fa;">Phone</th>
              <th style="text-align: left; padding: 0.5rem; color: #60a5fa;">Connect Score</th>
              <th style="text-align: left; padding: 0.5rem; color: #60a5fa;">Best Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; color: #ffffff;">Sarah Johnson</td>
              <td style="padding: 0.5rem; color: #ffffff;">(555) 123-4567</td>
              <td style="padding: 0.5rem; color: #10b981;">92%</td>
              <td style="padding: 0.5rem; color: #ffffff;">2:00 PM</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; color: #ffffff;">Mike Chen</td>
              <td style="padding: 0.5rem; color: #ffffff;">(555) 987-6543</td>
              <td style="padding: 0.5rem; color: #10b981;">89%</td>
              <td style="padding: 0.5rem; color: #ffffff;">10:30 AM</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; color: #ffffff;">Jennifer Martinez</td>
              <td style="padding: 0.5rem; color: #ffffff;">(555) 456-7890</td>
              <td style="padding: 0.5rem; color: #f59e0b;">76%</td>
              <td style="padding: 0.5rem; color: #ffffff;">3:15 PM</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; color: #ffffff;">David Wilson</td>
              <td style="padding: 0.5rem; color: #ffffff;">(555) 321-0987</td>
              <td style="padding: 0.5rem; color: #10b981;">84%</td>
              <td style="padding: 0.5rem; color: #ffffff;">11:00 AM</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; color: #ffffff;">Lisa Thompson</td>
              <td style="padding: 0.5rem; color: #ffffff;">(555) 654-3210</td>
              <td style="padding: 0.5rem; color: #10b981;">91%</td>
              <td style="padding: 0.5rem; color: #ffffff;">1:45 PM</td>
            </tr>
          </tbody>
        </table>
      </div>`

    switch (action) {
      case 'Set Appointments':
        response = [
          'Excellent! Setting appointments is our bread and butter. We\'ll help you fill your calendar.',
          '',
          'Your trial is ready! I\'ve analyzed your contacts and checked phone numbers with Connect Score.',
          'Here\'s a preview of your data. Does this look correct?',
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
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #60a5fa, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 1rem;
  color: #a0a0a0;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-button {
  color: #ffffff !important;
  font-weight: 500;
}

.nav-button.secondary {
  color: #a0a0a0 !important;
}

.nav-button:hover {
  color: #7b68ee !important;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 5;
}

.chat-container-card {
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.conversation-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Chat Messages Area */
.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Message Containers */
.message-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-message {
  justify-content: flex-end;
}

.user-message-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-direction: row-reverse;
}

.ai-message-container {
  justify-content: flex-start;
}

.ai-message-container > div {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
}

/* Avatars */
.ai-avatar, .user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar {
  background: linear-gradient(135deg, #7b68ee, #9932cc);
}

.user-avatar {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.ai-avatar i, .user-avatar i {
  color: white;
  font-size: 1.1rem;
}

/* Message Bubbles */
.message-bubble {
  max-width: 80%;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.ai-message.message-bubble {
  padding: 20px 18px 20px 20px;
}

.user-message-bubble.message-bubble {
  padding: 1.25rem 1.5rem;
}

.ai-message {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px 8px 8px 0;
  font-size: 14px;
}

.user-message-bubble {
  background: linear-gradient(135deg, #7b68ee, #9932cc);
  border-bottom-right-radius: 4px;
  color: white;
}

.message-bubble p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

/* Upload Section */
.upload-section {
  margin: 1.5rem 0;
}

.upload-section-inline {
  max-width: 80%;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
}

.upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 2.5rem 2rem;
  text-align: center;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
}

.upload-area:hover {
  border-color: rgba(123, 104, 238, 0.6);
  background: rgba(255, 255, 255, 0.02);
}

.upload-icon {
  font-size: 2.5rem;
  color: #6b7280;
  margin-bottom: 1rem;
  display: block;
}

.upload-text {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.upload-link {
  color: #60a5fa;
  text-decoration: none;
}

.upload-link:hover {
  color: #93c5fd;
}

.upload-hint {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

/* Action Buttons */
.action-buttons-section {
  margin: 1.5rem 0;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.action-button {
  background: rgba(55, 65, 81, 0.8) !important;
  border: 1px solid rgba(75, 85, 99, 0.6) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  padding: 0.875rem 1rem !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  text-align: center !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(10px) !important;
  min-height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.action-button:hover {
  background: rgba(75, 85, 99, 0.8) !important;
  border-color: rgba(107, 114, 128, 0.8) !important;
  color: #ffffff !important;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .action-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .action-button {
    font-size: 0.8rem !important;
    padding: 0.75rem 0.5rem !important;
  }
}

@media (max-width: 480px) {
  .action-buttons-grid {
    grid-template-columns: 1fr;
  }
}

/* Signup Buttons */
.signup-buttons-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0 1rem 0;
}

.signup-button {
  width: 100%;
  padding: 0.875rem 1.5rem !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.75rem !important;
  transition: all 0.3s ease !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.google-signup {
  background: rgba(234, 67, 53, 0.1) !important;
  color: #ea4335 !important;
  border-color: rgba(234, 67, 53, 0.3) !important;
}

.google-signup:hover {
  background: rgba(234, 67, 53, 0.2) !important;
  border-color: rgba(234, 67, 53, 0.5) !important;
  color: #ffffff !important;
}

.email-signup {
  background: rgba(123, 104, 238, 0.1) !important;
  color: #7b68ee !important;
  border-color: rgba(123, 104, 238, 0.3) !important;
}

.email-signup:hover {
  background: rgba(123, 104, 238, 0.2) !important;
  border-color: rgba(123, 104, 238, 0.5) !important;
  color: #ffffff !important;
}

.signup-button i {
  font-size: 1rem !important;
}

/* Chat Input */
.chat-input-section {
  margin-top: 1rem;
}

.input-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
}

.chat-input {
  flex: 1;
  background: transparent !important;
  border: none !important;
  color: #ffffff !important;
  font-size: 1rem;
  padding: 0.75rem 1rem !important;
}

.chat-input::placeholder {
  color: #a0a0a0;
}

.chat-input:focus {
  box-shadow: none !important;
}

.mic-button, .send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7b68ee !important;
  transition: all 0.3s ease;
}

.mic-button:hover, .send-button:hover {
  background: rgba(123, 104, 238, 0.2) !important;
  color: #ffffff !important;
}

.send-button:disabled {
  opacity: 0.5;
  color: #666 !important;
}

/* Signup Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
    linear-gradient(135deg, #1a1a2e 0%, #141A2A 50%, #0f0f23 100%);
  background-size: 20px 20px, 100% 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(75, 0, 130, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.signup-modal {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.25rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.modal-content {
  text-align: center;
}

.modal-logo {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.modal-logo-icon {
  width: 40px;
  height: 40px;
}

.modal-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-input {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  padding: 0.875rem 1rem !important;
  color: #ffffff !important;
  font-size: 0.9rem !important;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
}

.form-input:focus {
  border-color: rgba(123, 104, 238, 0.5) !important;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.1) !important;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.form-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  accent-color: #7b68ee;
}

.form-checkbox label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  cursor: pointer;
}

.signup-submit-button {
  width: 100% !important;
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.875rem 1.5rem !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  margin-top: 0.5rem !important;
  transition: all 0.3s ease !important;
}

.signup-submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca, #6d28d9) !important;
  transform: translateY(-1px);
}

.signup-submit-button:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.signin-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 1rem 0 0 0;
}

.signin-link a {
  color: #7b68ee;
  text-decoration: none;
  font-weight: 500;
}

.signin-link a:hover {
  color: #9f7aea;
  text-decoration: underline;
}

/* Terms of Service Modal */
.terms-modal {
  background: rgba(37, 47, 63, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.terms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terms-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.terms-content {
  padding: 1.5rem 2rem 2rem 2rem;
}

.terms-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.terms-checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.terms-checkbox {
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  accent-color: #7b68ee;
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-checkbox-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
}

.terms-link {
  color: #60a5fa;
  text-decoration: none;
}

.terms-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

.terms-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.terms-cancel-button {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 6px !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.terms-cancel-button:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: #ffffff !important;
}

.terms-agree-button {
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  border: none !important;
  color: #ffffff !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 6px !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.terms-agree-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca, #6d28d9) !important;
  transform: translateY(-1px);
}

.terms-agree-button:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 1.5rem;
  color: #666;
  font-size: 0.875rem;
  position: relative;
  z-index: 5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .nav-actions {
    order: -1;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .ai-message-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .upload-area {
    padding: 2rem 1rem;
  }
  
  .upload-icon {
    font-size: 2.5rem;
  }
}

/* Custom PrimeVue overrides */
:deep(.p-fileupload) {
  background: transparent;
  border: none;
}

:deep(.p-fileupload-buttonbar) {
  display: none;
}

:deep(.p-fileupload-content) {
  background: transparent;
  border: none;
  padding: 0;
}
</style>
