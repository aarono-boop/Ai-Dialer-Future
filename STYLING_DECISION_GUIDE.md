# PrimeVue Styling Decision Guide

## 🎨 Decision Flowchart

```
Need custom styling?
        ↓
[1] Check PrimeVue theme variables
        ↓
    Variable exists?
        ↓              ↓
       YES            NO
        ↓              ↓
    Use it!        [2] Can you use :pt?
                      ↓         ↓
                     YES       NO
                      ↓         ↓
                  Use :pt!   [3] Can you use utility classes?
                                ↓         ↓
                               YES       NO
                                ↓         ↓
                           Use utils! [4] STOP & ASK
```

## 🎯 Step-by-Step Process

### Step 1: PrimeVue Theme Variables (Design Tokens)
**Always check these first:**

#### Colors:
```css
/* Primary colors */
var(--p-primary-color)
var(--p-primary-50) through var(--p-primary-950)

/* Surface colors */
var(--p-surface-0)      /* White in light, dark in dark mode */
var(--p-surface-50)     /* Very light gray */
var(--p-surface-800)    /* Dark gray */
var(--p-surface-900)    /* Very dark gray */

/* Text colors */
var(--p-text-color)           /* Main text color */
var(--p-text-muted-color)     /* Muted text */

/* Semantic colors */
var(--p-red-500)        /* Error color */
var(--p-green-500)      /* Success color */
var(--p-yellow-500)     /* Warning color */
var(--p-blue-500)       /* Info color */
```

#### Spacing & Layout:
```css
/* Border radius */
var(--p-border-radius)
var(--p-border-radius-sm)
var(--p-border-radius-lg)

/* Focus ring */
var(--p-focus-ring-width)
var(--p-focus-ring-color)
var(--p-focus-ring-shadow)
```

### Step 2: PrimeVue Passthrough (`:pt`) System
**Use for component-specific styling:**

```vue
<!-- Custom button styling -->
<Button 
  label="Special Button"
  :pt="{
    root: { 
      class: 'hover:scale-105 transition-transform',
      style: {
        background: 'var(--p-primary-color)',
        borderColor: 'var(--p-primary-color)'
      }
    },
    label: { class: 'font-bold text-sm' }
  }"
/>

<!-- Custom input styling -->
<InputText 
  v-model="value"
  :pt="{
    root: { 
      class: 'border-2 rounded-lg',
      style: {
        borderColor: 'var(--p-surface-300)',
        backgroundColor: 'var(--p-surface-0)'
      }
    }
  }"
/>
```

### Step 3: Utility Classes
**Use Tailwind or PrimeVue utilities:**

```vue
<!-- Tailwind utilities with theme variables -->
<div class="p-4 rounded-lg border" 
     style="
       background-color: var(--p-surface-50);
       border-color: var(--p-surface-200);
       color: var(--p-text-color);
     ">
  Content
</div>

<!-- PrimeVue spacing utilities -->
<div class="p-space-4 m-space-2">
  Content with PrimeVue spacing
</div>
```

### Step 4: Request Approval for Custom CSS
**Use this template:**

---

**🛑 Custom CSS Approval Request**

**Styling Need**: [Describe what styling you need]

**Design Token Research**:
- ✅ Checked variables: [List theme variables considered]
- ❌ Gap: [Explain why theme variables don't work]

**Alternatives Considered**:
- `:pt` system: [Tried passthrough styling?]
- Utility classes: [Tried Tailwind + theme variables?]
- Component variants: [Different PrimeVue component?]

**Justification**: [Why custom CSS is necessary]

**Proposed CSS**: [Brief description/example of custom styles]

---

## 🎨 Common Styling Patterns

### ✅ Preferred Approaches:

#### Colors:
```vue
<!-- ✅ Use theme variables -->
<div :style="{ color: 'var(--p-primary-color)' }">Text</div>

<!-- ❌ Don't hardcode -->
<div style="color: #9333FF">Text</div>
```

#### Spacing:
```vue
<!-- ✅ Use consistent spacing -->
<div class="p-4 m-2">Content</div>

<!-- ❌ Don't use arbitrary values -->
<div style="padding: 13px; margin: 7px">Content</div>
```

#### Borders & Radius:
```vue
<!-- ✅ Use theme radius -->
<div :style="{ borderRadius: 'var(--p-border-radius)' }">Content</div>

<!-- ❌ Don't hardcode -->
<div style="border-radius: 8px">Content</div>
```

### 🎭 Advanced Patterns:

#### Responsive Design:
```vue
<!-- ✅ Combine utilities with theme variables -->
<div class="hidden md:block lg:flex" 
     :style="{ backgroundColor: 'var(--p-surface-100)' }">
  Responsive content
</div>
```

#### Dark Mode:
```css
/* ✅ Theme variables handle dark mode automatically */
.my-component {
  background-color: var(--p-surface-0);
  color: var(--p-text-color);
  border-color: var(--p-surface-200);
}

/* ❌ Don't manually handle dark mode */
.my-component {
  background-color: white;
  color: black;
}
.dark .my-component {
  background-color: #1a1a1a;
  color: white;
}
```

## 🚩 Custom CSS Red Flags:

- "I need a specific color" → Use theme color variables
- "I need custom spacing" → Use consistent spacing scale
- "I need hover effects" → Use `:pt` system
- "I need dark mode styles" → Theme variables handle this
- "I need rounded corners" → Use theme border radius

## ✅ Likely Approval Cases:

- Complex keyframe animations
- Third-party library integration styling
- Performance-critical optimizations
- Brand-specific visual effects beyond theming

## 📚 Quick Reference:

| Need | Solution |
|------|----------|
| Brand colors | `var(--p-primary-*)` |
| Background colors | `var(--p-surface-*)` |
| Text colors | `var(--p-text-color)` |
| Error/success colors | `var(--p-red-500)`, `var(--p-green-500)` |
| Spacing | Tailwind classes + theme vars |
| Border radius | `var(--p-border-radius)` |
| Focus styles | `var(--p-focus-ring-*)` |
| Component styling | `:pt` passthrough system |
| Hover effects | `:pt` with utility classes |
| Dark mode | Theme variables (automatic) |

Remember: **Design tokens ensure consistency, maintainability, and automatic dark mode support!**
