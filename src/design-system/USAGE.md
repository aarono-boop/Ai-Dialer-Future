# Design System Usage Guide

## Quick Start

### 1. Import PrimeVue Components
```vue
<script setup>
// Import PrimeVue components directly
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
</script>
```

### 2. Use Theme Management (Optional)
```vue
<script setup>
import { useTheme } from '@/design-system/composables'

const { themeMode, toggleTheme, setThemeMode } = useTheme()

// Toggle between light/dark themes
const handleThemeToggle = () => toggleTheme()
</script>
```

### 3. Basic Component Usage
```vue
<template>
  <!-- Buttons -->
  <!-- Buttons -->
  <Button severity="primary">Primary Action</Button>
  <Button severity="secondary">Secondary Action</Button>
  <Button severity="secondary" outlined>Tertiary Action</Button>

  <!-- Cards -->
  <Card>
    <template #title>Card Title</template>
    <template #subtitle>Card subtitle</template>
    <template #content>
      <p>Card content goes here</p>
    </template>
  </Card>

  <!-- Inputs with Labels -->
  <div class="field">
    <label for="email" class="block text-sm font-medium mb-2">
      Email Address <span class="text-red-400">*</span>
    </label>
    <InputText
      id="email"
      v-model="inputValue"
      placeholder="Enter your email"
      required
      class="w-full"
    />
  </div>
</template>
```

## Component API Reference

### Button (PrimeVue)
```vue
<Button
  severity="primary|secondary|success|warn|danger|help|info"
  :outlined="false"
  :text="false"
  size="small|large"
  :disabled="false"
  :loading="false"
  label="Button Text"
  icon="pi pi-icon"
>
  Custom content
</Button>
```

### Card (PrimeVue)
```vue
<Card>
  <template #header>Custom header</template>
  <template #title>Card Title</template>
  <template #subtitle>Card Subtitle</template>
  <template #content>
    Card content
  </template>
  <template #footer>Custom footer</template>
</Card>
```

### InputText (PrimeVue)
```vue
<!-- Simple input -->
<InputText v-model="value" placeholder="Enter text" />

<!-- Input with label and validation -->
<div class="field">
  <label for="email" class="block text-sm font-medium mb-2">
    Email Address <span class="text-red-400">*</span>
  </label>
  <InputText
    id="email"
    v-model="email"
    placeholder="Enter your email"
    :invalid="!!errors.email"
    type="email"
    required
  />
  <small v-if="errors.email" class="text-red-400">{{ errors.email }}</small>
  <small v-else class="text-gray-500">We'll never share your email</small>
</div>
```

## Theme Configuration

### Colors
Colors are configured in PrimeVue theme and accessible via CSS variables:
```css
/* Primary colors (configured via design tokens) */
var(--p-primary-color)
var(--p-primary-500)
var(--p-primary-600)

/* Text colors */
var(--p-text-color)
var(--p-text-muted-color)

/* Surface colors */
var(--p-surface-0)
var(--p-surface-800)
```

### Customization
Use PrimeVue's passthrough system for component customization:
```vue
<Button
  label="Custom Button"
  :pt="{
    root: { class: 'custom-button-styles' }
  }"
/>
```

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
