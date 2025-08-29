import baseTokens from './base'
import buttonTokens from './button'
import dialogTokens from './dialog'

export { default as base } from './base'
export { default as button } from './button'
export { default as dialog } from './dialog'
export { default as theme, customTheme } from './theme'

// Export individual token categories for easy access
export const tokens = {
    base: baseTokens,
    button: buttonTokens,
    dialog: dialogTokens
}
