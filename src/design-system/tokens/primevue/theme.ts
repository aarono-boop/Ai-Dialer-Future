import { definePreset } from '@primevue/themes'
import base from './base'
import button from './button'
import dialog from './dialog'
import inputtext from './inputtext'
import toggleswitch from './toggleswitch'
import tooltip from './tooltip'
import dropdown from './dropdown'

export const customTheme = definePreset(base as any, {
    components: {
        button,
        dialog,
        inputtext,
        toggleswitch,
        tooltip,
        dropdown
    }
} as any)

export default customTheme
