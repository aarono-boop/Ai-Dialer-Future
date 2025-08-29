import { ref, computed, watch } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Composable for managing theme state and preferences
 * Uses PrimeVue's built-in theming system
 */
export function useTheme() {
  
  // Theme state
  const themeMode = ref<ThemeMode>('dark') // Default to dark for your app
  const systemPrefersDark = ref(false)
  
  // Check system preference
  const updateSystemPreference = () => {
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Computed actual theme
  const actualTheme = computed(() => {
    if (themeMode.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return themeMode.value
  })
  
  // Theme classes for components
  const themeClasses = computed(() => {
    return {
      'theme-light': actualTheme.value === 'light',
      'theme-dark': actualTheme.value === 'dark'
    }
  })
  
  // Set theme mode
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
  }
  
  // Toggle between light and dark
  const toggleTheme = () => {
    const newMode = actualTheme.value === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }
  
  // Apply theme to document
  const applyDocumentTheme = () => {
    document.documentElement.setAttribute('data-theme', actualTheme.value)
    document.documentElement.className = actualTheme.value
    applyTheme()
  }
  
  // Initialize theme
  const initializeTheme = () => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
    if (savedTheme) {
      themeMode.value = savedTheme
    }
    
    // Update system preference
    updateSystemPreference()
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateSystemPreference)
    
    // Apply initial theme
    applyDocumentTheme()
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference)
    }
  }
  
  // Watch for theme changes
  watch(actualTheme, applyDocumentTheme, { immediate: true })
  
  return {
    // State
    themeMode,
    actualTheme,
    systemPrefersDark,
    themeClasses,
    
    // Actions
    setThemeMode,
    toggleTheme,
    initializeTheme,
    applyDocumentTheme
  }
}
