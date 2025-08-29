import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { customTheme } from './design-system/tokens/primevue'
import 'primeicons/primeicons.css'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// PrimeVue design tokens are now handled by the theme system

app.use(PrimeVue, {
  theme: {
    preset: customTheme,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
})

app.use(ToastService)

app.mount('#app')
