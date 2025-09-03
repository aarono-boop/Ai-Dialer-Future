<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Create New Coach"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="onClose"
  >
    <div class="flex flex-col gap-6">
      <!-- Coach Name -->
      <div class="flex flex-col gap-2">
        <label for="coachName" class="font-semibold text-white">Coach Name</label>
        <InputText
          id="coachName"
          v-model="formData.displayName"
          placeholder="Enter coach's full name (e.g., Jordan Stupar)"
          class="w-full"
          :invalid="!!errors.displayName"
        />
        <small v-if="errors.displayName" class="text-red-400">{{ errors.displayName }}</small>
        <small v-if="formData.displayName" class="text-gray-400">
          URL will be: ?coach={{ generateCoachId(formData.displayName) }}
        </small>
      </div>

      <!-- YouTube Video URL -->
      <div class="flex flex-col gap-2">
        <label for="videoUrl" class="font-semibold text-white">YouTube Video URL (Optional)</label>
        <InputText
          id="videoUrl"
          v-model="formData.videoUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          class="w-full"
          :invalid="!!errors.videoUrl"
        />
        <small v-if="errors.videoUrl" class="text-red-400">{{ errors.videoUrl }}</small>
        <small v-if="extractedVideoId" class="text-green-400">
          ✓ Video ID detected: {{ extractedVideoId }}
        </small>
      </div>

      <!-- Avatar Image Upload -->
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-white">Coach Avatar (Optional)</label>
        <div
          class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
          @click="triggerFileUpload"
          @dragover.prevent
          @drop="handleImageDrop"
        >
          <div v-if="!imagePreview" class="flex flex-col items-center gap-2">
            <i class="pi pi-cloud-upload text-3xl text-gray-400"></i>
            <p class="text-gray-400">Click or drag to upload coach image</p>
            <small class="text-gray-500">PNG, JPG up to 2MB</small>
          </div>
          <div v-else class="flex flex-col items-center gap-2">
            <img :src="imagePreview" alt="Coach preview" class="w-16 h-16 rounded-full object-cover" />
            <p class="text-gray-400">{{ formData.avatarFile?.name }}</p>
            <Button
              text
              severity="danger"
              size="small"
              @click.stop="removeImage"
              label="Remove"
              icon="pi pi-times"
            />
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageSelect"
        />
        <small v-if="errors.avatarFile" class="text-red-400">{{ errors.avatarFile }}</small>
      </div>

      <!-- Custom Welcome Message -->
      <div class="flex flex-col gap-2">
        <label for="customMessage" class="font-semibold text-white">Custom Welcome Message (Optional)</label>
        <Textarea
          id="customMessage"
          v-model="formData.customMessage"
          rows="3"
          class="w-full"
          placeholder="Leave empty to use default message format"
        />
        <small class="text-gray-400">
          Default: "Welcome to ARKON! I'm your AI calling assistant, enhanced with [Coach Name]'s proven methodologies."
        </small>
      </div>

      <!-- Preview Section -->
      <div v-if="formData.displayName" class="border border-gray-600 rounded-lg p-4">
        <h4 class="font-semibold text-white mb-3">Preview</h4>
        <div class="flex gap-3 items-start">
          <div class="flex-shrink-0">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              :alt="formData.displayName"
              class="w-[26px] h-[26px] rounded-full object-cover"
            />
            <div
              v-else
              class="ai-avatar-gradient w-[26px] h-[26px]"
              style="
                background: linear-gradient(135deg, #60a5fa 0%, #7b68ee 100%);
                mask: url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat;
                -webkit-mask: url('https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F2b49ccc7e5f74919a9a706fa2916dd90?format=webp&width=800') center/contain no-repeat;
              "
            ></div>
          </div>
          <div class="bg-gray-800/90 border border-white/20 rounded-lg p-3 text-sm">
            <div v-html="previewMessage"></div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Cancel"
          severity="secondary"
          @click="onClose"
        />
        <Button
          label="Create Coach"
          :loading="isCreating"
          @click="handleCreate"
          :disabled="!canCreate"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { CoachCreateData } from '../types/coach'
import { generateCoachId, extractYouTubeVideoId } from '../config/coaches'

// Props
const props = defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'coach-created': [coach: CoachCreateData]
  'close': []
}>()

