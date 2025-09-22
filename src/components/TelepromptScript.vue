<template>
  <div role="text" :style="{ color: 'var(--p-amber-400)', fontStyle: 'italic', lineHeight: '1.6' }">
    <template v-for="(token, idx) in typedTokens" :key="idx">
      <span v-if="token.isWord" :style="{ color: token.wordIndex < revealedWords ? 'var(--p-surface-0)' : 'var(--p-amber-400)' }">{{ token.text }}</span>
      <span v-else>{{ token.text }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{ text: string; msPerWord?: number; preDelayMs?: number; charMs?: number }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const msPerWord = computed(() => props.msPerWord ?? 200)
const preDelayMs = computed(() => props.preDelayMs ?? 2000)
const charMs = computed(() => props.charMs ?? 5)

// Split into tokens preserving spaces
const rawTokens = computed(() => props.text.split(/(\s+)/))

const tokens = computed(() => {
  const result: Array<{ text: string; isWord: boolean; wordIndex: number }> = []
  let wIndex = 0
  rawTokens.value.forEach((t) => {
    if (!t) return
    const isSpace = /\s+/.test(t)
    if (isSpace) {
      result.push({ text: t, isWord: false, wordIndex: -1 })
    } else {
      result.push({ text: t, isWord: true, wordIndex: wIndex })
      wIndex++
    }
  })
  return result
})

const totalWords = computed(() => tokens.value.reduce((acc, t) => acc + (t.isWord ? 1 : 0), 0))
const totalChars = computed(() => tokens.value.reduce((acc, t) => acc + t.text.length, 0))

const revealedWords = ref(0)
const typedChars = ref(0)

let wordTimer: ReturnType<typeof setInterval> | null = null
let deferWordStarter: ReturnType<typeof setTimeout> | null = null
let charTimer: ReturnType<typeof setInterval> | null = null

// Compute tokens truncated to the number of typed characters
const typedTokens = computed(() => {
  const out: Array<{ text: string; isWord: boolean; wordIndex: number }> = []
  let remaining = typedChars.value
  for (const t of tokens.value) {
    if (remaining <= 0) break
    const piece = t.text.slice(0, Math.min(t.text.length, remaining))
    if (piece.length > 0) {
      out.push({ text: piece, isWord: t.isWord, wordIndex: t.wordIndex })
      remaining -= piece.length
    }
  }
  return out
})

const startAmberTyping = () => {
  if (totalChars.value === 0) return startWordReveal()
  charTimer = setInterval(() => {
    typedChars.value++
    if (typedChars.value >= totalChars.value) {
      if (charTimer) {
        clearInterval(charTimer)
        charTimer = null
      }
      startWordReveal()
    }
  }, charMs.value)
}

const startWordReveal = () => {
  // Wait before starting listening-style white reveal
  deferWordStarter = setTimeout(() => {
    if (totalWords.value === 0) {
      emit('complete')
      return
    }
    wordTimer = setInterval(() => {
      revealedWords.value++
      if (revealedWords.value >= totalWords.value) {
        if (wordTimer) {
          clearInterval(wordTimer)
          wordTimer = null
        }
        emit('complete')
      }
    }, msPerWord.value)
  }, preDelayMs.value)
}

onMounted(() => {
  startAmberTyping()
})

onUnmounted(() => {
  if (wordTimer) clearInterval(wordTimer)
  if (deferWordStarter) clearTimeout(deferWordStarter)
  if (charTimer) clearInterval(charTimer)
})
</script>
