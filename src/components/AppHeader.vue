<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
const router = useRouter()
const showNotifications = ref(false)
const notificationsRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (showNotifications.value && !target.closest('.notifications-container')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const notifications = [
  {
    id: 1,
    title: 'Report Ready',
    message: 'Emma Johnson\'s progress report has been generated',
    time: '5 min ago',
    unread: true,
    icon: 'document'
  },
  {
    id: 2,
    title: 'Parent Feedback',
    message: 'Mrs. Thompson left a comment on Liam\'s report',
    time: '1 hour ago',
    unread: true,
    icon: 'chat'
  },
  {
    id: 3,
    title: 'Report Sent',
    message: 'Quarterly reports sent to 12 parents successfully',
    time: '3 hours ago',
    unread: false,
    icon: 'mail'
  },
  {
    id: 4,
    title: 'New Student Added',
    message: 'Sofia Martinez has been added to your roster',
    time: 'Yesterday',
    unread: false,
    icon: 'user'
  }
]

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

const userInitials = authStore.user?.user_metadata?.full_name
  ?.split(' ')
  .map((n: string) => n[0])
  .join('')
  .toUpperCase() || 'U'

const unreadCount = notifications.filter(n => n.unread).length
</script>

<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-charcoal-100 z-50">
    <div class="h-full px-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="emit('toggleSidebar')"
          class="p-2 hover:bg-cream-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <router-link to="/dashboard" class="flex flex-col">
          <img src="/logo.svg" alt="Sage Report" class="h-7" />
          <span class="text-charcoal-400 text-[10px] leading-tight">Created by Nick Blain</span>
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <div class="relative notifications-container">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 hover:bg-cream-100 rounded-lg transition-colors relative"
          >
            <svg class="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-sage-500 rounded-full"></span>
          </button>

          <!-- Notifications Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-charcoal-100 z-50"
          >
            <div class="p-3 border-b border-charcoal-100 flex items-center justify-between">
              <h3 class="font-semibold text-charcoal-800">Notifications</h3>
              <span v-if="unreadCount > 0" class="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                {{ unreadCount }} new
              </span>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-3 hover:bg-cream-50 border-b border-charcoal-50 cursor-pointer transition-colors"
                :class="{ 'bg-sage-50/50': notification.unread }"
              >
                <div class="flex gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="notification.unread ? 'bg-sage-100' : 'bg-charcoal-100'"
                  >
                    <!-- Document icon -->
                    <svg v-if="notification.icon === 'document'" class="w-4 h-4" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <!-- Chat icon -->
                    <svg v-else-if="notification.icon === 'chat'" class="w-4 h-4" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <!-- Mail icon -->
                    <svg v-else-if="notification.icon === 'mail'" class="w-4 h-4" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <!-- User icon -->
                    <svg v-else-if="notification.icon === 'user'" class="w-4 h-4" :class="notification.unread ? 'text-sage-600' : 'text-charcoal-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-charcoal-800">{{ notification.title }}</p>
                    <p class="text-xs text-charcoal-500 truncate">{{ notification.message }}</p>
                    <p class="text-xs text-charcoal-400 mt-1">{{ notification.time }}</p>
                  </div>
                  <div v-if="notification.unread" class="w-2 h-2 bg-sage-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>
            </div>
            <div class="p-2 border-t border-charcoal-100">
              <router-link
                to="/notifications"
                @click="showNotifications = false"
                class="block w-full text-center text-sm text-sage-600 hover:text-sage-700 py-1"
              >
                View all notifications
              </router-link>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative group">
          <button class="flex items-center gap-2 p-2 hover:bg-cream-100 rounded-lg transition-colors">
            <div class="w-8 h-8 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center font-medium text-sm">
              {{ userInitials }}
            </div>
            <svg class="w-4 h-4 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-charcoal-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div class="p-3 border-b border-charcoal-100">
              <p class="font-medium text-charcoal-800">{{ authStore.user?.user_metadata?.full_name || 'User' }}</p>
            </div>
            <div class="p-1">
              <router-link to="/settings" class="block px-3 py-2 text-charcoal-600 hover:bg-cream-100 rounded-md">
                Settings
              </router-link>
              <button @click="handleSignOut" class="w-full text-left px-3 py-2 text-charcoal-600 hover:bg-cream-100 rounded-md">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
