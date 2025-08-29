// Design System - Main Export
// This is the primary entry point for the design system
// Now focused on PrimeVue theme configuration

// Export tokens (used for PrimeVue theme configuration)
export * from './tokens'

// Export composables (theme management)
export * from './composables'

// Export PrimeVue theme configuration
export { customTheme, cssVariables } from './styles/theme'

// Export types
export type { ColorToken, SpacingToken, TypographyToken } from './tokens'

// Version
export const VERSION = '2.0.0' // Updated to reflect PrimeVue migration
