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
                <button @click="emit('toggleSidebar')" class="p-2 hover:bg-cream-100 rounded-lg transition-colors">
                    <svg class="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div class="flex flex-col items-center">
                    <router-link to="/dashboard">
                        <img src="/logo.svg" alt="Sage Report" class="h-7" />
                    </router-link>
                    <div class="flex items-center gap-2">
                        <span class="text-charcoal-400 text-[10px] leading-tight">Created by Nick Blain</span>
                        <div class="flex items-center gap-1.5">
                            <a
                                href="https://www.linkedin.com/in/nicholas-blain-09110b41/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-charcoal-300 hover:text-sage-600 transition-colors"
                                title="LinkedIn"
                            >
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a
                                href="https://github.com/nickmblain/sage-report"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-charcoal-300 hover:text-sage-600 transition-colors"
                                title="GitHub"
                            >
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <!-- Notifications -->
                <div class="relative notifications-container">
                    <button @click="showNotifications = !showNotifications" class="p-2 hover:bg-cream-100 rounded-lg transition-colors relative">
                        <svg class="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-sage-500 rounded-full"></span>
                    </button>

                    <!-- Notifications Dropdown -->
                    <div v-if="showNotifications" class="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-charcoal-100 z-50">
                        <div class="p-3 border-b border-charcoal-100 flex items-center justify-between">
                            <h3 class="font-semibold text-charcoal-800">Notifications</h3>
                            <span v-if="unreadCount > 0" class="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                                {{ unreadCount }} new
                            </span>
                        </div>
                        <div class="max-h-80 overflow-y-auto">
                            <div v-for="notification in notifications" :key="notification.id" class="p-3 hover:bg-cream-50 border-b border-charcoal-50 cursor-pointer transition-colors" :class="{ 'bg-sage-50/50': notification.unread }">
                                <div class="flex gap-3">
                                    <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" :class="notification.unread ? 'bg-sage-100' : 'bg-charcoal-100'">
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
                            <router-link to="/notifications" @click="showNotifications = false" class="block w-full text-center text-sm text-sage-600 hover:text-sage-700 py-1">
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
