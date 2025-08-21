// ESLint rules to enforce design system usage
// Add these rules to your main ESLint config

module.exports = {
  rules: {
    // Prevent direct PrimeVue component imports
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'primevue/button',
            message: 'Use DSButton from @/design-system/components instead'
          },
          {
            name: 'primevue/card', 
            message: 'Use DSCard from @/design-system/components instead'
          },
          {
            name: 'primevue/inputtext',
            message: 'Use DSInput from @/design-system/components instead'
          }
        ],
        patterns: [
          {
            group: ['primevue/*'],
            message: 'Use design system components from @/design-system/components instead of importing PrimeVue components directly'
          }
        ]
      }
    ],
    
    // Prevent hardcoded colors (you can add more patterns)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
        message: 'Use design tokens from @/design-system/tokens instead of hardcoded hex colors'
      },
      {
        selector: 'Literal[value=/^rgb\\(/]',
        message: 'Use design tokens from @/design-system/tokens instead of hardcoded RGB colors'
      }
    ]
  }
}

// To use these rules, add this to your main .eslintrc.js:
// {
//   "extends": ["./.eslintrc-design-system.js"],
//   // ... other config
// }
