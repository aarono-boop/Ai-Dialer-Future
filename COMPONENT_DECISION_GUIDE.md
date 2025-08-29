# PrimeVue Component Decision Guide

## 🚦 Decision Flowchart

```
Need a UI component?
        ↓
[1] Search PrimeVue catalog
        ↓
    Component exists?
        ↓              ↓
       YES            NO
        ↓              ↓
    Use it!        [2] Can you compose?
                      ↓         ↓
                     YES       NO
                      ↓         ↓
                  Compose!   [3] Can you customize?
                                ↓         ↓
                               YES       NO
                                ↓         ↓
                           Customize! [4] STOP & ASK
```

## 📋 Step-by-Step Process

### Step 1: Search PrimeVue Catalog
**Resources:**
- [PrimeVue Components](https://primevue.org/components/)
- Project's `src/design-system/tokens/primevue/` (configured components)

**Common PrimeVue Components:**
- **Forms**: InputText, Textarea, Dropdown, Calendar, Checkbox, RadioButton
- **Buttons**: Button (with severity, outlined, text variants)
- **Layout**: Panel, Card, Divider, Splitter
- **Navigation**: TabView, Breadcrumb, Steps, Menu
- **Data**: DataTable, Tree, Carousel
- **Overlays**: Dialog, OverlayPanel, Tooltip
- **Messages**: Toast, Message, ConfirmDialog

### Step 2: Composition Strategy
**Combine multiple PrimeVue components:**
```vue
<!-- Example: Search with results -->
<template>
  <div class="search-component">
    <InputText v-model="query" placeholder="Search..." />
    <Button icon="pi pi-search" @click="search" />
    <DataTable :value="results" />
  </div>
</template>
```

### Step 3: Customization via Passthrough
**Use PrimeVue's `:pt` system:**
```vue
<!-- Custom styled button -->
<Button 
  label="Special Button"
  :pt="{
    root: { class: 'custom-gradient hover:scale-105' },
    label: { class: 'font-bold' }
  }"
/>
```

### Step 4: Request Approval
**Use this template:**

---

**🛑 Custom Component Approval Request**

**Component Need**: [Describe what you need]

**PrimeVue Research**:
- ✅ Checked: [List components considered]
- ❌ Gap: [Explain why they don't work]

**Alternatives Considered**:
- Composition: [Tried combining X + Y components?]
- Customization: [Tried `:pt` styling?]
- Workarounds: [Any other approaches?]

**Justification**: [Why custom component is necessary]

**Proposal**: [Brief description of custom component]

---

## ⚡ Quick Reference

### Most Common Needs & Solutions:

| Need | PrimeVue Solution |
|------|------------------|
| Form input | `InputText`, `Textarea`, `Password` |
| Dropdown/Select | `Dropdown`, `MultiSelect` |
| Date picker | `Calendar` |
| File upload | `FileUpload` |
| Rich text | `Editor` |
| Data display | `DataTable`, `DataView` |
| Navigation | `TabView`, `Breadcrumb`, `Menu` |
| Modals | `Dialog`, `OverlayPanel` |
| Notifications | `Toast`, `Message` |
| Loading states | `ProgressSpinner`, `ProgressBar` |

### Custom Component Red Flags 🚩:
- "I need a button with different colors" → Use Button + `:pt` + theme variables
- "I need a custom input" → Use InputText + `:pt` styling
- "I need a card layout" → Use Card component
- "I need a modal" → Use Dialog component

> 💡 **Styling Tip**: For styling needs, see [STYLING_DECISION_GUIDE.md](./STYLING_DECISION_GUIDE.md) - always try design tokens before custom CSS!

### Likely Approval Cases ✅:
- Complex business workflows
- Third-party service integrations  
- Performance-critical visualizations
- Domain-specific components (beyond basic UI)

Remember: **When in doubt, ask!** It's better to check than create unnecessary custom components.
