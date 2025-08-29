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
      cssLayer: false,
      darkModeToggleId: null
    }
  }
})

app.use(ToastService)

app.mount('#app')

// Ensure no light class is added to html element
const removeLight = () => {
  document.documentElement.classList.remove('light')
}

// Remove on mount and watch for changes
removeLight()
const observer = new MutationObserver(removeLight)
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
