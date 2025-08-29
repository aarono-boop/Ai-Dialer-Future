<template>
  <div class="w-full mt-4 flex flex-col justify-start items-start gap-4">
    <div
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      class="upload-area"
      tabindex="3"
      role="button"
      aria-label="Click or drag and drop to upload contact file"
    >
      <!-- Plus icon in top left -->
      <div class="upload-plus-icon">
        <i class="pi pi-plus"></i>
      </div>

      <!-- Center content -->
      <div class="upload-center">
        <!-- Upload icon in circle -->
        <div class="upload-icon-circle">
          <i class="pi pi-cloud-upload"></i>
        </div>

        <!-- Upload text -->
        <p class="upload-text">
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
/* Custom file upload styles using PrimeVue design tokens */
.upload-area {
  width: 100%;
  height: 8rem;
  background: var(--p-surface-800);
  border: 1px solid var(--p-surface-600);
  border-radius: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  background: var(--p-surface-700);
  border-color: var(--p-surface-500);
}

.upload-area:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--p-primary-color);
}

.upload-plus-icon {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  color: var(--p-surface-400);
  font-size: 1.125rem;
}

.upload-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.upload-icon-circle {
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--p-surface-400);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: var(--p-surface-400);
  font-size: 1.125rem;
}

.upload-text {
  color: var(--p-surface-300);
  font-size: 0.875rem;
  margin: 0;
}

/* Ensure the hidden input doesn't interfere */
.hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
