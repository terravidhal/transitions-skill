<script setup lang="ts">
const props = defineProps<{ active: boolean; label: string; duration?: number; easing?: string }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <button class="mf-icon-swap" type="button" :aria-pressed="active" :aria-label="label" :data-mf-active="active" :style="{ ...(props.duration ? { '--mf-icon-swap-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-icon-swap-ease': props.easing } : {}) }" @click="emit('toggle')">
    <span class="mf-icon-swap-layer" data-icon="off" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" /><rect x="10.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" /><rect x="2.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" /><rect x="10.5" y="10.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" /></svg>
    </span>
    <span class="mf-icon-swap-layer" data-icon="on" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
    </span>
  </button>
</template>
