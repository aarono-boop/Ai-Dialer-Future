<template>
  <Dialog
    :visible="visible"
    modal
    header="Audio Check"
    :style="{ width: '36rem' }"
    :breakpoints="{ '960px': '95vw' }"
    @update:visible="onVisibilityChange"
  >
    <div class="space-y-6">
      <div class="flex items-start gap-3">
        <i class="pi pi-microphone text-yellow-300 text-xl mt-1" aria-hidden="true"></i>
        <div class="flex-1 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-medium">Microphone</span>
            <span class="text-sm" :class="micOk ? 'text-green-400' : 'text-gray-400'">{{ micOk ? 'Detected' : 'Awaiting input' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <Dropdown
              v-model="selectedMicId"
              :options="micDevices"
              optionLabel="label"
              optionValue="deviceId"
              placeholder="Select microphone"
              class="flex-1"
              variant="filled"
              appendTo="body"
              :pt="{
                root: { style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '0.5rem' } },
                panel: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.15)' } },
                content: { class: 'mic-dropdown-content', style: { background: 'var(--p-surface-800)', padding: '0.25rem' } },
                list: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
                item: { class: 'mic-dropdown-item hover:bg-white/10', style: { padding: '0.5rem 0.75rem' } }
              }"
              @change="restartMic"
            />
            <Button :label="isMicActive ? 'Restart' : 'Enable'" :severity="isMicActive ? 'secondary' : 'primary'" size="small" @click="restartMic" />
          </div>
          <div class="space-y-1">
            <ProgressBar :value="micLevel" />
            <div class="text-xs text-gray-400">Speak into your mic and watch the level move</div>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <i class="pi pi-volume-up text-yellow-300 text-xl mt-1" aria-hidden="true"></i>
        <div class="flex-1 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-medium">Speakers</span>
            <span class="text-sm" :class="speakerOk ? 'text-green-400' : 'text-gray-400'">{{ speakerOk ? 'Heard' : (testingSpeaker ? 'Playing test...' : 'Not tested') }}</span>
          </div>
          <div class="flex items-center gap-3">
            <Button icon="pi pi-play" :label="testingSpeaker ? 'Playing' : 'Play Test Sound'" severity="secondary" :disabled="testingSpeaker" @click="playTestTone" />
            <Button :icon="speakerOk ? 'pi pi-check' : ''" label="I heard it" :severity="speakerOk ? 'success' : 'secondary'" @click="markSpeakerHeard" />
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-400">
        We’ll start dialing once your mic and speakers are confirmed.
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-xs text-gray-400">
          Permissions required: Microphone access and audio playback
        </div>
        <div class="flex items-center gap-2">
          <Button label="Cancel" severity="secondary" @click="emit('close')" />
          <Button label="Continue" :disabled="!canContinue" @click="handleContinue" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'passed'): void }>()

const micDevices = ref<Array<{ deviceId: string; label: string }>>([])
const selectedMicId = ref<string>('')
const micLevel = ref<number>(0)
const micOk = ref<boolean>(false)
const speakerOk = ref<boolean>(false)
const testingSpeaker = ref<boolean>(false)
const isMicActive = ref<boolean>(false)

let micStream: MediaStream | null = null
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let micSource: MediaStreamAudioSourceNode | null = null
let rafId: number | null = null

const canContinue = computed(() => micOk.value && speakerOk.value)

const dropdownPT = computed(() => ({
  root: { style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '0.5rem' } },
  panel: { class: 'mic-dropdown-panel', style: { background: 'var(--p-surface-800)', border: '1px solid rgba(255,255,255,0.12)' } },
  content: { class: 'mic-dropdown-content', style: { background: 'var(--p-surface-800)', padding: '0.25rem' } },
  list: { class: 'mic-dropdown-list', style: { background: 'var(--p-surface-800)' } },
  item: { class: 'mic-dropdown-item hover:bg-white/10', style: { padding: '0.5rem 0.75rem' } }
}))

