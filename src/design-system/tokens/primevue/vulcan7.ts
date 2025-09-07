import { definePreset } from '@primevue/themes'
import base from './base'
import button from './button'
import dialog from './dialog'
import inputtext from './inputtext'
import toggleswitch from './toggleswitch'
import tooltip from './tooltip'
import dropdown from './dropdown'

// Vulcan7 brand preset: primary color #f3841c with an orange-based scale
export const vulcan7Theme = definePreset(base, {
  semantic: {
    primary: {
      50: '#fff5ec',
      100: '#ffe7d2',
      200: '#ffd0a8',
      300: '#ffb378',
      400: '#fba057',
      500: '#f3841c',
      600: '#db7419',
      700: '#c36516',
      800: '#a75412',
      900: '#7b3c0d',
      950: '#4a2408'
    }
  },
  components: {
    button,
    dialog,
    inputtext,
    toggleswitch,
    tooltip,
    dropdown
  }
})

export default vulcan7Theme
