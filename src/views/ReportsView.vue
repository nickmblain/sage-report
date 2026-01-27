<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const reportsStore = useReportsStore()

const searchQuery = ref('')
const statusFilter = ref<string>('all')

const filteredReports = computed(() => {
  let filtered = reportsStore.reports

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.studentName.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }

  return [...filtered].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
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
        <h1 class="text-2xl font-bold text-charcoal-800">Reports</h1>
        <p class="text-charcoal-500 mt-1">Manage and review student reports</p>
      </div>
      <router-link to="/reports/new" class="btn btn-primary gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Report
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search reports..."
              class="input pl-10"
            />
          </div>
        </div>
        <select v-model="statusFilter" class="input w-full sm:w-48">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="generated">Generated</option>
          <option value="reviewed">Reviewed</option>
          <option value="sent">Sent</option>
        </select>
      </div>
    </div>

    <!-- Reports List -->
    <div v-if="filteredReports.length === 0" class="card text-center py-12">
      <svg class="w-12 h-12 text-charcoal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-charcoal-800">No reports found</h3>
      <p class="text-charcoal-500 mt-1">
        {{ searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first report to get started' }}
      </p>
      <router-link v-if="!searchQuery && statusFilter === 'all'" to="/reports/new" class="btn btn-primary mt-4">
        Create Report
      </router-link>
    </div>

    <div v-else class="space-y-3">
      <router-link
        v-for="report in filteredReports"
        :key="report.id"
        :to="`/reports/${report.id}`"
        class="card-hover block"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="font-medium text-charcoal-800">{{ report.title }}</h3>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                :class="getStatusColor(report.status)"
              >
                {{ report.status }}
              </span>
            </div>
            <p class="text-charcoal-500 mt-1">{{ report.studentName }}</p>
            <p class="text-sm text-charcoal-400 mt-2 line-clamp-2">
              {{ report.content.substring(0, 150) }}...
            </p>
          </div>
          <div class="text-right text-sm text-charcoal-400 ml-4">
            <p>{{ formatDate(report.updatedAt) }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </DashboardLayout>
</template>
