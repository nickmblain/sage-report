<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const reportsStore = useReportsStore()

const showAddModal = ref(false)
const searchQuery = ref('')

const newStudent = ref({
  name: '',
  grade: '',
  email: ''
})

const grades = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade']

const filteredStudents = computed(() => {
  if (!searchQuery.value) return reportsStore.students

  const query = searchQuery.value.toLowerCase()
  return reportsStore.students.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.grade.toLowerCase().includes(query)
  )
})

function getStudentReportCount(studentId: string) {
  return reportsStore.reports.filter(r => r.studentId === studentId).length
}

function addStudent() {
  if (!newStudent.value.name || !newStudent.value.grade) return

  reportsStore.addStudent({
    name: newStudent.value.name,
    grade: newStudent.value.grade,
    email: newStudent.value.email || undefined
  })

  newStudent.value = { name: '', grade: '', email: '' }
  showAddModal.value = false
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <DashboardLayout>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal-800">Students</h1>
        <p class="text-charcoal-500 mt-1">Manage your student roster</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Student
      </button>
    </div>

    <!-- Search -->
    <div class="card mb-6">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search students..."
          class="input pl-10"
        />
      </div>
    </div>

    <!-- Students Grid -->
    <div v-if="filteredStudents.length === 0" class="card text-center py-12">
      <svg class="w-12 h-12 text-charcoal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="text-lg font-medium text-charcoal-800">No students found</h3>
      <p class="text-charcoal-500 mt-1">
        {{ searchQuery ? 'Try adjusting your search' : 'Add your first student to get started' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="card-hover"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center text-sage-700 font-semibold text-lg">
            {{ student.name.split(' ').map(n => n[0]).join('') }}
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-charcoal-800">{{ student.name }}</h3>
            <p class="text-sm text-charcoal-500">{{ student.grade }}</p>
            <p v-if="student.email" class="text-xs text-charcoal-400 mt-1">{{ student.email }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <span class="text-sm text-charcoal-500">
            {{ getStudentReportCount(student.id) }} reports
          </span>
          <router-link
            :to="`/reports/new?student=${student.id}`"
            class="text-sage-600 hover:text-sage-700 text-sm font-medium"
          >
            Generate Report
          </router-link>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-charcoal-800 mb-4">Add New Student</h2>

        <form @submit.prevent="addStudent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-1">Full Name</label>
            <input
              v-model="newStudent.name"
              type="text"
              class="input"
              placeholder="e.g., Emma Johnson"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-1">Grade</label>
            <select v-model="newStudent.grade" class="input" required>
              <option value="" disabled>Select grade...</option>
              <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-charcoal-700 mb-1">
              Email <span class="font-normal text-charcoal-400">(optional)</span>
            </label>
            <input
              v-model="newStudent.email"
              type="email"
              class="input"
              placeholder="parent@email.com"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button type="button" @click="showAddModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
