<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import AuthLayout from '@/layouts/AuthLayout.vue'
    import BlobButton from '@/components/BlobButton.vue'

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
        <div class="lg:hidden mb-8">
            <img src="/logo.svg" alt="Sage Report" class="h-7" />
        </div>

        <h2 class="text-2xl font-bold text-charcoal-800">Welcome back</h2>
        <p class="mt-2 text-charcoal-500">Sign in to your account to continue</p>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-4">
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {{ error }}
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
                <input id="email" v-model="email" type="email" class="input" placeholder="you@school.edu" required />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-charcoal-700 mb-1">Password</label>
                <input id="password" v-model="password" type="password" class="input" placeholder="Enter your password" required />
            </div>

            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2">
                    <input type="checkbox" class="w-4 h-4 rounded border-charcoal-300 text-sage-600 focus:ring-sage-500" />
                    <span class="text-sm text-charcoal-600">Remember me</span>
                </label>
                <a href="#" class="text-sm text-sage-600 hover:text-sage-700">Forgot password?</a>
            </div>

            <BlobButton type="submit" :disabled="loading" class="w-full">
                <span v-if="loading">Signing in...</span>
                <span v-else>Sign in</span>
            </BlobButton>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-charcoal-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-cream-50 text-charcoal-500">or</span>
                </div>
            </div>

            <BlobButton type="button" @click="handleDemoLogin" variant="secondary" class="w-full">
                Continue with Demo Account
            </BlobButton>
        </form>

        <p class="mt-8 text-center text-sm text-charcoal-500">
            Don't have an account?
            <router-link to="/register" class="text-sage-600 hover:text-sage-700 font-medium">
                Sign up
            </router-link>
        </p>
    </AuthLayout>
</template>
