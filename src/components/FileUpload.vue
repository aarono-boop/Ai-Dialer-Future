<template>
  <div class="w-full mt-4 flex flex-col justify-start items-start gap-4">
    <!-- PrimeVue FileUpload Component -->
    <FileUpload
      mode="basic"
      name="contacts"
      :auto="false"
      accept=".csv,.xls,.xlsx"
      :maxFileSize="10000000"
      @select="onFileSelect"
      @clear="onClear"
      :customUpload="true"
      class="w-full"
    >
      <template #empty>
        <div class="upload-content">
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
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from 'primevue/fileupload'

// Define emits
const emit = defineEmits(['trigger-upload', 'file-selected', 'file-dropped'])

// Template refs
const fileUpload = ref<any>(null)

// Methods
const triggerFileInput = (): void => {
  // Trigger the PrimeVue FileUpload component
  if (fileUpload.value) {
    const input = fileUpload.value.$el.querySelector('input[type="file"]')
    if (input) {
      input.click()
    }
  }
}

const onFileSelect = (event: any): void => {
  const file = event.files[0]
  if (file) {
    emit('file-selected', file)
    emit('file-dropped', file)
  }
}

const onClear = (): void => {
  // Handle file clear if needed
}

// Expose triggerFileInput method to parent for backward compatibility
defineExpose({
  triggerFileInput
})
</script>

<style scoped>
/* PrimeVue FileUpload customization using design tokens */
:deep(.p-fileupload) {
  background: transparent;
  border: none;
}

:deep(.p-fileupload-content) {
  background: var(--p-surface-800);
  border: 1px solid var(--p-surface-600);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  padding: 2rem;
  min-height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

:deep(.p-fileupload-content:hover) {
  background: var(--p-surface-700);
  border-color: var(--p-surface-500);
}

/* Custom upload content layout */
.upload-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Hide default PrimeVue elements we don't need */
:deep(.p-fileupload-buttonbar) {
  display: none;
}

:deep(.p-fileupload-files) {
  display: none;
}
</style>
