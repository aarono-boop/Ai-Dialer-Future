<template>
  <div class="max-w-[80%] my-6 flex flex-col justify-start items-start gap-4">
    <FileUpload
      mode="basic"
      :auto="false"
      :multiple="false"
      accept=".csv,.xls,.xlsx"
      :maxFileSize="10000000"
      @select="onFileSelect"
      :pt="{
        root: { class: 'w-full' },
        basicButton: { 
          class: 'border-2 border-dashed border-white/30 rounded-lg p-10 text-center bg-transparent transition-all duration-300 cursor-pointer w-full hover:border-purple-400/60 hover:bg-white/[0.02] flex flex-col items-center justify-center'
        }
      }"
    >
      <template #empty>
        <div class="flex flex-col items-center">
          <i class="pi pi-cloud-upload text-4xl text-gray-500 mb-4 block"></i>
          <p class="text-base mb-2 text-white">
            <span class="text-blue-400 hover:text-blue-300 no-underline">Click to upload</span> or drag and drop
          </p>
          <p class="text-sm text-gray-400 m-0">CSV, XLS, or XLSX files</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload'

// Define emits
const emit = defineEmits(['trigger-upload', 'file-selected', 'file-dropped'])

// Methods
const onFileSelect = (event: any): void => {
  const file = event.files[0]
  if (file) {
    emit('file-selected', file)
    // Also emit file-dropped for backward compatibility
    emit('file-dropped', file)
  }
}

// Expose triggerFileInput method to parent for backward compatibility
defineExpose({
  triggerFileInput: () => {
    // PrimeVue FileUpload doesn't expose direct trigger method
    // The component handles clicks automatically
  }
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
