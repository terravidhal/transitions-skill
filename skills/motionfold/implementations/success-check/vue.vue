<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  label?: string;
  duration?: number;
}>();

const root = ref<HTMLSpanElement | null>(null);
const icon = ref<SVGSVGElement | null>(null);
const path = ref<SVGPathElement | null>(null);

function measure() {
  if (!path.value) return;
  const length = Math.ceil(path.value.getTotalLength()) + 1;
  icon.value?.style.setProperty("--mf-check-path-length", String(length));
}

function replay() {
  const element = root.value;
  if (!element) return;
  element.dataset.mfState = "idle";
  void element.offsetWidth;
  element.dataset.mfState = "success";
}

watch(
  () => props.show,
  (show) => {
    if (show) replay();
  },
);

onMounted(measure);

const style = () => ({
  ...(props.duration ? { "--mf-check-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <span class="mf-success" ref="root" :data-mf-state="show ? 'success' : 'idle'" role="status" :style="style()">
    <svg class="mf-success-icon" ref="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35" />
      <path class="mf-success-path" ref="path" d="M7 12.5L10.5 16L17 8" />
    </svg>
    <span class="mf-success-text">{{ label ?? "Saved" }}</span>
  </span>
</template>
