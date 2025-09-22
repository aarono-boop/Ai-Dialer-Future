<template>
  <Dialog
    v-model:visible="internalVisible"
    modal
    appendTo="body"
    :style="{ width: '48rem' }"
    :breakpoints="{ '960px': '95vw' }"
    :pt="{
      root: { style: { overflow: 'hidden' } },
      header: { style: { padding: '18px 20px 10px' } },
      content: { style: { padding: '0 20px 16px' } },
      footer: { style: { padding: '12px 20px 18px' } }
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle" style="color: var(--p-yellow-400);"></i>
        <span class="font-semibold">Objection detected</span>
      </div>
    </template>

    <div class="flex flex-col gap-4" :style="{ color: 'var(--p-surface-0)' }">
      <div class="rounded-md p-3" :style="{ background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)' }">
        <div class="text-sm mb-1" :style="{ color: 'var(--p-surface-200)' }">Prospect said</div>
        <div class="text-base leading-relaxed">“{{ objection }}”</div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <i class="pi pi-book" style="color: var(--p-blue-400);"></i>
            <span class="font-medium">Recommended response</span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              size="small"
              severity="secondary"
              outlined
              icon="pi pi-copy"
              label="Copy"
              @click="copyScript"
            />
          </div>
        </div>
        <div :style="{ background: 'var(--p-surface-800)', border: '1px solid var(--p-surface-600)', padding: '12px', borderRadius: '6px', minHeight: '10rem' }">
          <TelepromptScript
            :text="internalScript"
            :ms-per-word="200"
            :pre-delay-ms="0"
            :char-ms="5"
            @complete="handleAutoApply"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <Button label="Dismiss" severity="secondary" @click="handleClose" />
        <Button label="Use Response" icon="pi pi-check" @click="handleApply" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

const props = defineProps<{
  visible: boolean
  objection: string
  script: string
}>()

const emit = defineEmits<{
  (e: 'update:script', value: string): void
  (e: 'close'): void
  (e: 'apply'): void
}>()

const internalVisible = ref(props.visible)
const internalScript = ref(props.script)

watch(() => props.visible, v => internalVisible.value = v)
watch(() => props.script, v => internalScript.value = v)
watch(internalVisible, v => { if (!v) emit('close') })
watch(internalScript, v => emit('update:script', v))

const handleClose = () => {
  internalVisible.value = false
}

const handleApply = () => {
  emit('apply')
  internalVisible.value = false
}

const copyScript = async () => {
  try {
    await navigator.clipboard.writeText(internalScript.value)
  } catch {}
}
</script>
