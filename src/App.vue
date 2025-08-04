<template>
  <div class="arkon-app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <i class="pi pi-compass logo-icon"></i>
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

          <!-- AI Welcome Message -->
          <div class="ai-message-container">
            <div class="ai-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="ai-message">
              <p>Welcome to PhoneBurner's new product called <strong>ARKON</strong>.</p>
              <p>I'm here to help you start calling smarter.</p>
              <p>Drop your contact file here and I'll show you exactly who's most likely to pick up right now.</p>
            </div>
          </div>

          <!-- File Upload Area -->
          <div class="upload-section">
            <FileUpload
              ref="fileUpload"
              mode="basic"
              :auto="false"
              :multiple="false"
              accept=".csv,.xls,.xlsx"
              :maxFileSize="10000000"
              @select="onFileSelect"
              @upload="onFileUpload"
              class="custom-file-upload"
              chooseLabel="Click to upload or drag and drop"
            >
              <template #empty>
                <div class="upload-area" @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave">
                  <i class="pi pi-cloud-upload upload-icon"></i>
                  <p class="upload-text">Click to upload or drag and drop</p>
                  <p class="upload-hint">CSV, XLS or XLSX files</p>
                </div>
              </template>
            </FileUpload>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'

// Toast functionality
const toast = useToast()

// Reactive data
const chatMessage = ref('')
const fileUpload = ref()

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

const onFileSelect = (event) => {
  const file = event.files[0]
  if (file) {
    toast.add({ 
      severity: 'success', 
      summary: 'File Selected', 
      detail: `Selected: ${file.name}`, 
      life: 3000 
    })
    // Simulate AI analysis
    setTimeout(() => {
      toast.add({ 
        severity: 'success', 
        summary: 'AI Analysis Complete', 
        detail: 'I found 847 contacts. 23 are most likely to pick up right now!', 
        life: 5000 
      })
    }, 2000)
  }
}

const onFileUpload = (event) => {
  toast.add({ 
    severity: 'success', 
    summary: 'File Uploaded', 
    detail: 'Processing your contacts...', 
    life: 3000 
  })
}

const onDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.name.match(/\.(csv|xls|xlsx)$/)) {
      onFileSelect({ files: [file] })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Invalid File', 
        detail: 'Please upload CSV, XLS, or XLSX files only', 
        life: 3000 
      })
    }
  }
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
    
    // Simulate AI response
    toast.add({ 
      severity: 'info', 
      summary: 'AI Assistant', 
      detail: `I heard you say: "${message}". Let me help you with that!`, 
      life: 4000 
    })
    
    // Clear input
    chatMessage.value = ''
    
    // Simulate AI processing
    setTimeout(() => {
      if (message.toLowerCase().includes('jenn')) {
        toast.add({ 
          severity: 'success', 
          summary: 'Found Jenn!', 
          detail: 'I found Jenn Peterson in your contacts. She has an 89% pickup rate. Ready to call?', 
          life: 5000 
        })
      } else {
        toast.add({ 
          severity: 'info', 
          summary: 'AI Assistant', 
          detail: 'I can help you find contacts, start calling, or analyze your data. What would you like to do?', 
          life: 4000 
        })
      }
    }, 1500)
  }
}

const handleVoiceInput = () => {
  toast.add({ 
    severity: 'info', 
    summary: 'Voice Input', 
    detail: 'Voice recognition starting... (simulated)', 
    life: 3000 
  })
  
  // Simulate voice input
  setTimeout(() => {
    chatMessage.value = "Call my highest priority contacts"
    toast.add({ 
      severity: 'success', 
      summary: 'Voice Recognized', 
      detail: 'Voice input captured!', 
      life: 2000 
    })
  }, 2000)
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
  font-size: 1.5rem;
  color: #7b68ee;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
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

.conversation-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* AI Message */
.ai-message-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7b68ee, #9932cc);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar i {
  color: white;
  font-size: 1.1rem;
}

.ai-message {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  flex: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.ai-message p {
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
}

.ai-message p:last-child {
  margin-bottom: 0;
}

/* Upload Section */
.upload-section {
  margin: 1rem 0;
}

.custom-file-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed rgba(123, 104, 238, 0.5);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: rgba(123, 104, 238, 0.8);
  background: rgba(255, 255, 255, 0.08);
}

.upload-icon {
  font-size: 3rem;
  color: #7b68ee;
  margin-bottom: 1rem;
  display: block;
}

.upload-text {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.upload-hint {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 0;
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
  border-radius: 50px;
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
