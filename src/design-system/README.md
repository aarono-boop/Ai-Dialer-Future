# Design System

This folder contains the design system components, tokens, and utilities for the application.

## Structure

- `tokens/` - Design tokens (colors, spacing, typography, etc.)
- `components/` - Design system components (wrappers around PrimeVue)
- `composables/` - Shared design system logic and utilities
- `styles/` - Global theme overrides and CSS variables
- `types/` - TypeScript type definitions for the design system

## Usage

Import design system components instead of PrimeVue components directly:

```vue
// ❌ Don't do this
import Button from 'primevue/button'

// ✅ Do this instead  
import { DSButton } from '@/design-system/components'
```

## Guidelines

1. Always use design tokens for colors, spacing, and typography
2. Extend PrimeVue components through composition, not inheritance
3. Keep component APIs consistent with PrimeVue where possible
4. Document component variants and usage examples
