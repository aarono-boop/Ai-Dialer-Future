# Migration Guide: DS Wrapper Components → Direct PrimeVue

## Overview
Migrate from custom DS wrapper components to direct PrimeVue components using PrimeVue's built-in theme system.

## Current State Analysis
- **53 DSButton** usages across 17 files
- **12 DSInput** usages across 5 files  
- **1 DSCard** usage (example only)
- PrimeVue theme system already configured ✅

## Migration Steps

### 1. Import Replacements

**Before:**
```typescript
import { DSButton, DSInput } from '@/design-system/components'
```

**After:**
```typescript
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
```

### 2. Component Prop Mapping

#### DSButton → Button
| DS Wrapper | PrimeVue | Notes |
|------------|----------|-------|
| `variant="primary"` | `severity="primary"` | Direct mapping |
| `variant="secondary"` | `severity="secondary"` | Direct mapping |
| `variant="tertiary"` | `severity="secondary" outlined` | Outlined secondary |
| `variant="outlined"` | `outlined` | Use outlined prop |
| `variant="text"` | `text` | Use text prop |
| `variant="success"` | `severity="success"` | Direct mapping |
| `variant="warning"` | `severity="warn"` | Note: "warn" not "warning" |
| `variant="error"` | `severity="danger"` | Note: "danger" not "error" |
| `size="small"` | `size="small"` | Direct mapping |
| `size="large"` | `size="large"` | Direct mapping |
| `label="..."` | `label="..."` | Direct mapping |
| `icon="..."` | `icon="..."` | Direct mapping |
| `disabled` | `disabled` | Direct mapping |
| `loading` | `loading` | Direct mapping |

#### DSInput → InputText
| DS Wrapper | PrimeVue | Notes |
|------------|----------|-------|
| `v-model` | `v-model` | Direct mapping |
| `placeholder` | `placeholder` | Direct mapping |
| `disabled` | `disabled` | Direct mapping |
| `invalid` | `invalid` | Direct mapping |
| `size="small"` | `size="small"` | Direct mapping |
| `size="large"` | `size="large"` | Direct mapping |
| **Remove wrapper features:** | | |
| `label` | ❌ Use separate `<label>` | Manual implementation |
| `helpText` | ❌ Use separate `<small>` | Manual implementation |
| `errorMessage` | ❌ Use separate `<small>` | Manual implementation |
| `required` | ❌ Use separate indicator | Manual implementation |

### 3. Template Transformations

#### Simple DSButton Example
**Before:**
```vue
<DSButton variant="primary" label="Save" @click="save" />
```

**After:**
```vue
<Button severity="primary" label="Save" @click="save" />
```

#### Complex DSButton Example
**Before:**
```vue
<DSButton variant="tertiary" size="small" icon="pi pi-times" @click="close">
  Close
</DSButton>
```

**After:**
```vue
<Button severity="secondary" outlined size="small" icon="pi pi-times" @click="close">
  Close
</Button>
```

#### DSInput with Features
**Before:**
```vue
<DSInput 
  v-model="email"
  label="Email Address"
  placeholder="Enter your email"
  helpText="We'll never share your email"
  errorMessage="Please enter a valid email"
  required
/>
```

**After:**
```vue
<div class="field">
  <label for="email">Email Address <span class="text-red-400">*</span></label>
  <InputText 
    id="email"
    v-model="email"
    placeholder="Enter your email"
    :invalid="!!errorMessage"
  />
  <small v-if="!errorMessage" class="help-text">We'll never share your email</small>
  <small v-if="errorMessage" class="error-text">Please enter a valid email</small>
</div>
```

## File-by-File Migration Priority

### Phase 1: Simple Components (Low Risk)
1. `src/components/Footer.vue` - 1 DSButton
2. `src/components/ProductPage.vue` - 1 DSButton  
3. `src/components/PricingPage.vue` - 1 DSButton
4. `src/components/ActionButtons.vue` - Multiple DSButtons (simple)

### Phase 2: Modal Components (Medium Risk)
5. `src/components/modals/LoginModal.vue` - DSButton + DSInput
6. `src/components/modals/SignupModal.vue` - DSButton + DSInput
7. `src/components/modals/TermsModal.vue` - DSButton

### Phase 3: Complex Components (High Risk)
8. `src/components/Header.vue` - Multiple DSButtons with complex logic
9. `src/components/Dialer.vue` - Many DSButtons with refs and complex state
10. `src/App.vue` - Many DSButtons across different UI states

### Phase 4: Form Components (Special Handling)
11. `src/components/PaymentPage.vue` - Multiple DSInputs requiring form structure
12. `src/components/ChatInput.vue` - DSInput + DSButton with special styling

## Theme Configuration (Already Complete ✅)

Your PrimeVue theme is already properly configured in:
- `src/main.ts` - PrimeVue setup with custom theme
- `src/design-system/tokens/primevue/theme.ts` - Theme definitions
- Dark mode handling already implemented

## Cleanup Phase

After migration:
1. Remove `src/design-system/components/` directory
2. Remove `src/design-system/tokens/colors.ts` (if no longer needed)
3. Remove `src/design-system/composables/useDesignTokens.ts`
4. Update any remaining references to design tokens

## Testing Checklist

- [ ] Visual consistency maintained
- [ ] All button variants render correctly
- [ ] Form validation still works
- [ ] Accessibility features preserved
- [ ] Dark theme still applies
- [ ] No TypeScript errors
- [ ] No console errors

## Benefits After Migration

✅ **Reduced maintenance** - No custom wrapper code to maintain  
✅ **Better performance** - Fewer component layers  
✅ **Direct PrimeVue features** - Access to all PrimeVue capabilities  
✅ **Theme Designer compatibility** - Full integration with PrimeVue's visual theme editor  
✅ **Better documentation** - Use official PrimeVue docs directly  
✅ **Easier updates** - Direct dependency on PrimeVue versions
