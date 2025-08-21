<template>
  <div class="migration-example">
    <h2>Design System Migration Example</h2>
    
    <!-- ❌ OLD WAY: Direct PrimeVue usage -->
    <div class="old-way">
      <h3>❌ Before (Direct PrimeVue)</h3>
      <!-- 
      <Button class="btn-primary">Save Changes</Button>
      <Button class="btn-secondary">Cancel</Button>
      <Card>
        <template #title>User Profile</template>
        <template #content>
          <InputText placeholder="Enter name" />
        </template>
      </Card>
      -->
    </div>
    
    <!-- ✅ NEW WAY: Design System components -->
    <div class="new-way">
      <h3>✅ After (Design System)</h3>
      
      <div class="button-group">
        <DSButton variant="primary">Save Changes</DSButton>
        <DSButton variant="secondary">Cancel</DSButton>
        <DSButton variant="tertiary">Reset</DSButton>
      </div>
      
      <DSCard 
        title="User Profile" 
        subtitle="Manage your account information"
        variant="elevated"
        class="profile-card"
      >
        <div class="form-group">
          <DSInput
            v-model="userName"
            label="Full Name"
            placeholder="Enter your name"
            help-text="This will be displayed on your profile"
          />
          
          <DSInput
            v-model="userEmail"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            required
          />
        </div>
        
        <template #footer>
          <div class="card-actions">
            <DSButton variant="primary" size="small">Update Profile</DSButton>
            <DSButton variant="tertiary" size="small">Reset Form</DSButton>
          </div>
        </template>
      </DSCard>
    </div>
    
    <!-- Show design tokens usage -->
    <div class="token-examples">
      <h3>Design Tokens Usage</h3>
      
      <div class="color-examples">
        <div 
          v-for="(color, name) in colorExamples" 
          :key="name"
          class="color-swatch"
          :style="{ backgroundColor: color }"
        >
          {{ name }}
        </div>
      </div>
      
      <div class="spacing-examples">
        <div 
          v-for="(space, name) in spacingExamples"
          :key="name" 
          class="spacing-demo"
          :style="{ padding: space }"
        >
          {{ name }}: {{ space }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DSButton, DSCard, DSInput } from '@/design-system/components'
import { useDesignTokens } from '@/design-system/composables'

// Component state
const userName = ref('')
const userEmail = ref('')

// Design tokens usage
const { colors, spacing } = useDesignTokens()

const colorExamples = computed(() => ({
  'Primary 500': colors.primary[500],
  'Primary 600': colors.primary[600], 
  'Background Primary': colors.background.primary,
  'Text Primary': colors.text.primary
}))

const spacingExamples = computed(() => ({
  'Small (sm)': spacing[2],
  'Medium (md)': spacing[4],
  'Large (lg)': spacing[6],
  'Extra Large (xl)': spacing[8]
}))
</script>

<style scoped>
.migration-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.old-way,
.new-way,
.token-examples {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #374151;
  border-radius: 8px;
}

.old-way {
  background: rgba(239, 68, 68, 0.1);
  border-color: #dc2626;
}

.new-way {
  background: rgba(34, 197, 94, 0.1);
  border-color: #16a34a;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.profile-card {
  margin-top: 1rem;
}

.color-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.color-swatch {
  padding: 1rem;
  text-align: center;
  border-radius: 6px;
  color: white;
  font-weight: 500;
}

.spacing-examples {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spacing-demo {
  background: rgba(147, 51, 255, 0.2);
  border: 1px dashed #9333ff;
  border-radius: 4px;
  font-family: monospace;
}

h2, h3 {
  color: white;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  text-align: center;
}

h3 {
  font-size: 1.125rem;
}
</style>
