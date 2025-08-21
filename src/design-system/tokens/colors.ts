// Design System Color Tokens
// Based on your existing brand colors

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe', 
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#9333FF', // Your main brand color
    600: '#8000FF', // Your hover color
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },

  // Neutral/Gray scale (matching your current dark theme)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },

  // Background colors (from your current design)
  background: {
    primary: '#242733',
    secondary: '#344054',
    tertiary: '#475467',
    dot: '#5D5F69'
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280'
  }
} as const

// Export individual color scales for convenience
export const { primary, neutral, background, success, warning, error, text } = colors

// Color utility functions
export const getColor = (color: keyof typeof colors, shade: number = 500) => {
  const colorScale = colors[color] as Record<number, string>
  return colorScale[shade] || colorScale[500]
}
