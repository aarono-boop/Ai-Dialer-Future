<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <div class="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Create New Coach</h1>
          <Button
            label="Coach Management"
            icon="pi pi-users"
            severity="secondary"
            size="small"
            @click="navigateToManagement"
            class="text-gray-400 hover:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Section -->
        <div class="space-y-6">
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
              rows="4"
              class="w-full"
              placeholder="Leave empty to use default message format"
            />
            <small class="text-gray-400">
              Default: "Welcome to ARKON! I'm your AI calling assistant, enhanced with [Coach Name]'s proven methodologies."
            </small>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="space-y-6">
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <i class="pi pi-eye"></i>
              Preview
            </h3>
            
            <!-- Coach Card Preview -->
            <div v-if="formData.displayName" class="space-y-4">
              <!-- Coach Info Card -->
              <div class="bg-gray-700 rounded-lg p-4">
                <div class="flex gap-3 items-center mb-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="imagePreview"
                      :src="imagePreview"
                      :alt="formData.displayName"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold"
                    >
                      {{ getInitials(formData.displayName) }}
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white">{{ formData.displayName }}</h4>
                    <p class="text-sm text-gray-400">AI Sales Coach</p>
                  </div>
                </div>
                
                <!-- URL Preview -->
                <div class="text-xs text-gray-400 bg-gray-800 rounded px-3 py-2">
                  ?coach={{ generateCoachId(formData.displayName) }}
                </div>
              </div>

              <!-- Welcome Message Preview with Video -->
              <div class="bg-gray-700 rounded-lg p-4">
                <h5 class="text-sm font-semibold text-gray-300 mb-2">Welcome Message:</h5>
                <div class="bg-gray-800/90 border border-white/20 rounded-lg p-3 text-sm">
                  <div v-html="previewMessage"></div>

                  <!-- Video Preview embedded in welcome message -->
                  <div v-if="extractedVideoId" class="mt-4">
                    <div class="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                      <iframe
                        :src="`https://www.youtube.com/embed/${extractedVideoId}`"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        class="w-full h-full"
                        :title="`Preview of ${formData.displayName}'s video`"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <i class="pi pi-user text-4xl text-gray-500 mb-3"></i>
              <p class="text-gray-400">Enter a coach name to see preview</p>
            </div>
          </div>

          <!-- Help Section -->
          <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 class="font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <i class="pi pi-info-circle"></i>
              Tips for Creating a Coach
            </h4>
            <ul class="text-sm text-blue-200 space-y-1">
              <li>• Use the coach's full professional name</li>
              <li>• YouTube videos should showcase their expertise</li>
              <li>• High-quality avatars work best (square format recommended)</li>
              <li>• Keep welcome messages conversational and authentic</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Button at Bottom -->
      <div class="max-w-4xl mx-auto px-6 py-6 border-t border-gray-700">
        <div class="flex justify-center">
          <Button
            label="Create New Coach"
            :loading="isCreating"
            @click="handleCreate"
            :disabled="!canCreate"
            size="large"
            class="px-8 py-3 text-lg font-semibold"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { CoachCreateData } from '../types/coach'
import { generateCoachId, extractYouTubeVideoId } from '../config/coaches'

// Emits
const emit = defineEmits<{
  'coach-created': [coach: CoachCreateData]
  'cancel': []
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

  return formData.value.customMessage ||
    `Welcome to <strong>ARKON</strong>! I'm your AI calling assistant, enhanced with <strong>${formData.value.displayName}'s</strong> proven methodologies.`
})

// Utility functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

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

watch(() => formData.value.websiteUrl, (newValue) => {
  if (!newValue) {
    delete errors.value.websiteUrl
    return
  }
  try {
    const u = new URL(newValue)
    if (!u.protocol.startsWith('http')) throw new Error('invalid')
    delete errors.value.websiteUrl
  } catch {
    errors.value.websiteUrl = 'Please enter a valid website URL (https://...)'
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
    
    // Reset form
    resetForm()
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

const handleCancel = () => {
  emit('cancel')
}

const navigateToManagement = () => {
  // Navigate to coach management page
  const url = new URL(window.location.href)
  url.searchParams.delete('create-coach')
  url.searchParams.set('coach-admin', 'true')
  window.location.href = url.toString()
}

// Focus the first input on mount
onMounted(() => {
  const firstInput = document.getElementById('coachName')
  if (firstInput) {
    firstInput.focus()
  }
})
</script>

<style scoped>
/* Ensure proper text colors in dark theme */
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

:deep(.p-button.p-button-text) {
  color: #9ca3af;
}

:deep(.p-button.p-button-text:hover) {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
