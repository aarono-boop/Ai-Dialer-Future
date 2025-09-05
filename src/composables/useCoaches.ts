import { ref, computed, type Ref } from 'vue'
import type { Coach, CoachConfig, CoachCreateData, CoachManagementMode } from '../types/coach'
import { defaultCoachConfig, generateCoachWelcomeMessage, generateCoachId, extractYouTubeVideoId } from '../config/coaches'

// Global coach state
const coachConfig: Ref<CoachConfig> = ref({ ...defaultCoachConfig })
const currentCoachId: Ref<string | null> = ref(null)
const managementMode: Ref<CoachManagementMode> = ref(null)

export const useCoaches = () => {
  // Computed properties
  const currentCoach = computed((): Coach | null => {
    if (!currentCoachId.value) return null
    return coachConfig.value.coaches[currentCoachId.value] || null
  })

  const coachList = computed((): Coach[] => {
    return Object.values(coachConfig.value.coaches)
      .filter(coach => coach.isActive !== false)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  })

  const welcomeMessage = computed((): string => {
    if (!currentCoach.value) {
      return 'Welcome to <strong>ARKON</strong>, your AI calling assistant.<br><br>Drop your contact file here and I\'ll show you exactly who\'s most likely to pick up right now.'
    }
    return generateCoachWelcomeMessage(currentCoach.value)
  })

  // Methods
  const setCurrentCoach = (coachId: string | null): void => {
    currentCoachId.value = coachId
  }

  const setManagementMode = (mode: CoachManagementMode): void => {
    managementMode.value = mode
  }

  const addCoach = async (coachData: CoachCreateData): Promise<Coach> => {
    const coachId = generateCoachId(coachData.displayName)

    // Extract video ID if URL provided
    let videoId: string | undefined
    if (coachData.videoUrl) {
      const extractedId = extractYouTubeVideoId(coachData.videoUrl)
      videoId = extractedId || undefined
    }

    // Convert avatar file to base64 if provided
    let avatarUrl: string | undefined
    if (coachData.avatarFile) {
      try {
        avatarUrl = await fileToBase64(coachData.avatarFile)
      } catch (error) {
        console.warn('Failed to convert avatar to base64:', error)
        avatarUrl = undefined
      }
    }

    // Create new coach
    const newCoach: Coach = {
      id: coachId,
      name: coachId,
      displayName: coachData.displayName,
      videoId,
      avatarUrl,
      websiteUrl: coachData.websiteUrl || undefined,
      highlights: coachData.highlights && coachData.highlights.length ? coachData.highlights.slice(0, 2) : undefined,
      welcomeMessage: coachData.customMessage || `Welcome to <strong>ARKON</strong>! I'm your AI calling assistant, enhanced with <strong>${coachData.displayName}'s</strong> proven methodologies.`,
      isActive: true,
      createdBy: 'user',
      createdAt: new Date().toISOString()
    }

    // Add to config
    coachConfig.value.coaches[coachId] = newCoach

    // Save to localStorage for persistence
    saveCoachConfig()

    return newCoach
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const removeCoach = (coachId: string): boolean => {
    if (coachConfig.value.coaches[coachId]) {
      delete coachConfig.value.coaches[coachId]
      saveCoachConfig()
      return true
    }
    return false
  }

  const updateCoach = (coachId: string, updates: Partial<Coach>): boolean => {
    if (coachConfig.value.coaches[coachId]) {
      coachConfig.value.coaches[coachId] = {
        ...coachConfig.value.coaches[coachId],
        ...updates
      }
      saveCoachConfig()
      return true
    }
    return false
  }

  const saveCoachConfig = (): void => {
    try {
      localStorage.setItem('arkon-coaches', JSON.stringify(coachConfig.value))
    } catch (error) {
      console.warn('Failed to save coach config to localStorage:', error)
    }
  }

  const loadCoachConfig = (): void => {
    try {
      const saved = localStorage.getItem('arkon-coaches')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with default config to ensure we have system coaches
        const mergedCoaches = {
          ...defaultCoachConfig.coaches,
          ...parsed.coaches
        }

        // Migration: Convert Jordan Stupar from system to user coach
        if (mergedCoaches['jordan-stupar'] && mergedCoaches['jordan-stupar'].createdBy === 'system') {
          mergedCoaches['jordan-stupar'] = {
            ...mergedCoaches['jordan-stupar'],
            createdBy: 'user'
          }
        }

        coachConfig.value = {
          ...defaultCoachConfig,
          coaches: mergedCoaches
        }

        // Save the migrated config back to localStorage
        saveCoachConfig()
      }
    } catch (error) {
      console.warn('Failed to load coach config from localStorage:', error)
      coachConfig.value = { ...defaultCoachConfig }
    }
  }

  const exportCoaches = (): string => {
    return JSON.stringify(coachConfig.value, null, 2)
  }

  const importCoaches = (configJson: string): boolean => {
    try {
      const imported = JSON.parse(configJson)
      if (imported.coaches) {
        coachConfig.value = imported
        saveCoachConfig()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import coach config:', error)
      return false
    }
  }

  const generateCoachUrl = (coachId: string, baseUrl: string = window.location.origin): string => {
    return `${baseUrl}${window.location.pathname}?coach=${coachId}`
  }

  // Initialize on first use
  loadCoachConfig()

  return {
    // State
    coachConfig,
    currentCoachId,
    managementMode,
    
    // Computed
    currentCoach,
    coachList,
    welcomeMessage,
    
    // Methods
    setCurrentCoach,
    setManagementMode,
    addCoach,
    removeCoach,
    updateCoach,
    saveCoachConfig,
    loadCoachConfig,
    exportCoaches,
    importCoaches,
    generateCoachUrl
  }
}
