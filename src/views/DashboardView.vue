<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReportsStore } from '@/stores/reports'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

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
  { label: 'Total Students', value: reportsStore.students.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'sage', change: '+2 this week' },
  { label: 'Reports Generated', value: reportsStore.reports.length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'charcoal', change: '+5 this month' },
  { label: 'Pending Review', value: reportsStore.reportsByStatus.generated + reportsStore.reportsByStatus.draft, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'tan', change: 'Needs attention' },
  { label: 'Sent to Parents', value: reportsStore.reportsByStatus.sent, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'sage', change: '100% delivery' },
])

// Chart data
const activityChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Reports Generated',
      data: [2, 4, 3, 5, 4, 1, 2],
      borderColor: '#177d83',
      backgroundColor: 'rgba(23, 125, 131, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#177d83',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }
  ]
}))

const activityChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'Instrument Sans' },
      bodyFont: { family: 'Instrument Sans' },
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Instrument Sans', size: 12 },
        color: '#858585'
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f5f5f5' },
      ticks: {
        font: { family: 'Instrument Sans', size: 12 },
        color: '#858585',
        stepSize: 1
      }
    }
  }
}

const statusChartData = computed(() => ({
  labels: ['Draft', 'Generated', 'Reviewed', 'Sent'],
  datasets: [
    {
      data: [
        reportsStore.reportsByStatus.draft || 1,
        reportsStore.reportsByStatus.generated || 2,
        reportsStore.reportsByStatus.reviewed || 1,
        reportsStore.reportsByStatus.sent || 3
      ],
      backgroundColor: [
        '#c2c2c2',
        '#74c4c8',
        '#bab2ff',
        '#177d83'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}))

const statusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: { family: 'Instrument Sans', size: 12 },
        color: '#4a4a4a',
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'Instrument Sans' },
      bodyFont: { family: 'Instrument Sans' },
      padding: 12,
      cornerRadius: 8,
    }
  }
}

const gradeChartData = computed(() => ({
  labels: ['4th Grade', '5th Grade'],
  datasets: [
    {
      label: 'Students',
      data: [2, 3],
      backgroundColor: ['#9cd4d7', '#177d83'],
      borderRadius: 8,
      borderSkipped: false,
    }
  ]
}))

const gradeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'Instrument Sans' },
      bodyFont: { family: 'Instrument Sans' },
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Instrument Sans', size: 12 },
        color: '#858585'
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f5f5f5' },
      ticks: {
        font: { family: 'Instrument Sans', size: 12 },
        color: '#858585',
        stepSize: 1
      }
    }
  }
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-charcoal-100 text-charcoal-600',
    generated: 'bg-sage-100 text-sage-700',
    reviewed: 'bg-purple text-purple-900',
    sent: 'bg-green-lighter text-sage-800',
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
          :class="{
            'bg-sage-100': stat.color === 'sage',
            'bg-cream-200': stat.color === 'cream',
            'bg-tan-lighter': stat.color === 'tan',
            'bg-charcoal-100': stat.color === 'charcoal'
          }"
        >
          <svg
            class="w-6 h-6"
            :class="{
              'text-sage-600': stat.color === 'sage',
              'text-charcoal-600': stat.color === 'charcoal' || stat.color === 'cream',
              'text-tan-dark': stat.color === 'tan'
            }"
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
          <p class="text-xs text-sage-600 mt-0.5">{{ stat.change }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Activity Chart -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-charcoal-800">Report Activity</h2>
            <p class="text-sm text-charcoal-500">Reports generated this week</p>
          </div>
          <select class="text-sm border border-charcoal-200 rounded-lg px-3 py-1.5 text-charcoal-600 bg-white">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
        </div>
        <div class="h-64">
          <Line :data="activityChartData" :options="activityChartOptions" />
        </div>
      </div>

      <!-- Status Doughnut -->
      <div class="card">
        <h2 class="text-lg font-semibold text-charcoal-800 mb-2">Report Status</h2>
        <p class="text-sm text-charcoal-500 mb-4">Distribution by status</p>
        <div class="h-56">
          <Doughnut :data="statusChartData" :options="statusChartOptions" />
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
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
            v-for="report in reportsStore.recentReports.slice(0, 4)"
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

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Grade Distribution -->
        <div class="card">
          <h2 class="text-lg font-semibold text-charcoal-800 mb-2">Students by Grade</h2>
          <p class="text-sm text-charcoal-500 mb-4">Class distribution</p>
          <div class="h-40">
            <Bar :data="gradeChartData" :options="gradeChartOptions" />
          </div>
        </div>

        <!-- Quick Actions -->
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
      </div>
    </div>
  </DashboardLayout>
</template>
