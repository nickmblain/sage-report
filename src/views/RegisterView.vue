<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import AuthLayout from '@/layouts/AuthLayout.vue'
    import BlobButton from '@/components/BlobButton.vue'
    import BlobLink from '@/components/BlobLink.vue'

    const router = useRouter()
    const authStore = useAuthStore()

    const fullName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const loading = ref(false)
    const success = ref(false)

    async function handleSubmit() {
        error.value = ''

        if (password.value !== confirmPassword.value) {
            error.value = 'Passwords do not match'
            return
        }

        if (password.value.length < 8) {
            error.value = 'Password must be at least 8 characters'
            return
        }

        loading.value = true

        try {
            await authStore.signUp(email.value, password.value, fullName.value)
            success.value = true
        } catch (e: any) {
            error.value = e.message || 'Failed to create account'
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

        <div v-if="success" class="text-center">
            <div class="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-charcoal-800">Check your email</h2>
            <p class="mt-2 text-charcoal-500">
                We've sent a confirmation link to <strong>{{ email }}</strong>
            </p>
            <BlobLink to="/login" class="mt-6">
                Back to sign in
            </BlobLink>
        </div>

        <template v-else>
            <h2 class="text-2xl font-bold text-charcoal-800">Create your account</h2>
            <p class="mt-2 text-charcoal-500">Start generating AI-powered student reports</p>

            <form @submit.prevent="handleSubmit" class="mt-8 space-y-4">
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {{ error }}
                </div>

                <div>
                    <label for="fullName" class="block text-sm font-medium text-charcoal-700 mb-1">Full name</label>
                    <input id="fullName" v-model="fullName" type="text" class="input" placeholder="Jane Smith" required />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
                    <input id="email" v-model="email" type="email" class="input" placeholder="you@school.edu" required />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-charcoal-700 mb-1">Password</label>
                    <input id="password" v-model="password" type="password" class="input" placeholder="Min. 8 characters" required />
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-charcoal-700 mb-1">Confirm password</label>
                    <input id="confirmPassword" v-model="confirmPassword" type="password" class="input" placeholder="Confirm your password" required />
                </div>

                <BlobButton type="submit" :disabled="loading" class="w-full">
                    <span v-if="loading">Creating account...</span>
                    <span v-else>Create account</span>
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
                    Try Demo Account
                </BlobButton>
            </form>

            <p class="mt-8 text-center text-sm text-charcoal-500">
                Already have an account?
                <router-link to="/login" class="text-sage-600 hover:text-sage-700 font-medium">
                    Sign in
                </router-link>
            </p>
        </template>
    </AuthLayout>
</template>
