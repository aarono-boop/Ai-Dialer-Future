import baseTokens from './base'
import buttonTokens from './button'
import dialogTokens from './dialog'
import inputtextTokens from './inputtext'
import cardTokens from './card'
import toggleswitchTokens from './toggleswitch'

export { default as base } from './base'
export { default as button } from './button'
export { default as dialog } from './dialog'
export { default as inputtext } from './inputtext'
export { default as card } from './card'
export { default as toggleswitch } from './toggleswitch'
export { default as theme, customTheme } from './theme'

// Export individual token categories for easy access
export const tokens = {
    button: buttonTokens,
    dialog: dialogTokens,
    inputtext: inputtextTokens,
    card: cardTokens,
    toggleswitch: toggleswitchTokens
}
