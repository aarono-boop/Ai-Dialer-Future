<template>
  <Dialog
    :visible="visible"
    modal
    header="Test Modal"
    :style="{ width: '30rem' }"
    @hide="onClose"
  >
    <p>This is a test modal to debug the issue.</p>
    
    <template #footer>
      <Button
        label="Close"
        @click="onClose"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

// Props
const props = defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  'close': []
}>()

const onClose = () => {
  emit('close')
}
</script>
