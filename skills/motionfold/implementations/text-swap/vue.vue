<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  value: string;
  duration?: number;
}>();

const root = ref<HTMLSpanElement | null>(null);
const valueRef = ref<HTMLSpanElement | null>(null);
const ghost = ref<HTMLSpanElement | null>(null);
let previous = props.value;
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.value,
  (next) => {
    const element = root.value;
    const current = valueRef.value;
    if (!element || !current || !ghost.value || previous === next) return;
    ghost.value.textContent = previous;
    element.dataset.mfSwapping = "false";
    void element.offsetWidth;
    current.textContent = next;
    element.dataset.mfSwapping = "true";
    previous = next;
    clearTimeout(timer);
    timer = setTimeout(() => {
      element.dataset.mfSwapping = "false";
      if (ghost.value) ghost.value.textContent = "";
    }, 220);
  },
);

const style = () => ({
  ...(props.duration ? { "--mf-text-swap-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <span class="mf-text-swap" ref="root" data-mf-swapping="false" aria-live="polite" :style="style()">
    <span class="mf-text-swap-value" ref="valueRef">{{ value }}</span>
    <span class="mf-text-swap-ghost" ref="ghost" aria-hidden="true"></span>
  </span>
</template>
