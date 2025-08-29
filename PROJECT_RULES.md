# Project Custom Rules

## UI Component Standards

### Primary Rule: PrimeVue Components Only
**Always use PrimeVue UI components**

### Enhanced Rule: Custom Component Approval Required
**If a PrimeVue component cannot be used and a custom component needs to be created, STOP and ask for explicit approval before proceeding.**

## Implementation Guidelines

### Before Creating Custom Components:
1. **Research PrimeVue catalog** - Check if suitable component exists
2. **Consider composition** - Can multiple PrimeVue components solve the need?
3. **Evaluate customization** - Can PrimeVue's `:pt` system handle styling needs?
4. **Ask for approval** - If custom component is truly needed, request permission

### Approval Process:
- **Explain the gap** - What PrimeVue cannot provide
- **Show research** - Which PrimeVue components were considered
- **Justify necessity** - Why custom component is required
- **Wait for approval** - Get explicit "yes" before proceeding

### Examples:

#### ✅ Approved Scenarios:
- Complex business logic components (workflows, dashboards)
- Third-party integrations not covered by PrimeVue
- Performance-critical components with specific requirements

#### ❌ Likely Rejected:
- Basic UI elements (buttons, inputs, cards) - PrimeVue has these
- Simple styling variations - Use `:pt` customization instead
- Convenience wrappers - Use PrimeVue components directly

## Benefits:
- Maintains UI consistency
- Reduces maintenance overhead  
- Ensures PrimeVue theme integration
- Prevents duplicate functionality
- Forces consideration of PrimeVue solutions first

## Debugging Protocol
When debugging is required, follow structured approach:
1. Gather information (error messages, stack traces)
2. Use project tools (typecheck, build)
3. Identify root causes before changes
4. Think step-by-step for minimal solutions
5. Make proper fixes, not hacks
