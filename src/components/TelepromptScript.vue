<template>
  <div role="text" :style="{ color: 'var(--p-amber-400)', fontStyle: 'italic', lineHeight: '1.6' }">
    <template v-for="(token, idx) in tokens" :key="idx">
      <span v-if="token.isWord" :style="{ color: idxWord(token.wordIndex) < revealedWords ? 'var(--p-surface-0)' : 'var(--p-amber-400)' }">{{ token.text }}</span>
      <span v-else>{{ token.text }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{ text: string; msPerWord?: number; preDelayMs?: number }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const msPerWord = computed(() => props.msPerWord ?? 200)
const preDelayMs = computed(() => props.preDelayMs ?? 2000)

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
const revealedWords = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
let starter: ReturnType<typeof setTimeout> | null = null

const idxWord = (w: number) => w

const startAnimation = () => {
  // Initial delay before starting animation
  starter = setTimeout(() => {
    if (totalWords.value === 0) {
      emit('complete')
      return
    }
    timer = setInterval(() => {
      revealedWords.value++
      if (revealedWords.value >= totalWords.value) {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        emit('complete')
      }
    }, msPerWord.value)
  }, preDelayMs.value)
}

onMounted(startAnimation)

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (starter) clearTimeout(starter)
})
</script>
