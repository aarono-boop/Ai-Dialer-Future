<template>
  <div class="app">
    <div class="header">
      <h1 class="title">
        <i class="pi pi-star-fill"></i>
        Welcome to PrimeVue!
      </h1>
      <p class="subtitle">Your project is now powered by Vue 3 and PrimeVue components</p>
    </div>

    <div class="content">
      <div class="demo-section">
        <h2>Interactive Components Demo</h2>
        
        <div class="component-grid">
          <Card class="demo-card">
            <template #title>Buttons</template>
            <template #content>
              <div class="button-group">
                <Button label="Primary" />
                <Button label="Secondary" severity="secondary" />
                <Button label="Success" severity="success" />
                <Button label="Danger" severity="danger" />
              </div>
            </template>
          </Card>

          <Card class="demo-card">
            <template #title>Form Controls</template>
            <template #content>
              <div class="form-controls">
                <InputText v-model="inputValue" placeholder="Type something..." />
                <Calendar v-model="selectedDate" placeholder="Select a date" />
                <Dropdown 
                  v-model="selectedCity" 
                  :options="cities" 
                  optionLabel="name" 
                  placeholder="Select a City" 
                />
              </div>
            </template>
          </Card>

          <Card class="demo-card">
            <template #title>Data Display</template>
            <template #content>
              <DataTable :value="products" tableStyle="min-width: 50rem">
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="price" header="Price">
                  <template #body="slotProps">
                    ${{ slotProps.data.price }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <Card class="demo-card">
            <template #title>Messages & Toasts</template>
            <template #content>
              <div class="message-demo">
                <Button label="Show Toast" @click="showToast" />
                <Message severity="info" class="message-item">
                  This is an info message using PrimeVue Message component
                </Message>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

// Toast functionality
const toast = useToast()

// Reactive data
const inputValue = ref('')
const selectedDate = ref()
const selectedCity = ref()

const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
])

const products = ref([
  { name: 'Laptop', category: 'Electronics', price: 999 },
  { name: 'Smartphone', category: 'Electronics', price: 699 },
  { name: 'Coffee Maker', category: 'Appliances', price: 129 },
  { name: 'Desk Chair', category: 'Furniture', price: 299 }
])

const showToast = () => {
  toast.add({ 
    severity: 'success', 
    summary: 'Success', 
    detail: 'PrimeVue Toast is working!', 
    life: 3000 
  })
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.title i {
  color: #ffd700;
  margin-right: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.demo-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  margin: 0;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>