// Toast for notifications
const toast = useToast()

// Form data
const formData = ref<CoachCreateData>({
  name: '',
  displayName: '',
  videoUrl: '',
  avatarFile: undefined,
  customMessage: ''
})

// Form state
const isCreating = ref(false)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Validation errors
const errors = ref<Record<string, string>>({})

// Computed properties
const extractedVideoId = computed(() => {
  if (!formData.value.videoUrl) return null
  return extractYouTubeVideoId(formData.value.videoUrl)
})

const canCreate = computed(() => {
  return formData.value.displayName.trim().length > 0 && Object.keys(errors.value).length === 0
})

const previewMessage = computed(() => {
  if (!formData.value.displayName) return ''
  
  let message = formData.value.customMessage || 
    `Welcome to <strong>ARKON</strong>! I'm your AI calling assistant, enhanced with <strong>${formData.value.displayName}'s</strong> proven methodologies.`
  
  if (extractedVideoId.value) {
    message += `<br><br><div style="padding: 8px; background: #374151; border-radius: 4px; color: #9ca3af; font-size: 12px;">📹 Video will be embedded here</div>`
  }
  
  message += `<br><br>Drop your contact file here and I'll show you exactly who's most likely to pick up right now using ${formData.value.displayName}'s approach.`
  
  return message
})

// Watch for validation
watch(() => formData.value.displayName, (newValue) => {
  if (newValue && newValue.trim().length === 0) {
    errors.value.displayName = 'Coach name is required'
  } else {
    delete errors.value.displayName
  }
})

watch(() => formData.value.videoUrl, (newValue) => {
  if (newValue && !extractYouTubeVideoId(newValue)) {
    errors.value.videoUrl = 'Please enter a valid YouTube URL'
  } else {
    delete errors.value.videoUrl
  }
})

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    validateAndSetImage(file)
  }
}

const handleImageDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetImage(file)
  }
}

const validateAndSetImage = (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errors.value.avatarFile = 'Please select an image file'
    return
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.value.avatarFile = 'Image must be less than 2MB'
    return
  }
  
  // Clear errors and set file
  delete errors.value.avatarFile
  formData.value.avatarFile = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  formData.value.avatarFile = undefined
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    displayName: '',
    videoUrl: '',
    avatarFile: undefined,
    customMessage: ''
  }
  errors.value = {}
  imagePreview.value = null
  isCreating.value = false
}

const handleCreate = async () => {
  if (!canCreate.value) return
  
  isCreating.value = true
  
  try {
    // Set the URL-safe name
    formData.value.name = generateCoachId(formData.value.displayName)
    
    // Emit the coach data
    emit('coach-created', { ...formData.value })
    
    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Coach Created',
      detail: `${formData.value.displayName} has been created successfully!`,
      life: 3000
    })
    
    // Close modal and reset form
    onClose()
  } catch (error) {
    console.error('Error creating coach:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create coach. Please try again.',
      life: 3000
    })
  } finally {
    isCreating.value = false
  }
}

const onClose = () => {
  emit('update:visible', false)
  emit('close')
  // Reset form after a delay to allow dialog to close smoothly
  setTimeout(resetForm, 300)
}
</script>

<style scoped>
/* Ensure proper text colors in dark theme */
:deep(.p-dialog .p-dialog-content) {
  background-color: #1f2937;
  color: white;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: #111827;
  color: white;
  border-bottom: 1px solid #374151;
}

:deep(.p-dialog .p-dialog-footer) {
  background-color: #1f2937;
  border-top: 1px solid #374151;
}

:deep(.p-inputtext) {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

:deep(.p-inputtext:focus) {
  border-color: #60a5fa;
  box-shadow: 0 0 0 0.2rem rgba(96, 165, 250, 0.2);
}

:deep(.p-textarea) {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

:deep(.p-textarea:focus) {
  border-color: #60a5fa;
  box-shadow: 0 0 0 0.2rem rgba(96, 165, 250, 0.2);
}
</style>
