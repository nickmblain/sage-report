<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const sidebarOpen = ref(true)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-cream-50">
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex pt-16">
      <AppSidebar :open="sidebarOpen" />

      <main
        class="flex-1 transition-all duration-300"
        :class="sidebarOpen ? 'ml-64' : 'ml-0'"
      >
        <div class="p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
