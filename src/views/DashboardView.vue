<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const authStore = useAuthStore()
const reportsStore = useReportsStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const userName = computed(() =>
  authStore.user?.user_metadata?.full_name?.split(' ')[0] || 'there'
)

const stats = computed(() => [
  { label: 'Total Students', value: reportsStore.students.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'sage' },
  { label: 'Reports Generated', value: reportsStore.reports.length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'charcoal' },
  { label: 'Drafts', value: reportsStore.reportsByStatus.draft, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'cream' },
  { label: 'Sent', value: reportsStore.reportsByStatus.sent, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'sage' },
])

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
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-charcoal-800">
        {{ greeting }}, {{ userName }}!
      </h1>
      <p class="text-charcoal-500 mt-1">Here's what's happening with your reports</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="card flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="stat.color === 'sage' ? 'bg-sage-100' : stat.color === 'cream' ? 'bg-cream-200' : 'bg-charcoal-100'"
        >
          <svg
            class="w-6 h-6"
            :class="stat.color === 'sage' ? 'text-sage-600' : stat.color === 'cream' ? 'text-charcoal-600' : 'text-charcoal-600'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-charcoal-800">{{ stat.value }}</p>
          <p class="text-sm text-charcoal-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Reports -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-charcoal-800">Recent Reports</h2>
          <router-link to="/reports" class="text-sage-600 hover:text-sage-700 text-sm font-medium">
            View all
          </router-link>
        </div>

        <div v-if="reportsStore.recentReports.length === 0" class="text-center py-8 text-charcoal-500">
          No reports yet. Create your first report!
        </div>

        <div v-else class="space-y-3">
          <router-link
            v-for="report in reportsStore.recentReports"
            :key="report.id"
            :to="`/reports/${report.id}`"
            class="block p-4 rounded-lg border border-charcoal-100 hover:border-sage-200 hover:bg-cream-50 transition-all"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-charcoal-800">{{ report.title }}</h3>
                <p class="text-sm text-charcoal-500">{{ report.studentName }}</p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                :class="getStatusColor(report.status)"
              >
                {{ report.status }}
              </span>
            </div>
            <p class="text-xs text-charcoal-400 mt-2">
              Updated {{ formatDate(report.updatedAt) }}
            </p>
          </router-link>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-charcoal-800 mb-4">Quick Actions</h2>
          <div class="space-y-2">
            <router-link
              to="/reports/new"
              class="flex items-center gap-3 p-3 rounded-lg border border-charcoal-100 hover:border-sage-200 hover:bg-cream-50 transition-all"
            >
              <div class="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-charcoal-800">Generate Report</p>
                <p class="text-xs text-charcoal-500">Create AI-powered report</p>
              </div>
            </router-link>

            <router-link
              to="/students"
              class="flex items-center gap-3 p-3 rounded-lg border border-charcoal-100 hover:border-sage-200 hover:bg-cream-50 transition-all"
            >
              <div class="w-10 h-10 bg-cream-200 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-charcoal-800">Add Student</p>
                <p class="text-xs text-charcoal-500">Manage your roster</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- AI Tips -->
        <div class="bg-sage-50 border border-sage-100 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-sage-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-sage-800">AI Tip</h3>
              <p class="text-sm text-sage-600 mt-1">
                Add specific notes about student achievements when generating reports for more personalized content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
