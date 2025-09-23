import baseTokens from './base'
import buttonTokens from './button'
import dialogTokens from './dialog'
import inputtextTokens from './inputtext'
import toggleswitchTokens from './toggleswitch'
import tooltipTokens from './tooltip'
import dropdownTokens from './dropdown'
import badgeTokens from './badge'
import tagTokens from './tag'
import checkboxTokens from './checkbox'

export { default as base } from './base'
export { default as button } from './button'
export { default as dialog } from './dialog'
export { default as inputtext } from './inputtext'
export { default as toggleswitch } from './toggleswitch'
export { default as tooltip } from './tooltip'
export { default as dropdown } from './dropdown'
export { default as badge } from './badge'
export { default as tag } from './tag'
export { default as checkbox } from './checkbox'
export { default as theme, customTheme } from './theme'
export { default as vulcan7Theme } from './vulcan7'

// Export individual token categories for easy access
export const tokens = {
    button: buttonTokens,
    dialog: dialogTokens,
    inputtext: inputtextTokens,
    toggleswitch: toggleswitchTokens,
    tooltip: tooltipTokens,
    dropdown: dropdownTokens,
    badge: badgeTokens,
    tag: tagTokens,
    checkbox: checkboxTokens
}
