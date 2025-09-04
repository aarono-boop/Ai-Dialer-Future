export interface Coach {
  id: string
  name: string
  displayName: string
  videoId?: string
  avatarUrl?: string
  welcomeMessage: string
  createdBy?: string
  createdAt?: string
  isActive?: boolean
}

export interface CoachCreateData {
  name: string
  displayName: string
  videoUrl?: string
  avatarFile?: File
  customMessage?: string
}

export interface CoachConfig {
  coaches: Record<string, Coach>
  defaultCoach?: string
}

export type CoachManagementMode = 'create' | 'admin' | null