watch(() => props.visible, (v) => {
  if (v) {
    init()
  } else {
    teardown()
  }
})

const onVisibilityChange = (v: boolean) => {
  if (!v) emit('close')
}

const enumerateMics = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const inputs = devices.filter(d => d.kind === 'audioinput')
    micDevices.value = inputs.map(d => ({ deviceId: d.deviceId, label: d.label || 'Microphone' }))
    if (!selectedMicId.value && micDevices.value.length) {
      selectedMicId.value = micDevices.value[0].deviceId
    }
  } catch (e) {
    // ignore
  }
}

const init = async () => {
  micOk.value = false
  speakerOk.value = false
  await startMic()
}

const startMic = async () => {
  try {
    await stopMic()
    const constraints: MediaStreamConstraints = { audio: selectedMicId.value ? { deviceId: { exact: selectedMicId.value } } : true }
    micStream = await navigator.mediaDevices.getUserMedia(constraints)
    await enumerateMics()

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024

    micSource = audioCtx.createMediaStreamSource(micStream)
    micSource.connect(analyser)

    isMicActive.value = true
    loopLevel()
  } catch (err) {
    isMicActive.value = false
    micOk.value = false
  }
}

const loopLevel = () => {
  if (!analyser) return
  const data = new Uint8Array(analyser.fftSize)
  const step = () => {
    if (!analyser) return
    analyser.getByteTimeDomainData(data)
    // Compute RMS
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128
      sum += v * v
    }
    const rms = Math.sqrt(sum / data.length)
    micLevel.value = Math.min(100, Math.round(rms * 200))
    if (micLevel.value > 8) micOk.value = true
    rafId = requestAnimationFrame(step)
  }
  step()
}

const stopMic = async () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (micSource) {
    try { micSource.disconnect() } catch {}
    micSource = null
  }
  if (analyser) {
    try { analyser.disconnect() } catch {}
    analyser = null
  }
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop())
    micStream = null
  }
  isMicActive.value = false
}

const restartMic = async () => {
  await startMic()
}

const playTestTone = async () => {
  try {
    testingSpeaker.value = true
    const ctx = audioCtx && audioCtx.state !== 'closed' ? audioCtx : new (window.AudioContext || (window as any).webkitAudioContext)()
    if (ctx.state === 'suspended') await ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0.1
    osc.type = 'sine'
    osc.frequency.value = 440
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    setTimeout(() => {
      osc.stop()
      testingSpeaker.value = false
    }, 1000)
  } catch (e) {
    testingSpeaker.value = false
  }
}

const markSpeakerHeard = () => {
  speakerOk.value = true
}

const handleContinue = () => {
  if (canContinue.value) {
    emit('passed')
  }
}

const teardown = () => {
  stopMic()
}

onUnmounted(() => teardown())
</script>

<style scoped>
/* Dropdown panel typography and spacing */
:deep(.p-dropdown) {
  font-size: 0.875rem; /* 14px for trigger */
}
:deep(.p-dropdown .p-dropdown-label) {
  font-size: 0.875rem !important;
}
:deep(.p-dropdown-panel) {
  background-color: var(--p-surface-800) !important;
  font-size: 0.875rem; /* 14px list text */
}
:deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.25rem; /* space from panel edges */
}
:deep(.p-dropdown-panel .p-dropdown-item) {
  padding: 0.5rem 0.75rem !important; /* item padding */
  line-height: 1.5 !important; /* more breathing room */
  border-radius: var(--p-border-radius);
}
</style>

<style>
/* Global to affect portal (appendTo=body) */
.mic-dropdown-panel { background-color: var(--p-surface-800) !important; font-size: 0.875rem; }
.mic-dropdown-panel .p-dropdown-items { padding: 4px; }
.mic-dropdown-panel .p-dropdown-item { padding: 12px 12px; line-height: 2.5; font-size: 0.875rem; }
p-select-option li {padding: 5px 10px; font-size: 0.875rem; }
</style>
