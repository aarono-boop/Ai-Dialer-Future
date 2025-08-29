import { definePreset } from '@primevue/themes'
import base from './base'
import button from './button'
import dialog from './dialog'

export const customTheme = definePreset(base, {
    components: {
        button,
        dialog
    }
})

export default customTheme
