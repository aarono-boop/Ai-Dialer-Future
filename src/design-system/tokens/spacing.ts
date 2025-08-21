// Design System Spacing Tokens
// Consistent spacing scale based on 4px base unit

export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px  
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  56: '14rem',     // 224px
  64: '16rem',     // 256px
} as const

// Component-specific spacing
export const componentSpacing = {
  button: {
    paddingX: spacing[3],
    paddingY: spacing[2],
    gap: spacing[2]
  },
  input: {
    paddingX: spacing[3],
    paddingY: spacing[2]
  },
  card: {
    padding: spacing[6],
    gap: spacing[4]
  },
  modal: {
    padding: spacing[6],
    gap: spacing[6]
  }
} as const

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px'
} as const

// Export commonly used values
export const { 
  0: none,
  2: xs,
  4: sm, 
  6: md,
  8: lg,
  12: xl,
  16: xxl
} = spacing
