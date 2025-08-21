// Design System Components - Main Export

// Import all components
import DSButton from './DSButton.vue'
import DSCard from './DSCard.vue'
import DSInput from './DSInput.vue'

// Export individual components
export {
  DSButton,
  DSCard,
  DSInput
}

// Export component types
export type { DSButtonProps } from './DSButton.vue'
export type { DSCardProps } from './DSCard.vue'
export type { DSInputProps } from './DSInput.vue'

// Default export for convenience
export default {
  DSButton,
  DSCard,
  DSInput
}
