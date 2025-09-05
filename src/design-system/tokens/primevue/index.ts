import baseTokens from './base'
import buttonTokens from './button'
import dialogTokens from './dialog'
import inputtextTokens from './inputtext'
import toggleswitchTokens from './toggleswitch'
import tooltipTokens from './tooltip'
import dropdownTokens from './dropdown'

export { default as base } from './base'
export { default as button } from './button'
export { default as dialog } from './dialog'
export { default as inputtext } from './inputtext'
export { default as toggleswitch } from './toggleswitch'
export { default as tooltip } from './tooltip'
export { default as dropdown } from './dropdown'
export { default as theme, customTheme } from './theme'
export { default as vulcan7Theme } from './vulcan7'

// Export individual token categories for easy access
export const tokens = {
    base: baseTokens,
    button: buttonTokens,
    dialog: dialogTokens,
    inputtext: inputtextTokens,
    toggleswitch: toggleswitchTokens,
    tooltip: tooltipTokens,
    dropdown: dropdownTokens
}
