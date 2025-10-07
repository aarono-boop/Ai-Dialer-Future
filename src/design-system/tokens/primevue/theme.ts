import { definePreset } from '@primevue/themes'
import base from './base'
import button from './button'
import dialog from './dialog'
import inputtext from './inputtext'
import card from './card'

export const customTheme = definePreset(base, {
    components: {
        button,
        dialog,
        inputtext,
        card
    }
})

export default customTheme
