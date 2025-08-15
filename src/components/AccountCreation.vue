<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-slate-800 rounded-2xl p-8 max-w-md w-full relative shadow-2xl border border-slate-700">
      <!-- Close Button -->
      <button 
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
        @click="$emit('close')"
      >
        <i class="pi pi-times text-lg"></i>
      </button>

      <!-- Title -->
      <h2 class="text-white text-2xl font-semibold mb-8 text-center">Create your account</h2>

      <!-- Google Sign Up Button -->
      <Button
        class="btn-primary w-full mb-8 py-3 rounded-lg"
        @click="handleGoogleSignup"
      >
        <div class="flex items-center justify-center gap-3">
          <i class="pi pi-google text-lg"></i>
          <span>Sign up with Google</span>
        </div>
      </Button>

      <!-- Description Text -->
      <p class="text-center text-slate-400 text-sm mb-6 leading-relaxed">
        Create your ARKON account quickly and securely with Google.
        We'll get you started with your AI calling assistant in seconds.
      </p>

      <!-- Sign In Link -->
      <p class="text-center text-slate-400 text-sm mt-6">
        Have an account already? 
        <button 
          class="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
          @click="$emit('switch-to-signin')"
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'

// Reactive data
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

// Define emits
const emit = defineEmits(['close', 'switch-to-signin', 'account-created', 'google-signup', 'show-terms'])

// Computed properties
const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value &&
         email.value.includes('@')
})

// Methods
const handleGoogleSignup = () => {
  emit('show-terms')
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  // Emit account creation with form data
  emit('account-created', {
    email: email.value,
    password: password.value
  })
}
</script>

<style scoped>
/* Custom styles for dark theme */
:deep(.p-password-input) {
  background-color: rgb(15 23 42) !important;
  border-color: rgb(71 85 105) !important;
  color: white !important;
}

:deep(.p-password-input:focus) {
  border-color: rgb(59 130 246) !important;
  box-shadow: none !important;
}

:deep(.p-password-input::placeholder) {
  color: rgb(148 163 184) !important;
}

:deep(.p-checkbox .p-checkbox-box) {
  background-color: rgb(15 23 42) !important;
  border-color: rgb(71 85 105) !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: rgb(59 130 246) !important;
  border-color: rgb(59 130 246) !important;
}

:deep(.p-inputtext) {
  background-color: rgb(15 23 42) !important;
  border-color: rgb(71 85 105) !important;
  color: white !important;
}

:deep(.p-inputtext:focus) {
  border-color: rgb(59 130 246) !important;
  box-shadow: none !important;
}

:deep(.p-inputtext::placeholder) {
  color: rgb(148 163 184) !important;
}
</style>
