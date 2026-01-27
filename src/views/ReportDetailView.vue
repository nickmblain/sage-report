<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()
const reportsStore = useReportsStore()

const editing = ref(false)
const editedContent = ref('')
const saving = ref(false)

const report = computed(() =>
  reportsStore.getReport(route.params.id as string)
)

onMounted(() => {
  if (!report.value) {
    router.push('/reports')
  }
})

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-charcoal-100 text-charcoal-600',
    generated: 'bg-sage-100 text-sage-700',
    reviewed: 'bg-blue-100 text-blue-700',
    sent: 'bg-green-100 text-green-700',
  }
  return colors[status] || colors.draft
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function startEditing() {
  if (report.value) {
    editedContent.value = report.value.content
    editing.value = true
  }
}

function cancelEditing() {
  editing.value = false
  editedContent.value = ''
}

async function saveChanges() {
  if (!report.value) return

  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  reportsStore.updateReport(report.value.id, {
    content: editedContent.value,
    status: 'reviewed'
  })

  editing.value = false
  saving.value = false
}

function updateStatus(newStatus: 'draft' | 'generated' | 'reviewed' | 'sent') {
  if (!report.value) return
  reportsStore.updateReport(report.value.id, { status: newStatus })
}

function handleDelete() {
  if (!report.value) return
  if (confirm('Are you sure you want to delete this report?')) {
    reportsStore.deleteReport(report.value.id)
    router.push('/reports')
  }
}

function copyToClipboard() {
  if (!report.value) return
  navigator.clipboard.writeText(report.value.content)
}
</script>

<template>
  <DashboardLayout>
    <div v-if="report" class="max-w-4xl">
      <!-- Header -->
      <div class="mb-6">
        <router-link to="/reports" class="text-sage-600 hover:text-sage-700 text-sm font-medium inline-flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </router-link>

        <div class="flex items-start justify-between mt-2">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-charcoal-800">{{ report.title }}</h1>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium capitalize"
                :class="getStatusColor(report.status)"
              >
                {{ report.status }}
              </span>
            </div>
            <p class="text-charcoal-500 mt-1">{{ report.studentName }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!editing"
              @click="copyToClipboard"
              class="btn btn-secondary gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            <button
              v-if="!editing"
              @click="startEditing"
              class="btn btn-primary gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="card mb-6">
        <div v-if="editing">
          <textarea
            v-model="editedContent"
            class="input min-h-[400px] font-mono text-sm"
          ></textarea>
          <div class="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-charcoal-100">
            <button @click="cancelEditing" class="btn btn-secondary">
              Cancel
            </button>
            <button @click="saveChanges" :disabled="saving" class="btn btn-primary">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <div v-else class="prose prose-charcoal max-w-none">
          <div v-html="report.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card">
        <h3 class="font-medium text-charcoal-800 mb-4">Report Actions</h3>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="report.status !== 'reviewed'"
            @click="updateStatus('reviewed')"
            class="btn btn-secondary gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Reviewed
          </button>

          <button
            v-if="report.status !== 'sent'"
            @click="updateStatus('sent')"
            class="btn btn-primary gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Mark as Sent
          </button>

          <button
            @click="handleDelete"
            class="btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Report
          </button>
        </div>

        <div class="mt-6 pt-4 border-t border-charcoal-100 text-sm text-charcoal-500">
          <p>Created: {{ formatDate(report.createdAt) }}</p>
          <p>Last updated: {{ formatDate(report.updatedAt) }}</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
