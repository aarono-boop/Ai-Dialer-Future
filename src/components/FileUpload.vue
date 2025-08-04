<template>
  <div class="max-w-[80%] my-6 flex flex-col justify-start items-start gap-4">
    <div 
      class="border-2 border-dashed border-white/30 rounded-lg p-10 text-center bg-transparent transition-all duration-300 cursor-pointer w-full hover:border-purple-400/60 hover:bg-white/[0.02]"
      @click="$emit('trigger-upload')"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <i class="pi pi-cloud-upload text-4xl text-gray-500 mb-4 block"></i>
      <p class="text-base mb-2 text-white">
        <span class="text-blue-400 hover:text-blue-300 no-underline">Click to upload</span> or drag and drop
      </p>
      <p class="text-sm text-gray-400 m-0">CSV, XLS, or XLSX files</p>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      accept=".csv,.xls,.xlsx"
      @change="onFileInputChange"
      style="display: none;"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define emits
const emit = defineEmits(['trigger-upload', 'file-selected', 'file-dropped'])

// Refs
const fileInput = ref()

// Methods
const onFileInputChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('file-selected', file)
  }
}

const onDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files.length > 0) {
    emit('file-dropped', files[0])
  }
}

const onDragOver = (event) => {
  event.preventDefault()
}

const onDragLeave = (event) => {
  event.preventDefault()
}

// Expose triggerFileInput method to parent
defineExpose({
  triggerFileInput: () => fileInput.value?.click()
})
</script>
