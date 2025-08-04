<template>
  <div class="arkon-app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <defs>
              <linearGradient id="arkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#arkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
          </svg>
          <span class="logo-text">ARKON</span>
        </div>
        
        <div class="tagline">
          Calling made smarter
        </div>
        
        <div class="nav-actions">
          <Button 
            label="Login" 
            text 
            class="nav-button"
            @click="handleLogin"
          />
          <Button 
            label="Switch to Vulcan?" 
            text 
            class="nav-button secondary"
            @click="handleSwitchToVulcan"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="chat-container-card">
        <div class="conversation-container">

          <!-- Chat Messages Area -->
          <div class="chat-messages" ref="chatMessages">
            <template v-for="(message, index) in messages" :key="index">
              <div :class="['message-container', message.type === 'user' ? 'user-message' : 'ai-message-container']">
                <div v-if="message.type === 'ai'">
                  <div class="ai-avatar">
                    <i class="pi pi-robot"></i>
                  </div>
                  <div :class="['message-bubble', 'ai-message']">
                    <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
                  </div>
                </div>
                <div v-else class="user-message-wrapper">
                  <div class="user-avatar">
                    <i class="pi pi-user"></i>
                  </div>
                  <div :class="['message-bubble', 'user-message-bubble']">
                    <p v-for="(line, lineIndex) in message.content" :key="lineIndex" v-html="line"></p>
                  </div>
                </div>
              </div>

              <!-- File Upload Area - shown after first message (welcome message) only -->
              <div v-if="index === 0" class="upload-section-inline">
                <div class="upload-area" @click="triggerFileInput" @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave">
                  <i class="pi pi-cloud-upload upload-icon"></i>
                  <p class="upload-text">
                    <span class="upload-link">Click to upload</span> or drag and drop
                  </p>
                  <p class="upload-hint">CSV, XLS, or XLSX files</p>
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

          <!-- Signup Buttons -->
          <div v-if="showSignupButtons" class="signup-buttons-section">
            <Button
              class="signup-button google-signup"
              @click="handleGoogleSignup"
            >
              <i class="pi pi-google"></i>
              Continue with Google
            </Button>
            <Button
              class="signup-button email-signup"
              @click="handleEmailSignup"
            >
              <i class="pi pi-envelope"></i>
              Continue with Email
            </Button>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-section">
            <div class="input-container">
              <InputText
                v-model="chatMessage"
                placeholder="Ask me to talk to Jenn"
                class="chat-input"
                @keyup.enter="sendMessage"
              />
              <Button
                icon="pi pi-microphone"
                class="mic-button"
                text
                @click="handleVoiceInput"
              />
              <Button
                icon="pi pi-send"
                class="send-button"
                @click="sendMessage"
                :disabled="!chatMessage.trim()"
              />
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2024 PhoneBurner. All rights reserved.</p>
    </footer>

    <!-- Toast for notifications -->
    <Toast />

    <!-- Signup Modal -->
    <div v-if="showSignupModal" class="modal-overlay" @click="closeSignupModal">
      <div class="signup-modal" @click.stop>
        <button class="modal-close-button" @click="closeSignupModal">
          <i class="pi pi-times"></i>
        </button>

        <div class="modal-content">
          <div class="modal-logo">
            <svg class="modal-logo-icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
              <defs>
                <linearGradient id="modalArkonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path fill="url(#modalArkonGradient)" d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
            </svg>
          </div>

          <h2 class="modal-title">Create Free Account</h2>

          <form class="signup-form" @submit.prevent="handleSignupSubmit">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <InputText
                v-model="signupEmail"
                placeholder="Email address"
                class="form-input"
                type="email"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <InputText
                v-model="signupPassword"
                placeholder="Password"
                class="form-input"
                type="password"
                required
              />
            </div>

            <div class="form-checkbox">
              <input type="checkbox" id="rememberMe" v-model="rememberMe" />
              <label for="rememberMe">Remember me</label>
            </div>

            <Button
              type="submit"
              class="signup-submit-button"
              :disabled="!signupEmail || !signupPassword"
            >
              <i class="pi pi-user"></i>
              Sign In
            </Button>

            <p class="signin-link">
              Already have an account? <a href="#" @click.prevent="switchToSignin">Sign In</a>
            </p>
          </form>
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
const signupEmail = ref('')
const signupPassword = ref('')
const rememberMe = ref(false)

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
  // Simulate successful signup
  closeSignupModal()
  addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session!')
}

const switchToSignin = () => {
  // Could implement signin modal here
  addAIMessage('Sign in functionality would redirect to login page.')
}
</script>

<style scoped>
.arkon-app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
    linear-gradient(135deg, #1a1a2e 0%, #141A2A 50%, #0f0f23 100%);
  background-size: 20px 20px, 100% 100%;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.arkon-app::before {
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

/* Header */
.app-header {
  position: relative;
  z-index: 10;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #1f2937;
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
