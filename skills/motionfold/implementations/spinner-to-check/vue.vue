<script setup lang="ts">
const props = defineProps<{ state: "loading" | "done"; label?: string; doneLabel?: string; duration?: number; easing?: string }>();
</script>

<template>
  <span class="mf-spinner" :data-mf-state="state" :aria-busy="state === 'loading'" role="status" :style="{ ...(props.duration ? { '--mf-spinner-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-spinner-ease': props.easing } : {}) }">
    <span class="mf-spinner-ring" aria-hidden="true"></span>
    <span class="mf-spinner-check" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <span class="mf-spinner-label mf-sr-only">{{ state === "done" ? (doneLabel ?? "Done") : (label ?? "Working") }}</span>
  </span>
</template>
