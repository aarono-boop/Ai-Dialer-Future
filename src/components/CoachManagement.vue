<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">Coach Management</h1>
          <p class="text-gray-400">Create and manage AI coaches for your team</p>
        </div>
        <Button
          label="Create New Coach"
          icon="pi pi-plus"
          @click="navigateToCreateCoach"
          class="bg-blue-600 hover:bg-blue-700"
        />
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-4 p-2.5">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-users text-xl text-white"></i>
              </div>
              <div>
                <h3 class="font-semibold">Total Coaches</h3>
                <p class="text-2xl font-bold">{{ coachList.length }}</p>
              </div>
            </div>
          </template>
        </Card>
        
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-4 p-2.5">
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-check text-xl text-white"></i>
              </div>
              <div>
                <h3 class="font-semibold">Active Coaches</h3>
                <p class="text-2xl font-bold">{{ activeCoaches.length }}</p>
              </div>
            </div>
          </template>
        </Card>
        
        <Card class="bg-gray-800 border-gray-700">
          <template #content>
            <div class="flex items-center gap-4 p-2.5">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-video text-xl text-white"></i>
              </div>
              <div>
                <h3 class="font-semibold">With Videos</h3>
                <p class="text-2xl font-bold">{{ coachesWithVideos.length }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Coach Grid -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Your Coaches</h2>
          <div class="flex gap-2">
            <Button
              :label="exportLoading ? 'Exporting...' : 'Export Config'"
              icon="pi pi-download"
              severity="secondary"
              size="small"
              @click="handleExport"
              :loading="exportLoading"
            />
            <Button
              label="Import Config"
              icon="pi pi-upload"
              severity="secondary"
              size="small"
              @click="handleImportClick"
            />
          </div>
        </div>

        <div v-if="coachList.length === 0" class="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <i class="pi pi-users text-4xl text-gray-500 mb-4"></i>
          <h3 class="text-lg font-semibold mb-2">No coaches yet</h3>
          <p class="text-gray-400 mb-4">Create your first coach to get started</p>
          <Button
            label="Create First Coach"
            icon="pi pi-plus"
            @click="navigateToCreateCoach"
          />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="coach in coachList"
            :key="coach.id"
            class="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            @click="viewCoach(coach)"
          >
            <template #content>
              <div class="flex items-start gap-4 p-2.5">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <img
                    v-if="coach.avatarUrl"
                    :src="coach.avatarUrl"
                    :alt="coach.displayName"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                  >
                    <span class="text-white font-semibold text-lg">{{ coach.displayName.charAt(0) }}</span>
                  </div>
                </div>

                <!-- Coach Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-lg truncate">{{ coach.displayName }}</h3>
                  <p class="text-gray-400 text-sm mb-2">?coach={{ coach.name }}</p>
                  
                  <!-- Features -->
                  <div class="flex gap-2 mb-3">
                    <Badge
                      v-if="coach.videoId"
                      value="Video"
                      severity="info"
                      class="text-xs"
                    />
                    <Badge
                      v-if="coach.avatarUrl"
                      value="Custom Avatar"
                      severity="success"
                      class="text-xs"
                    />
                    <Badge
                      v-if="coach.createdBy === 'system'"
                      value="System"
                      severity="warn"
                      class="text-xs"
                    />
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <Button
                      label="Test"
                      size="small"
                      severity="secondary"
                      @click.stop="testCoach(coach)"
                      class="flex-1"
                    />
                    <Button
                      label="Copy URL"
                      size="small"
                      severity="secondary"
                      @click.stop="copyCoachUrl(coach)"
                      class="flex-1"
                    />
                    <Button
                      v-if="coach.createdBy !== 'system'"
                      icon="pi pi-pencil"
                      size="small"
                      severity="secondary"
                      @click.stop="editCoach(coach)"
                      aria-label="Edit coach"
                    />
                    <Button
                      v-if="managementMode === 'admin' && coach.createdBy !== 'system'"
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      @click.stop="confirmDelete(coach)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Instructions for Colleagues -->
      <Card class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="font-semibold p-4 pb-0">Share with Colleagues</h3>
        </template>
        <template #content>
          <p class="text-gray-400 mb-4">
            Share these URLs with your colleagues to let them create and manage coaches:
          </p>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="font-medium">Coach Creation</p>
                <code class="text-sm text-blue-400">{{ baseUrl }}?create-coach=true</code>
              </div>
              <Button
                icon="pi pi-copy"
                size="small"
                severity="secondary"
                @click="copyToClipboard(`${baseUrl}?create-coach=true`)"
              />
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="font-medium">Coach Management</p>
                <code class="text-sm text-blue-400">{{ baseUrl }}?manage-coaches=true</code>
              </div>
              <Button
                icon="pi pi-copy"
                size="small"
                severity="secondary"
                @click="copyToClipboard(`${baseUrl}?manage-coaches=true`)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>


    <!-- Coach Details Modal -->
    <Dialog
      v-model:visible="showDetailsModal"
      modal
      :header="selectedCoach?.displayName || 'Coach Details'"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div v-if="selectedCoach" class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
          <img
            v-if="selectedCoach.avatarUrl"
            :src="selectedCoach.avatarUrl"
            :alt="selectedCoach.displayName"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
          >
            <span class="text-white font-semibold text-xl">{{ selectedCoach.displayName.charAt(0) }}</span>
          </div>
          <div>
            <h3 class="text-xl font-bold">{{ selectedCoach.displayName }}</h3>
            <p class="text-gray-400">?coach={{ selectedCoach.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Created</label>
            <p class="text-gray-400">{{ formatDate(selectedCoach.createdAt) }}</p>
          </div>
          <div>
            <label class="font-semibold">Created By</label>
            <p class="text-gray-400">{{ selectedCoach.createdBy || 'Unknown' }}</p>
          </div>
        </div>

        <div v-if="selectedCoach.welcomeMessage">
          <label class="font-semibold">Welcome Message</label>
          <div class="mt-2 p-3 bg-gray-700 rounded-lg text-sm" v-html="selectedCoach.welcomeMessage"></div>
        </div>

        <div v-if="selectedCoach.videoId" class="space-y-2">
          <label class="font-semibold">Video Preview</label>
          <div class="aspect-video bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              :src="`https://www.youtube.com/embed/${selectedCoach.videoId}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Edit Coach Modal -->
    <Dialog
      v-model:visible="showEditModal"
      modal
      :header="`Edit ${editingCoach?.displayName || 'Coach'}`"
      :style="{ width: '40rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div v-if="editingCoach" class="space-y-4">
        <!-- Current Avatar -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-white">Current Avatar</label>
          <div class="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
            <img
              v-if="editingCoach.avatarUrl && !editingCoach.avatarUrl.startsWith('blob:')"
              :src="editingCoach.avatarUrl"
              :alt="editingCoach.displayName"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
            >
              <span class="text-white font-semibold text-lg">{{ editingCoach.displayName.charAt(0) }}</span>
            </div>
            <div>
              <p class="text-white font-medium">{{ editingCoach.displayName }}</p>
              <p v-if="editingCoach.avatarUrl && editingCoach.avatarUrl.startsWith('blob:')" class="text-red-400 text-sm">
                ⚠️ Avatar broken (invalid URL)
              </p>
              <p v-else-if="editingCoach.avatarUrl" class="text-green-400 text-sm">
                ✓ Avatar working
              </p>
              <p v-else class="text-gray-400 text-sm">
                No custom avatar
              </p>
            </div>
          </div>
        </div>

        <!-- Upload New Avatar -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-white">Upload New Avatar</label>
          <div
            class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
            @click="triggerEditFileUpload"
            @dragover.prevent
            @drop="handleEditImageDrop"
          >
            <div v-if="!editImagePreview" class="flex flex-col items-center gap-2">
              <i class="pi pi-cloud-upload text-3xl text-gray-400"></i>
              <p class="text-gray-400">Click or drag to upload new avatar</p>
              <small class="text-gray-500">PNG, JPG up to 2MB</small>
            </div>
            <div v-else class="flex flex-col items-center gap-2">
              <img :src="editImagePreview" alt="New avatar preview" class="w-16 h-16 rounded-full object-cover" />
              <p class="text-gray-400">New avatar ready</p>
              <Button
                text
                severity="danger"
                size="small"
                @click.stop="removeEditImage"
                label="Remove"
                icon="pi pi-times"
              />
            </div>
          </div>
          <input
            ref="editFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleEditImageSelect"
          />
        </div>

        <!-- Custom Welcome Message -->
        <div class="flex flex-col gap-2">
          <label for="editCustomMessage" class="font-semibold text-white">Custom Welcome Message</label>
          <Textarea
            id="editCustomMessage"
            v-model="editCustomMessage"
            rows="4"
            class="w-full"
            placeholder="Leave empty to use default message format"
          />
          <small class="text-gray-400">
            Default: "Welcome to ARKON! I'm your AI calling assistant, enhanced with [Coach Name]'s proven methodologies."
          </small>
          <div v-if="editCustomMessage" class="mt-2 border border-gray-600 rounded-lg p-3">
            <label class="text-sm font-semibold text-gray-300">Preview:</label>
            <div class="mt-2 bg-gray-800/90 border border-white/20 rounded-lg p-3 text-sm" v-html="getEditMessagePreview()"></div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Cancel"
            severity="secondary"
            @click="cancelEdit"
          />
          <Button
            label="Save Changes"
            :loading="isUpdating"
            @click="saveCoachEdit"
            :disabled="!hasChanges"
          />
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />

    <!-- Hidden file input for import -->
    <input
      ref="importFileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Coach, CoachCreateData } from '../types/coach'
import { useCoaches } from '../composables/useCoaches'

// Composables
const {
  coachList,
  managementMode,
  addCoach,
  removeCoach,
  updateCoach,
  exportCoaches,
  importCoaches,
  generateCoachUrl,
  setManagementMode
} = useCoaches()

const confirm = useConfirm()
const toast = useToast()

// State
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedCoach = ref<Coach | null>(null)
const editingCoach = ref<Coach | null>(null)
const editImagePreview = ref<string | null>(null)
const editCustomMessage = ref<string>('')
const editFileInput = ref<HTMLInputElement | null>(null)
const isUpdating = ref(false)
const exportLoading = ref(false)
const importFileInput = ref<HTMLInputElement | null>(null)

// Computed
const activeCoaches = computed(() => coachList.value.filter(coach => coach.isActive !== false))
const coachesWithVideos = computed(() => coachList.value.filter(coach => coach.videoId))
const baseUrl = computed(() => `${window.location.origin}${window.location.pathname}`)
const isBrokenAvatar = computed(() => {
  return editingCoach.value?.avatarUrl?.startsWith('blob:') || false
})

const hasChanges = computed(() => {
  if (!editingCoach.value) return false
  const hasImageChange = editImagePreview.value || isBrokenAvatar.value
  const hasMessageChange = editCustomMessage.value !== (editingCoach.value.welcomeMessage || '')
  return hasImageChange || hasMessageChange
})

// Methods
const navigateToCreateCoach = () => {
  // Update URL to navigate to create coach page
  const url = new URL(window.location.href)
  url.searchParams.set('create-coach', 'true')
  window.location.href = url.toString()
}

const handleCoachCreated = async (coachData: CoachCreateData) => {
  try {
    const newCoach = await addCoach(coachData)
    toast.add({
      severity: 'success',
      summary: 'Coach Created',
      detail: `${newCoach.displayName} is now available at ?coach=${newCoach.name}`,
      life: 5000
    })
  } catch (error) {
    console.error('Error creating coach:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create coach. Please try again.',
      life: 3000
    })
  }
}

const viewCoach = (coach: Coach) => {
  selectedCoach.value = coach
  showDetailsModal.value = true
}

const testCoach = (coach: Coach) => {
  const url = generateCoachUrl(coach.name)
  window.open(url, '_blank')
}

const copyCoachUrl = async (coach: Coach) => {
  const url = generateCoachUrl(coach.name)
  await copyToClipboard(url)
  toast.add({
    severity: 'success',
    summary: 'URL Copied',
    detail: `Coach URL for ${coach.displayName} copied to clipboard`,
    life: 3000
  })
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const confirmDelete = (coach: Coach) => {
  confirm.require({
    message: `Are you sure you want to delete ${coach.displayName}? This action cannot be undone.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      if (removeCoach(coach.id)) {
        toast.add({
          severity: 'success',
          summary: 'Coach Deleted',
          detail: `${coach.displayName} has been removed`,
          life: 3000
        })
      }
    }
  })
}

