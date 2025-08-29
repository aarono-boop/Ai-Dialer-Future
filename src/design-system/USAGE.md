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

## Best Practices

### ✅ Do
- **Components**: Use PrimeVue components directly with consistent prop patterns
- **Styling**: Always try design tokens (theme variables) before custom CSS
- **Theming**: Leverage PrimeVue's built-in theming system
- **Consistency**: Follow PrimeVue's API conventions and documentation
- **Approval**: Ask for permission before creating custom components or CSS

### ❌ Don't
- Create unnecessary wrapper components around PrimeVue
- Use custom CSS when design tokens are available
- Override theme styles with `!important`
- Use hardcoded colors instead of theme CSS variables
- Bypass PrimeVue's theming system

### 🛑 Stop & Ask Rules:
1. **Custom Components**: If PrimeVue doesn't have what you need → Ask for approval
2. **Custom CSS**: If design tokens can't handle your styling → Ask for approval

## Theme Management

### Dark/Light Mode
```vue
<script setup>
import { useTheme } from '@/design-system/composables'

const { actualTheme, toggleTheme } = useTheme()
</script>

<template>
  <Button @click="toggleTheme" icon="pi pi-moon" />
  <p>Current theme: {{ actualTheme }}</p>
</template>
```

## Customizing PrimeVue Components

### Using Passthrough
```vue
<Button
  label="Custom Button"
  :pt="{
    root: {
      class: 'custom-focus-ring hover:scale-105 transition-transform'
    }
  }"
/>
```

### Global Theme Customization
Edit `src/design-system/tokens/primevue/` files to customize component appearance globally.

### Creating Composite Components
```vue
<script setup>
// Create reusable patterns with PrimeVue components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  value: string
  placeholder?: string
  buttonLabel?: string
}>()

const emit = defineEmits<{
  update:value: [value: string]
  submit: []
}>()
</script>

<template>
  <div class="flex gap-2">
    <InputText
      :value="value"
      :placeholder="placeholder"
      @update:value="emit('update:value', $event)"
      class="flex-1"
    />
    <Button
      :label="buttonLabel || 'Submit'"
      @click="emit('submit')"
    />
  </div>
</template>
```
