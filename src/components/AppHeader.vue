<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
const router = useRouter()

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}

const userInitials = authStore.user?.user_metadata?.full_name
  ?.split(' ')
  .map((n: string) => n[0])
  .join('')
  .toUpperCase() || 'U'
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

        <router-link to="/dashboard" class="flex items-center">
          <img src="/logo.svg" alt="Sage Report" class="h-7" />
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-cream-100 rounded-lg transition-colors relative">
          <svg class="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-sage-500 rounded-full"></span>
        </button>

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
              <p class="text-sm text-charcoal-500">{{ authStore.user?.email }}</p>
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
