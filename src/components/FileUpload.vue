<template>
  <div class="max-w-[90%] my-6 flex flex-col justify-start items-start gap-4">
    <div
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      class="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg relative cursor-pointer hover:bg-gray-800/70 transition-all duration-300 flex items-center justify-center"
    >
      <!-- Plus icon in top left -->
      <div class="absolute top-3 left-3">
        <i class="pi pi-plus text-gray-400 text-lg"></i>
      </div>

      <!-- Center content -->
      <div class="flex flex-col items-center">
        <!-- Upload icon in circle -->
        <div class="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center mb-3">
          <i class="pi pi-cloud-upload text-gray-400 text-lg"></i>
        </div>

        <!-- Upload text -->
        <p class="text-gray-300 text-sm">
          Drag and drop your contact file to here to upload.
        </p>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept=".csv,.xls,.xlsx"
        @change="onFileInputChange"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define emits
const emit = defineEmits(['trigger-upload', 'file-selected', 'file-dropped'])

// Template refs
const fileInput = ref<HTMLInputElement | null>(null)

// Methods
const triggerFileInput = (): void => {
  fileInput.value?.click()
}

const onFileInputChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-selected', file)
    emit('file-dropped', file)
  }
}

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault()
  event.stopPropagation()
}

const handleDragLeave = (event: DragEvent): void => {
  event.preventDefault()
  event.stopPropagation()
}

const handleDrop = (event: DragEvent): void => {
  event.preventDefault()
  event.stopPropagation()

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    // Check file type
    const allowedTypes = ['.csv', '.xls', '.xlsx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (allowedTypes.includes(fileExtension)) {
      emit('file-selected', file)
      emit('file-dropped', file)
    }
  }
}

// Expose triggerFileInput method to parent for backward compatibility
defineExpose({
  triggerFileInput
})
</script>

<style scoped>
/* Override PrimeVue FileUpload styles to match our dark theme */
:deep(.p-fileupload-basic) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.p-fileupload-basic .p-button) {
  background: transparent !important;
  border: 2px dashed rgba(255, 255, 255, 0.3) !important;
  border-radius: 0.5rem !important;
  padding: 2.5rem !important;
  color: white !important;
  width: 100% !important;
  transition: all 0.3s ease !important;
}

:deep(.p-fileupload-basic .p-button:hover) {
  border-color: rgba(168, 85, 247, 0.6) !important;
  background: rgba(255, 255, 255, 0.02) !important;
}

:deep(.p-fileupload-basic .p-button:focus) {
  box-shadow: none !important;
  border-color: rgba(168, 85, 247, 0.6) !important;
}

:deep(.p-fileupload-basic .p-button .p-button-label) {
  display: none !important;
}
</style>
