// Design System - Main Export
// This is the primary entry point for the design system

// Export tokens
export * from './tokens'

// Export components
export * from './components'

// Export composables
export * from './composables'

// Export theme
export { customTheme, cssVariables } from './styles/theme'

// Export types
export type { ColorToken, SpacingToken, TypographyToken } from './tokens'
export type { 
  DSButtonProps,
  DSCardProps, 
  DSInputProps 
} from './components'
export type {
  ColorProp,
  SpacingProp,
  TypographyProp
} from './composables'

// Version
export const VERSION = '1.0.0'
