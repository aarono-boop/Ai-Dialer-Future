# Design System Usage Guide

## Quick Start

### 1. Import Components
```vue
<script setup>
// Import design system components
import { DSButton, DSCard, DSInput } from '@/design-system/components'

// Or import all at once
import { DSButton, DSCard, DSInput } from '@/design-system'
</script>
```

### 2. Use Design Tokens
```vue
<script setup>
import { useDesignTokens } from '@/design-system/composables'

const { getColor, getSpacing } = useDesignTokens()

const primaryColor = getColor('primary.500')
const mediumSpacing = getSpacing('4')
</script>
```

### 3. Basic Component Usage
```vue
<template>
  <!-- Buttons -->
  <DSButton variant="primary">Primary Action</DSButton>
  <DSButton variant="secondary">Secondary Action</DSButton>
  <DSButton variant="tertiary">Tertiary Action</DSButton>
  
  <!-- Cards -->
  <DSCard title="Card Title" subtitle="Card subtitle">
    <p>Card content goes here</p>
  </DSCard>
  
  <!-- Inputs -->
  <DSInput
    v-model="inputValue"
    label="Email Address"
    placeholder="Enter your email"
    required
  />
</template>
```

## Component API Reference

### DSButton
```vue
<DSButton
  variant="primary|secondary|tertiary|success|warning|error"
  size="small|medium|large"
  :disabled="false"
  :loading="false"
  label="Button Text"
>
  Custom content
</DSButton>
```

### DSCard
```vue
<DSCard
  variant="default|elevated|outlined|filled"
  padding="none|small|medium|large"
  title="Card Title"
  subtitle="Card Subtitle"
>
  <template #header>Custom header</template>
  <template #title>Custom title</template>
  <template #subtitle>Custom subtitle</template>
  
  Card content
  
  <template #footer>Custom footer</template>
</DSCard>
```

### DSInput
```vue
<DSInput
  v-model="value"
  label="Field Label"
  placeholder="Placeholder text"
  help-text="Helper text"
  error-message="Error message"
  size="small|medium|large"
  variant="default|filled|outlined"
  :required="false"
  :disabled="false"
  :invalid="false"
/>
```

## Design Tokens

### Colors
```javascript
// Access colors from tokens
import { colors } from '@/design-system/tokens'

colors.primary[500]     // #9333FF
colors.background.primary  // #242733
colors.text.primary     // #ffffff
```

### Spacing
```javascript
import { spacing } from '@/design-system/tokens'

spacing[4]   // 1rem (16px)
spacing[8]   // 2rem (32px)
```

### Typography
```javascript
import { typography } from '@/design-system/tokens'

typography.h1.fontSize      // 2.25rem
typography.button.fontWeight // 500
```

## Best Practices

### ✅ Do
- Always use design system components instead of PrimeVue components directly
- Use design tokens for consistent spacing, colors, and typography
- Follow the established component API patterns
- Document any custom variants or extensions

### ❌ Don't
- Import PrimeVue components directly in application code
- Use hardcoded colors, spacing, or typography values
- Override design system styles with `!important`
- Create custom components that duplicate design system functionality

## Migration Strategy

### Step 1: Identify Components to Replace
```bash
# Find all PrimeVue component imports
grep -r "from 'primevue/" src/components/
```

### Step 2: Replace Gradually
```vue
<!-- Before -->
<Button class="btn-primary">Click me</Button>

<!-- After -->
<DSButton variant="primary">Click me</DSButton>
```

### Step 3: Remove Custom CSS
After migrating to design system components, remove custom CSS classes that duplicate design system functionality.

## Extending the Design System

### Adding New Components
1. Create component in `src/design-system/components/`
2. Follow existing patterns for props and variants
3. Export from `src/design-system/components/index.ts`
4. Document usage examples

### Adding New Tokens
1. Add tokens to appropriate file in `src/design-system/tokens/`
2. Update theme configuration if needed
3. Export from `src/design-system/tokens/index.ts`
4. Update TypeScript types

### Creating Custom Variants
```vue
<script setup>
// Extend existing components with custom logic
import { DSButton } from '@/design-system/components'
import { computed } from 'vue'

const props = defineProps<{
  danger?: boolean
}>()

const buttonVariant = computed(() => {
  return props.danger ? 'error' : 'primary'
})
</script>

<template>
  <DSButton :variant="buttonVariant">
    <slot />
  </DSButton>
</template>
```
