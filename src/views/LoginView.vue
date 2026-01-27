<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}

function handleDemoLogin() {
  authStore.demoSignIn()
  router.push('/dashboard')
}
</script>

<template>
  <AuthLayout>
    <div class="lg:hidden flex items-center gap-2 mb-8">
      <div class="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <span class="text-xl font-semibold text-charcoal-800">Sage Report</span>
    </div>

    <h2 class="text-2xl font-bold text-charcoal-800">Welcome back</h2>
    <p class="mt-2 text-charcoal-500">Sign in to your account to continue</p>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-4">
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          placeholder="you@school.edu"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-charcoal-700 mb-1">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="input"
          placeholder="Enter your password"
          required
        />
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2">
          <input type="checkbox" class="w-4 h-4 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500" />
          <span class="text-sm text-charcoal-600">Remember me</span>
        </label>
        <a href="#" class="text-sm text-sage-600 hover:text-sage-700">Forgot password?</a>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full"
      >
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign in</span>
      </button>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-charcoal-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-cream-50 text-charcoal-500">Or</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleDemoLogin"
        class="btn btn-secondary w-full"
      >
        Continue with Demo Account
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-charcoal-500">
      Don't have an account?
      <router-link to="/register" class="text-sage-600 hover:text-sage-700 font-medium">
        Sign up
      </router-link>
    </p>
  </AuthLayout>
</template>
