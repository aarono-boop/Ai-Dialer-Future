import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import { colors } from '../tokens/colors'

// Custom theme preset extending Aura
export const customTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: colors.primary[50],
      100: colors.primary[100],
      200: colors.primary[200],
      300: colors.primary[300],
      400: colors.primary[400],
      500: colors.primary[500],
      600: colors.primary[600],
      700: colors.primary[700],
      800: colors.primary[800],
      900: colors.primary[900],
      950: colors.primary[950]
    },
    colorScheme: {
      light: {
        primary: {
          color: colors.primary[500],
          inverseColor: '#ffffff',
          hoverColor: colors.primary[600],
          activeColor: colors.primary[700]
        },
        highlight: {
          background: colors.primary[500],
          focusBackground: colors.primary[600],
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        primary: {
          color: colors.primary[400],
          inverseColor: colors.neutral[950],
          hoverColor: colors.primary[300],
          activeColor: colors.primary[200]
        },
        highlight: {
          background: colors.primary[500],
          focusBackground: colors.primary[400],
          color: colors.neutral[950],
          focusColor: colors.neutral[950]
        },
        surface: {
          0: colors.background.primary,
          50: colors.neutral[800],
          100: colors.neutral[700],
          200: colors.neutral[600],
          300: colors.neutral[500],
          400: colors.neutral[400],
          500: colors.neutral[300],
          600: colors.neutral[200],
          700: colors.neutral[100],
          800: colors.neutral[50],
          900: '#ffffff'
        }
      }
    }
  },
  components: {
    button: {
      root: {
        borderRadius: '6px',
        paddingX: '0.75rem',
        paddingY: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.5s ease-in-out'
      },
      icon: {
        size: '1rem'
      }
    },
    inputtext: {
      root: {
        background: colors.background.secondary,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        color: colors.text.primary,
        borderRadius: '6px',
        paddingX: '0.75rem',
        paddingY: '0.5rem'
      }
    },
    card: {
      root: {
        background: colors.background.secondary,
        borderRadius: '8px',
        padding: '1.5rem'
      }
    }
  }
})

// CSS Variables for additional customization
export const cssVariables = {
  '--ds-primary-500': colors.primary[500],
  '--ds-primary-600': colors.primary[600],
  '--ds-background-primary': colors.background.primary,
  '--ds-background-secondary': colors.background.secondary,
  '--ds-text-primary': colors.text.primary,
  '--ds-text-secondary': colors.text.secondary,
  '--ds-border-radius-md': '6px',
  '--ds-spacing-md': '1rem',
  '--ds-transition-default': 'all 0.5s ease-in-out'
}
