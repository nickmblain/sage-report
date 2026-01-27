<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-cream-50 flex">
    <!-- Left side - Branding with hero image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background image -->
      <img
        src="https://sagereport.com/_astro/hero-2.BmkUhyJ0_pL7CK.avif"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-sage-800/90 via-sage-700/85 to-sage-600/80"></div>

      <!-- Content -->
      <div class="relative z-10 p-12 flex flex-col justify-between w-full">
        <div>
          <img src="/logo-white.svg" alt="Sage Report" class="h-8" />
        </div>

        <div>
          <h1 class="text-4xl font-bold text-white leading-tight">
            Presence, not pressure.
          </h1>
          <p class="mt-4 text-white/90 text-lg">
            AI-powered student reports that save educators time while maintaining the personal touch students deserve.
          </p>
        </div>

        <div class="flex items-center gap-6 text-white/80 text-sm">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            FERPA Compliant
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Encrypted
          </span>
        </div>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
