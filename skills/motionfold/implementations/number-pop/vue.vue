<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ value: number; duration?: number; easing?: string }>();
const bump = ref(false);
let first = true;

watch(
  () => props.value,
  () => {
    if (first) {
      first = false;
      return;
    }
    bump.value = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (bump.value = true)));
  },
);
</script>

<template>
  <output class="mf-number" :data-mf-bump="bump" aria-live="polite" :style="{ ...(props.duration ? { '--mf-number-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-number-ease': props.easing } : {}) }">
    <span class="mf-number-value">{{ value }}</span>
  </output>
</template>
