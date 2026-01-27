<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  open: boolean
}>()

const route = useRoute()

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    name: 'Students',
    path: '/students',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside
    class="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-charcoal-100 transition-transform duration-300 z-40"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-4">
      <router-link
        to="/reports/new"
        class="btn btn-primary w-full gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Report
      </router-link>
    </div>

    <nav class="px-2">
      <router-link
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors"
        :class="isActive(item.path)
          ? 'bg-sage-50 text-sage-700'
          : 'text-charcoal-600 hover:bg-cream-100'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        {{ item.name }}
      </router-link>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-charcoal-100">
      <div class="bg-sage-50 rounded-lg p-4">
        <p class="text-sm font-medium text-sage-800">AI-Powered Reports</p>
        <p class="text-xs text-sage-600 mt-1">Generate professional reports with a single click</p>
      </div>
    </div>
  </aside>
</template>
