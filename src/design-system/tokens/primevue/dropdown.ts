import type { DropdownDesignTokens } from '@primeuix/themes/types/dropdown'

export default {
  root: {
    borderRadius: '{primitive.borderRadius.md}'
  },
  input: {
    background: '{surface.100}',
    color: '{text.color}',
    borderColor: 'rgba(255,255,255,0.15)'
  },
  panel: {
    background: '{surface.100}',
    borderColor: 'rgba(255,255,255,0.15)',
    shadow: '{overlay.modal.shadow}',
    color: '{text.color}'
  },
  item: {
    focusBackground: '{surface.200}',
    focusColor: '{text.color}'
  }
} satisfies DropdownDesignTokens
