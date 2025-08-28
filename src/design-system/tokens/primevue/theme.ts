import { definePreset } from '@primeuix/styled'
import base from './base'
import button from './button'

export const customTheme = definePreset(base, {
    components: {
        button
    }
})

export default customTheme
