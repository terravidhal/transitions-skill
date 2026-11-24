<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ label?: string; duration?: number; easing?: string }>();
const emit = defineEmits<{ reveal: [] }>();
const button = ref<HTMLButtonElement | null>(null);

function reveal() {
  if (!document.startViewTransition) {
    emit("reveal");
    return;
  }
  const rect = button.value?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  document.documentElement.style.setProperty("--mf-theme-x", x + "px");
  document.documentElement.style.setProperty("--mf-theme-y", y + "px");
  document.documentElement.style.setProperty("--mf-theme-radius", Math.hypot(window.innerWidth, window.innerHeight) + "px");
  document.startViewTransition(() => emit("reveal"));
}
</script>

<template>
  <button ref="button" class="mf-theme-reveal" type="button" :style="{ ...(props.duration ? { '--mf-theme-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-theme-ease': props.easing } : {}) }" @click="reveal">
    <span aria-hidden="true">◐</span>
    <span>{{ label ?? "Switch theme" }}</span>
  </button>
</template>
