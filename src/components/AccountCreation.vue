<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 account-background">
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
      <DSButton
        variant="primary"
        size="large"
        class="w-full mb-8 py-3"
        @click="handleGoogleSignup"
      >
        <div class="flex items-center justify-center gap-3">
          <i class="pi pi-google text-lg"></i>
          <span>Sign up with Google</span>
        </div>
      </DSButton>

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
import { DSButton } from '@/design-system/components'

// Define emits
const emit = defineEmits(['close', 'switch-to-signin', 'show-terms'])

// Methods
const handleGoogleSignup = () => {
  emit('show-terms')
}
</script>

<style scoped>
/* Background pattern */
.account-background {
  background-color: #242733;
  background-image:
    /* A vignette to create the radial gradient effect for the dots */
    radial-gradient(ellipse at center, transparent 0%, rgba(36, 39, 51, 0.8) 80%),
    /* The dot pattern */
    radial-gradient(circle, #5D5F69 1px, transparent 1px);
  background-size: 100% 100%, 16px 16px;
}

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
