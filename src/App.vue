<template>
  <!-- Test change for PR functionality -->
  <div class="min-h-screen text-white flex flex-col relative overflow-x-hidden" style="background-image: url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F3a359e22506049ea806e50e85c0e7711?format=webp&width=800'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    
    <!-- Header -->
    <Header 
      @login="handleLogin"
      @switch-to-vulcan="handleSwitchToVulcan"
    />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-8 relative z-[5]">
      <div class="max-w-[900px] w-full bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-xl p-5 shadow-2xl">
        <div class="w-full flex flex-col gap-8">

          <!-- Chat Messages Area -->
          <div class="max-h-[900px] overflow-y-auto flex flex-col mb-4 pr-2 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50" ref="chatMessages">
            <template v-for="(message, index) in messages" :key="index">
              <ChatMessage :message="message" />

              <!-- File Upload Area - shown after first message (welcome message) only -->
              <FileUpload 
                v-if="index === 0" 
                @trigger-upload="simulateFileUpload"
                @file-selected="onFileSelect"
                @file-dropped="simulateFileUpload"
              />
            </template>
          </div>

          <!-- Action Buttons -->
          <ActionButtons 
            v-if="showActionButtons"
            @action-selected="handleActionButton"
          />

          <!-- Signup Buttons -->
          <SignupButtons 
            v-if="showSignupButtons && !isSignedIn"
            @google-signup="handleGoogleSignup"
            @email-signup="handleEmailSignup"
          />

          <!-- Chat Input -->
          <ChatInput 
            ref="chatInputRef"
            @send-message="sendMessage"
            @voice-input="handleVoiceInput"
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

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type Ref } from 'vue'
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
import Footer from './components/Footer.vue'

// PrimeVue Components
import Toast from 'primevue/toast'

// Types
interface Message {
  type: 'ai' | 'user'
  content: string[]
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
const isSignedIn = ref<boolean>(false)
const showActionButtons = ref<boolean>(false)

// Chat messages array
const messages: Ref<Message[]> = ref([
  {
    type: 'ai',
    content: [
      'Welcome to PhoneBurner\'s new product called <strong>ARKON</strong>.<br><br>I\'m here to help you start calling smarter.<br><br>Drop your contact file here and I\'ll show you exactly who\'s most likely to pick up right now.'
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

// Header Methods
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

// File Upload Methods
const simulateFileUpload = () => {
  // Go directly to signup prompt
  addAIMessage('Great! To get your free trial started and see it in action, how would you like to sign up?')
  showSignupButtons.value = true
}

const onFileSelect = (file: File): void => {
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

// Chat Input Methods
const sendMessage = (message: string): void => {
  // Add user message
  addUserMessage(message)

  // Simulate AI processing
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
        '• Smart call disposition and follow-up automation',
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
        'Found Jenn! 🎯',
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
  // Could implement signin modal here
  addAIMessage('Sign in functionality would redirect to login page.')
}

// Terms Modal Methods
const closeTermsModal = () => {
  showTermsModal.value = false
}

const handleTermsCancel = () => {
  closeTermsModal()
  // Could optionally show signup modal again
}

const handleTermsAgree = () => {
  closeTermsModal()
  isSignedIn.value = true
  showActionButtons.value = true
  addAIMessage('🎉 Welcome to ARKON! Your account has been created successfully. Let\'s start your first smart calling session! What are you trying to accomplish?')
}

// Action Button Methods
const handleActionButton = (action: string): void => {
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
