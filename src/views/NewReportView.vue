<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BlobButton from '@/components/BlobButton.vue'
import BlobLink from '@/components/BlobLink.vue'

const router = useRouter()
const reportsStore = useReportsStore()

const studentId = ref('')
const reportType = ref<'progress' | 'behavioral' | 'academic' | 'iep'>('progress')
const period = ref('Q1 2026')
const notes = ref('')
const strengthsInput = ref('')
const areasInput = ref('')
const error = ref('')

const reportTypes = [
  { value: 'progress', label: 'Progress Report', description: 'General academic and social progress' },
  { value: 'behavioral', label: 'Behavioral Report', description: 'Classroom behavior and social skills' },
  { value: 'academic', label: 'Academic Report', description: 'Detailed academic performance' },
  { value: 'iep', label: 'IEP Progress', description: 'Individualized Education Program goals' },
]

const periods = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Fall 2026', 'Spring 2026', 'Annual 2026']

const selectedStudent = computed(() =>
  reportsStore.students.find(s => s.id === studentId.value)
)

const canGenerate = computed(() =>
  studentId.value && reportType.value && period.value
)

async function handleGenerate() {
  if (!canGenerate.value) return

  error.value = ''

  try {
    const strengths = strengthsInput.value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const areas = areasInput.value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const report = await reportsStore.generateReport({
      studentId: studentId.value,
      reportType: reportType.value,
      period: period.value,
      notes: notes.value || undefined,
      strengths: strengths.length ? strengths : undefined,
      areasForGrowth: areas.length ? areas : undefined,
    })

    router.push(`/reports/${report.id}`)
  } catch (e: any) {
    error.value = e.message || 'Failed to generate report'
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="max-w-3xl">
      <div class="mb-6">
        <router-link to="/reports" class="text-sage-600 hover:text-sage-700 text-sm font-medium inline-flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </router-link>
        <h1 class="text-2xl font-bold text-charcoal-800 mt-2">Generate New Report</h1>
        <p class="text-charcoal-500 mt-1">Use AI to create a personalized student report</p>
      </div>

      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
        {{ error }}
      </div>

      <div class="card">
        <form @submit.prevent="handleGenerate" class="space-y-6">
          <!-- Student Selection -->
          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-2">Select Student</label>
            <select v-model="studentId" class="input" required>
              <option value="" disabled>Choose a student...</option>
              <option v-for="student in reportsStore.students" :key="student.id" :value="student.id">
                {{ student.name }} - {{ student.grade }}
              </option>
            </select>
          </div>

          <!-- Report Type -->
          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-2">Report Type</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                v-for="type in reportTypes"
                :key="type.value"
                class="relative flex items-start p-4 rounded-lg border cursor-pointer transition-all"
                :class="reportType === type.value
                  ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-500'
                  : 'border-charcoal-200 hover:border-sage-300'"
              >
                <input
                  type="radio"
                  :value="type.value"
                  v-model="reportType"
                  class="sr-only"
                />
                <div>
                  <p class="font-medium text-charcoal-800">{{ type.label }}</p>
                  <p class="text-sm text-charcoal-500">{{ type.description }}</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Period -->
          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-2">Reporting Period</label>
            <select v-model="period" class="input">
              <option v-for="p in periods" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <!-- AI Enhancement Options -->
          <div class="border-t border-charcoal-100 pt-6">
            <h3 class="text-sm font-medium text-charcoal-700 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Enhancement Options
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-charcoal-700 mb-2">
                  Student Strengths
                  <span class="font-normal text-charcoal-400">(one per line)</span>
                </label>
                <textarea
                  v-model="strengthsInput"
                  class="input min-h-[80px]"
                  placeholder="e.g., Excellent reading comprehension&#10;Strong math skills&#10;Great teamwork"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-charcoal-700 mb-2">
                  Areas for Growth
                  <span class="font-normal text-charcoal-400">(one per line)</span>
                </label>
                <textarea
                  v-model="areasInput"
                  class="input min-h-[80px]"
                  placeholder="e.g., Time management&#10;Public speaking confidence"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-charcoal-700 mb-2">
                  Additional Notes
                  <span class="font-normal text-charcoal-400">(optional)</span>
                </label>
                <textarea
                  v-model="notes"
                  class="input min-h-[100px]"
                  placeholder="Add any specific observations, achievements, or context you'd like included in the report..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Selected Student Preview -->
          <div v-if="selectedStudent" class="bg-cream-50 rounded-lg p-4 border border-cream-200">
            <p class="text-sm text-charcoal-600">
              Generating <strong>{{ reportTypes.find(t => t.value === reportType)?.label }}</strong>
              for <strong>{{ selectedStudent.name }}</strong> ({{ selectedStudent.grade }})
              for <strong>{{ period }}</strong>
            </p>
          </div>

          <!-- Submit -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-100">
            <BlobLink to="/reports" variant="secondary" size="sm">
              Cancel
            </BlobLink>
            <BlobButton
              type="submit"
              :disabled="!canGenerate || reportsStore.generating"
              size="sm"
            >
              <template v-if="reportsStore.generating">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating with AI...
              </template>
              <template v-else>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Report
              </template>
            </BlobButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
