<script setup lang="ts">
const props = defineProps<{
  ready: boolean;
  label?: string;
  loadedLabel?: string;
  duration?: number;
}>();

const style = () => ({
  ...(props.duration ? { "--mf-skeleton-reveal-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <div
    class="mf-skeleton"
    :data-mf-state="ready ? 'ready' : 'loading'"
    :aria-busy="!ready"
    :style="style()"
  >
    <div class="mf-skeleton-placeholder" aria-hidden="true">
      <span class="mf-skeleton-block"></span>
      <span class="mf-skeleton-line" data-width="medium"></span>
      <span class="mf-skeleton-line" data-width="short"></span>
    </div>
    <div class="mf-skeleton-content"><slot /></div>
    <span class="mf-sr-only" role="status">{{ ready ? (loadedLabel ?? "Content loaded") : (label ?? "Loading") }}</span>
  </div>
</template>
