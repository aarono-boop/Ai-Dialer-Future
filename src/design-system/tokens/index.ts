// Design System Tokens - Main Export
export * from './colors'
export * from './spacing' 
export * from './typography'

// Re-export for convenience
import { colors } from './colors'
import { spacing, borderRadius, componentSpacing } from './spacing'
import { typography, fontFamily, fontSize, fontWeight } from './typography'

export const tokens = {
  colors,
  spacing,
  borderRadius,
  componentSpacing,
  typography,
  fontFamily,
  fontSize,
  fontWeight
} as const

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors
export type SpacingToken = keyof typeof spacing
export type TypographyToken = keyof typeof typography
export type BorderRadiusToken = keyof typeof borderRadius
