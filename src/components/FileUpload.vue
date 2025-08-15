<template>
  <div class="w-full mt-4 flex flex-col justify-start items-start gap-4">
    <div
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      class="w-full h-32 bg-gray-700/50 border border-gray-500 rounded-lg relative cursor-pointer hover:bg-gray-700/70 transition-all duration-300 flex items-center justify-center"
      tabindex="3"
      role="button"
      aria-label="Click or drag and drop to upload contact file"
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
    // Don't emit file-dropped here to avoid duplicate handling
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
/* Custom file upload styles */
.file-upload-area {
  background-color: rgba(31, 41, 55, 0.5);
  border: 1px solid rgb(75, 85, 99);
}

.file-upload-area:hover {
  background-color: rgba(31, 41, 55, 0.7);
}

/* Ensure the hidden input doesn't interfere */
input[type="file"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