const handleExport = async () => {
  exportLoading.value = true
  try {
    const config = exportCoaches()
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `arkon-coaches-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    toast.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'Coach configuration downloaded successfully',
      life: 3000
    })
  } catch (error) {
    console.error('Export error:', error)
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: 'Failed to export coach configuration',
      life: 3000
    })
  } finally {
    exportLoading.value = false
  }
}

const handleImportClick = () => {
  importFileInput.value?.click()
}

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      if (importCoaches(content)) {
        toast.add({
          severity: 'success',
          summary: 'Import Complete',
          detail: 'Coach configuration imported successfully',
          life: 3000
        })
      } else {
        throw new Error('Invalid format')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.add({
        severity: 'error',
        summary: 'Import Failed',
        detail: 'Failed to import coach configuration. Please check the file format.',
        life: 3000
      })
    }
  }
  reader.readAsText(file)
  
  // Reset input
  if (importFileInput.value) {
    importFileInput.value.value = ''
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

// Edit coach functionality
const editCoach = (coach: Coach) => {
  editingCoach.value = coach
  editImagePreview.value = null
  editCustomMessage.value = coach.welcomeMessage || ''
  showEditModal.value = true
}

const getEditMessagePreview = () => {
  if (!editingCoach.value || !editCustomMessage.value) return ''
  return editCustomMessage.value.replace(/\[Coach Name\]/g, editingCoach.value.displayName)
}

const triggerEditFileUpload = () => {
  editFileInput.value?.click()
}

const handleEditImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    validateAndSetEditImage(file)
  }
}

const handleEditImageDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetEditImage(file)
  }
}

const validateAndSetEditImage = (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'error',
      summary: 'Invalid File',
      detail: 'Please select an image file',
      life: 3000
    })
    return
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: 'File Too Large',
      detail: 'Image must be less than 2MB',
      life: 3000
    })
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    editImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeEditImage = () => {
  editImagePreview.value = null
  if (editFileInput.value) {
    editFileInput.value.value = ''
  }
}

const saveCoachEdit = async () => {
  if (!editingCoach.value) return

  // Check if we have changes to save
  const hasImageChange = editImagePreview.value || isBrokenAvatar.value
  const hasMessageChange = editCustomMessage.value !== (editingCoach.value.welcomeMessage || '')

  if (!hasImageChange && !hasMessageChange) {
    toast.add({
      severity: 'warn',
      summary: 'No Changes',
      detail: 'Please make changes to save',
      life: 3000
    })
    return
  }

  isUpdating.value = true

  try {
    let updates: Partial<Coach> = {}

    if (editImagePreview.value) {
      // New image uploaded
      updates.avatarUrl = editImagePreview.value
    } else if (isBrokenAvatar.value) {
      // Remove broken blob URL
      updates.avatarUrl = undefined
    }

    if (hasMessageChange) {
      // Update welcome message
      updates.welcomeMessage = editCustomMessage.value
    }

    // Update the coach
    const success = updateCoach(editingCoach.value.id, updates)

    if (success) {
      let message = `${editingCoach.value.displayName} has been updated`
      if (editImagePreview.value && hasMessageChange) {
        message = `${editingCoach.value.displayName}'s avatar and welcome message have been updated`
      } else if (editImagePreview.value) {
        message = `${editingCoach.value.displayName}'s avatar has been updated`
      } else if (hasMessageChange) {
        message = `${editingCoach.value.displayName}'s welcome message has been updated`
      } else if (isBrokenAvatar.value) {
        message = `${editingCoach.value.displayName}'s broken avatar has been removed`
      }

      toast.add({
        severity: 'success',
        summary: 'Coach Updated',
        detail: message,
        life: 3000
      })
      cancelEdit()
    } else {
      throw new Error('Failed to update coach')
    }
  } catch (error) {
    console.error('Error updating coach:', error)
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: 'Failed to update coach. Please try again.',
      life: 3000
    })
  } finally {
    isUpdating.value = false
  }
}

const cancelEdit = () => {
  showEditModal.value = false
  editingCoach.value = null
  editImagePreview.value = null
  editCustomMessage.value = ''
  if (editFileInput.value) {
    editFileInput.value.value = ''
  }
}
</script>

<style scoped>
:deep(.p-card) {
  background-color: #1f2937;
  border: 1px solid #374151;
}

:deep(.p-card .p-card-content) {
  color: white;
}

:deep(.p-dialog .p-dialog-content) {
  background-color: #1f2937;
  color: white;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: #111827;
  color: white;
  border-bottom: 1px solid #374151;
}

:deep(.p-badge) {
  font-size: 0.75rem;
}
</style>
