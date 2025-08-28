import { definePreset } from '@primevue/themes'
import base from './base'
import button from './button'

export const customTheme = definePreset(base, {
    components: {
        button
    }
})

export default customTheme
