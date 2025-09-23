import type { Coach, CoachConfig } from '../types/coach'

// Initial coach configuration with Jordan Stupar
export const initialCoaches: Record<string, Coach> = {
  'jordan-stupar': {
    id: 'jordan-stupar',
    name: 'jordan-stupar', // URL parameter value
    displayName: 'Jordan Stupar',
    videoId: 'sthXVPIC8K0',
    avatarUrl: 'https://cdn.builder.io/api/v1/image/assets%2F5aeb07ce25f84dbc869290880d07b71e%2F3bddb1110d0949139407eb0dc708c7ff?format=webp&width=800',
    welcomeMessage: 'Welcome to <strong>AI Dialer</strong>! I\'m your AI calling assistant, trained with <strong>Jordan Stupar\'s</strong> proven sales methodologies.',
    isActive: true,
    createdBy: 'user',
    createdAt: new Date().toISOString()
  }
}

// Default coach configuration
export const defaultCoachConfig: CoachConfig = {
  coaches: initialCoaches,
  defaultCoach: undefined
}

// Generate coach welcome message with video embedding
export const generateCoachWelcomeMessage = (coach: Coach): string => {
  let message = coach.welcomeMessage

  // Add video if coach has one
  if (coach.videoId) {
    message += `<br><br><div class="coach-video-container" data-video-id="${coach.videoId}" data-autoplay="true"></div>`
  }

  // Add the call-to-action
  message += `<br>I’ll show you exactly who’s most likely to pick up right now. Lets get some contacts loaded!`

  return message
}

// Generate URL-safe coach ID from display name
export const generateCoachId = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Validate YouTube URL and extract video ID
export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}
