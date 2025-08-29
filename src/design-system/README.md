# Design System

This folder contains the design system configuration for PrimeVue theming and brand consistency.

## Structure

- `tokens/` - Design tokens (colors, spacing, typography) used to configure PrimeVue themes
- `composables/` - Theme management utilities
- `styles/` - PrimeVue theme configuration and customization
- `tokens/primevue/` - PrimeVue-specific theme token configurations

## Usage

Use PrimeVue components directly with our custom theme:

```vue
// ✅ Use PrimeVue components directly
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'

// Theme is automatically applied via PrimeVue configuration
<Button severity="primary" label="Save" />
<InputText v-model="value" placeholder="Enter text" />
```

## Theme Configuration

The design system defines:
- **Brand colors** - Primary, secondary, semantic colors
- **Component tokens** - PrimeVue component styling via design tokens
- **Dark/light themes** - Consistent theming across modes

## Guidelines

1. Use PrimeVue components directly - no custom wrappers needed
2. Styling is handled through PrimeVue's theme system
3. Brand colors are defined in `tokens/colors.ts` and applied to PrimeVue theme
4. Component customization via PrimeVue's passthrough (`:pt`) system when needed
