import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { customTheme } from './design-system/tokens/primevue'
import 'primeicons/primeicons.css'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// Apply CSS variables to document root
Object.entries(cssVariables).forEach(([property, value]) => {
  document.documentElement.style.setProperty(property, value)
})

app.use(PrimeVue, {
  theme: {
    preset: customTheme,
    options: {
      prefix: 'p',
      darkModeSelector: 'class',
      cssLayer: false
    }
  }
})

app.use(ToastService)

app.mount('#app')
