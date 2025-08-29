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

// Aggressively remove light class from html element
const removeLight = () => {
  const html = document.documentElement
  if (html.classList.contains('light')) {
    html.classList.remove('light')
    console.log('Removed light class from html')
  }
}

// Remove immediately and repeatedly
removeLight()
setTimeout(removeLight, 0)
setTimeout(removeLight, 100)
setTimeout(removeLight, 500)

// Watch for any changes and remove immediately
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      removeLight()
    }
  })
})
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
  subtree: false
})

// Also check periodically
setInterval(removeLight, 1000)
