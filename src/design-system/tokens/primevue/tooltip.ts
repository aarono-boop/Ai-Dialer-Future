import type { TooltipDesignTokens } from '@primeuix/themes/types/tooltip'

export default {
  root: {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    color: '{text.color}',
    borderRadius: '{border.radius.md}',
    padding: '0.25rem 0.5rem',
    shadow: '{overlay.popover.shadow}',
    fontSize: '{form.field.xs.font.size}'
  },
  arrow: {
    size: '6px'
  }
} satisfies TooltipDesignTokens
