import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
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

app.use(ConfirmationService)

app.mount('#app')

// Ensure dark theme is applied to HTML element for modals
const ensureDarkTheme = () => {
  const html = document.documentElement

  // Remove light class if present
  if (html.classList.contains('light')) {
    html.classList.remove('light')
    console.log('Removed light class from html')
  }

  // Add dark class if not present
  if (!html.classList.contains('dark')) {
    html.classList.add('dark')
    console.log('Added dark class to html')
  }
}

// Apply immediately and repeatedly
ensureDarkTheme()
setTimeout(ensureDarkTheme, 0)
setTimeout(ensureDarkTheme, 100)
setTimeout(ensureDarkTheme, 500)

// Watch for any changes and fix immediately
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      ensureDarkTheme()
    }
  })
})
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
  subtree: false
})

// Also check periodically
setInterval(ensureDarkTheme, 1000)
