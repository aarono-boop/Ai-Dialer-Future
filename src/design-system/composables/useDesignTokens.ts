import { computed } from 'vue'
import { tokens, colors, spacing, typography, componentTokens } from '../tokens'
import type { ColorToken, SpacingToken, TypographyToken } from '../tokens'

/**
 * Composable for accessing design tokens in components
 * Provides reactive access to colors, spacing, typography, etc.
 */
export function useDesignTokens() {
  
  // Color utilities
  const getColor = (colorPath: string, fallback?: string) => {
    const keys = colorPath.split('.')
    let value: any = colors
    
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) break
    }
    
    return value || fallback || '#000000'
  }
  
  // Spacing utilities
  const getSpacing = (spaceKey: keyof typeof spacing) => {
    return spacing[spaceKey] || spacing[4]
  }
  
  // Typography utilities
  const getTypography = (typeKey: keyof typeof typography) => {
    return typography[typeKey]
  }

  // Component styles utilities
  const getComponentStyles = (component: string, element: string) => {
    const componentStyles = componentTokens[component as keyof typeof componentTokens]
    if (!componentStyles) return {}

    const elementStyles = componentStyles[element as keyof typeof componentStyles]
    return elementStyles || {}
  }
  
  // CSS variable generation
  const generateCSSVariables = () => {
    const variables: Record<string, string> = {}
    
    // Color variables
    Object.entries(colors).forEach(([colorName, colorScale]) => {
      if (typeof colorScale === 'object') {
        Object.entries(colorScale).forEach(([shade, value]) => {
          variables[`--ds-color-${colorName}-${shade}`] = value
        })
      } else {
        variables[`--ds-color-${colorName}`] = colorScale
      }
    })
    
    // Spacing variables  
    Object.entries(spacing).forEach(([key, value]) => {
      variables[`--ds-spacing-${key}`] = value
    })
    
    return variables
  }
  
  // Reactive computed properties
  const cssVariables = computed(() => generateCSSVariables())
  
  // Theme utilities
  const applyTheme = (element?: HTMLElement) => {
    const targetElement = element || document.documentElement
    const variables = cssVariables.value
    
    Object.entries(variables).forEach(([property, value]) => {
      targetElement.style.setProperty(property, value)
    })
  }
  
  return {
    // Tokens
    tokens,
    colors,
    spacing,
    typography,
    
    // Utilities
    getColor,
    getSpacing,
    getTypography,
    
    // CSS Variables
    cssVariables,
    generateCSSVariables,
    applyTheme
  }
}

// Helper type for component props that accept design tokens
export type ColorProp = string | ColorToken
export type SpacingProp = string | SpacingToken  
export type TypographyProp = string | TypographyToken
