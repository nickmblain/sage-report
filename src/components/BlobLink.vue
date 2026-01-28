<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
  variant?: 'primary' | 'outline' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="blob-btn"
    :class="[
      variant === 'outline' ? 'blob-btn--outline' : variant === 'secondary' ? 'blob-btn--secondary' : 'blob-btn--primary',
      size === 'sm' ? 'blob-btn--sm' : size === 'lg' ? 'blob-btn--lg' : ''
    ]"
  >
    <span class="blob-btn__text">
      <slot />
    </span>
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>

    <!-- SVG Goo Filter -->
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="blob-btn__svg">
      <defs>
        <filter id="goo-link">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
          <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
        </filter>
      </defs>
    </svg>
  </RouterLink>
</template>

<style scoped>
.blob-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 16px 32px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 9999px;
  overflow: visible;
  z-index: 1;
  text-decoration: none;
}

.blob-btn__text {
  position: relative;
  z-index: 2;
  transition: color 0.4s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.blob-btn__svg {
  position: absolute;
  width: 0;
  height: 0;
}

/* Primary variant */
.blob-btn--primary {
  color: white;
}

.blob-btn--primary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #177D83;
  border-radius: 9999px;
  z-index: -1;
  transition: transform 0.3s ease;
}

.blob-btn--primary:hover::before {
  transform: scale(1.02);
}

.blob-btn--primary .blob-btn__inner {
  background: #177D83;
}

.blob-btn--primary .blob-btn__blob {
  background: #0d5a5e;
}

.blob-btn--primary:hover .blob-btn__text {
  color: white;
}

/* Outline variant */
.blob-btn--outline {
  color: #177D83;
}

.blob-btn--outline::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid #177D83;
  border-radius: 9999px;
  z-index: 1;
  pointer-events: none;
}

.blob-btn--outline .blob-btn__inner {
  background: white;
}

.blob-btn--outline .blob-btn__blob {
  background: #177D83;
}

.blob-btn--outline:hover .blob-btn__text {
  color: white;
}

/* Secondary variant */
.blob-btn--secondary {
  color: #4a4a4a;
}

.blob-btn--secondary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 9999px;
  z-index: -1;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.blob-btn--secondary:hover::before {
  transform: scale(1.02);
  background: #ebebeb;
}

.blob-btn--secondary .blob-btn__inner {
  background: #f5f5f5;
}

.blob-btn--secondary .blob-btn__blob {
  background: #177D83;
}

.blob-btn--secondary:hover .blob-btn__text {
  color: white;
}

/* Inner container */
.blob-btn__inner {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 9999px;
  z-index: -1;
}

.blob-btn__blobs {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  filter: url('#goo-link');
}

.blob-btn__blob {
  position: absolute;
  top: 0;
  width: 34%;
  height: 100%;
  border-radius: 100%;
  transform: translate3d(0, 150%, 0) scale(1.9);
  transition: transform 0.45s ease;
}

@supports (filter: url('#goo-link')) {
  .blob-btn__blob {
    transform: translate3d(0, 150%, 0) scale(1.7);
  }
}

.blob-btn__blob:nth-child(1) {
  left: -5%;
  transition-delay: 0s;
}

.blob-btn__blob:nth-child(2) {
  left: 22%;
  transition-delay: 0.08s;
}

.blob-btn__blob:nth-child(3) {
  left: 50%;
  transition-delay: 0.16s;
}

.blob-btn__blob:nth-child(4) {
  left: 78%;
  transition-delay: 0.24s;
}

.blob-btn:hover .blob-btn__blob {
  transform: translateZ(0) scale(1.9);
}

@supports (filter: url('#goo-link')) {
  .blob-btn:hover .blob-btn__blob {
    transform: translateZ(0) scale(1.7);
  }
}

/* Active/click effect */
.blob-btn:active {
  transform: scale(0.98);
}

/* Size variants */
.blob-btn--sm {
  padding: 12px 24px;
  font-size: 0.875rem;
}

.blob-btn--lg {
  padding: 20px 40px;
  font-size: 1.125rem;
}
</style>
