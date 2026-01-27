<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const sidebarOpen = ref(true)
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
  // Close sidebar by default on mobile
  if (isMobile.value && sidebarOpen.value) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-cream-50">
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex pt-16">
      <!-- Mobile backdrop -->
      <div
        v-if="sidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        @click="closeSidebar"
      />

      <AppSidebar :open="sidebarOpen" @navigate="closeSidebar" />

      <main
        class="flex-1 transition-all duration-300"
        :class="sidebarOpen && !isMobile ? 'lg:ml-64' : 'ml-0'"
      >
        <div class="p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
