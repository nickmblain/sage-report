<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const authStore = useAuthStore()

const profile = ref({
  fullName: authStore.user?.user_metadata?.full_name || '',
  email: authStore.user?.email || '',
  school: 'Lincoln Elementary School',
  role: 'Teacher'
})

const notifications = ref({
  emailReports: true,
  weeklyDigest: true,
  newFeatures: false
})

const saved = ref(false)

function saveProfile() {
  // Simulate save
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}
</script>

<template>
  <DashboardLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-charcoal-800 mb-6">Settings</h1>

      <!-- Success Message -->
      <div
        v-if="saved"
        class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Settings saved successfully
      </div>

      <!-- Profile Section -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">Profile</h2>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-charcoal-700 mb-1">Full Name</label>
              <input v-model="profile.fullName" type="text" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
              <input v-model="profile.email" type="email" class="input" disabled />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-charcoal-700 mb-1">School</label>
              <input v-model="profile.school" type="text" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-charcoal-700 mb-1">Role</label>
              <select v-model="profile.role" class="input">
                <option>Teacher</option>
                <option>School Psychologist</option>
                <option>Counselor</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>

          <div class="pt-4">
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Notifications Section -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">Notifications</h2>

        <div class="space-y-4">
          <label class="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 hover:bg-cream-50 cursor-pointer">
            <div>
              <p class="font-medium text-charcoal-800">Report Notifications</p>
              <p class="text-sm text-charcoal-500">Receive email when reports are generated</p>
            </div>
            <input
              v-model="notifications.emailReports"
              type="checkbox"
              class="w-5 h-5 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 hover:bg-cream-50 cursor-pointer">
            <div>
              <p class="font-medium text-charcoal-800">Weekly Digest</p>
              <p class="text-sm text-charcoal-500">Summary of report activity each week</p>
            </div>
            <input
              v-model="notifications.weeklyDigest"
              type="checkbox"
              class="w-5 h-5 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500"
            />
          </label>

          <label class="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 hover:bg-cream-50 cursor-pointer">
            <div>
              <p class="font-medium text-charcoal-800">Product Updates</p>
              <p class="text-sm text-charcoal-500">Learn about new features and improvements</p>
            </div>
            <input
              v-model="notifications.newFeatures"
              type="checkbox"
              class="w-5 h-5 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500"
            />
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card border-red-200">
        <h2 class="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50">
            <div>
              <p class="font-medium text-charcoal-800">Delete Account</p>
              <p class="text-sm text-charcoal-500">Permanently delete your account and all data</p>
            </div>
            <button class="btn bg-red-600 text-white hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
