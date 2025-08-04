<template>
  <div>
    <h1>Vue + PrimeVue Test</h1>
    <Button label="Click me" @click="showMessage" />
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'

const message = ref('')

const showMessage = () => {
  message.value = 'PrimeVue is working!'
}
</script>
