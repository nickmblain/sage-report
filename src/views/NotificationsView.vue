<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const notifications = ref([
  {
    id: 1,
    title: 'Report Ready',
    message: 'Emma Johnson\'s progress report has been generated and is ready for review.',
    time: '5 min ago',
    date: 'Today',
    unread: true,
    icon: 'document'
  },
  {
    id: 2,
    title: 'Parent Feedback',
    message: 'Mrs. Thompson left a comment on Liam\'s report: "Thank you for the detailed feedback on his progress in reading!"',
    time: '1 hour ago',
    date: 'Today',
    unread: true,
    icon: 'chat'
  },
  {
    id: 3,
    title: 'Report Sent',
    message: 'Quarterly reports sent to 12 parents successfully. All emails were delivered without issues.',
    time: '3 hours ago',
    date: 'Today',
    unread: false,
    icon: 'mail'
  },
  {
    id: 4,
    title: 'New Student Added',
    message: 'Sofia Martinez has been added to your roster. You can now create reports for this student.',
    time: 'Yesterday',
    date: 'Yesterday',
    unread: false,
    icon: 'user'
  },
  {
    id: 5,
    title: 'Report Approved',
    message: 'The behavioral report for Marcus Williams has been approved by the principal.',
    time: '2 days ago',
    date: 'This Week',
    unread: false,
    icon: 'check'
  },
  {
    id: 6,
    title: 'Reminder',
    message: 'End of quarter reports are due in 5 days. You have 3 students without completed reports.',
    time: '3 days ago',
    date: 'This Week',
    unread: false,
    icon: 'alert'
  },
  {
    id: 7,
    title: 'System Update',
    message: 'Sage Report has been updated with new features including improved AI suggestions and faster report generation.',
    time: '1 week ago',
    date: 'Earlier',
    unread: false,
    icon: 'sparkle'
  }
])

function markAsRead(id: number) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.unread = false
  }
}

function markAllAsRead() {
  notifications.value.forEach(n => n.unread = false)
}

const unreadCount = notifications.value.filter(n => n.unread).length

const groupedNotifications = notifications.value.reduce((groups, notification) => {
  const date = notification.date
  if (!groups[date]) {
    groups[date] = []
  }
  groups[date].push(notification)
  return groups
}, {} as Record<string, typeof notifications.value>)
</script>

<template>
  <DashboardLayout>
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-charcoal-800">Notifications</h1>
          <p class="text-charcoal-500 mt-1">Stay updated on your reports and students</p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm text-sage-600 hover:text-sage-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div v-for="(items, date) in groupedNotifications" :key="date" class="mb-6">
        <h2 class="text-sm font-semibold text-charcoal-500 mb-3">{{ date }}</h2>
        <div class="card p-0 divide-y divide-charcoal-100">
          <div
            v-for="notification in items"
            :key="notification.id"
            @click="markAsRead(notification.id)"
            class="p-4 hover:bg-cream-50 cursor-pointer transition-colors"
            :class="{ 'bg-sage-50/30': notification.unread }"
          >
            <div class="flex gap-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="notification.unread ? 'bg-sage-100' : 'bg-charcoal-100'"
              >
                <!-- Document icon -->
                <svg v-if="notification.icon === 'document'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <!-- Chat icon -->
                <svg v-else-if="notification.icon === 'chat'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <!-- Mail icon -->
                <svg v-else-if="notification.icon === 'mail'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <!-- User icon -->
                <svg v-else-if="notification.icon === 'user'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <!-- Check icon -->
                <svg v-else-if="notification.icon === 'check'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- Alert icon -->
                <svg v-else-if="notification.icon === 'alert'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- Sparkle icon -->
                <svg v-else-if="notification.icon === 'sparkle'" class="w-5 h-5" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <p class="font-medium text-charcoal-800">{{ notification.title }}</p>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-xs text-charcoal-400">{{ notification.time }}</span>
                    <div v-if="notification.unread" class="w-2 h-2 bg-sage-500 rounded-full"></div>
                  </div>
                </div>
                <p class="text-sm text-charcoal-600 mt-1">{{ notification.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
