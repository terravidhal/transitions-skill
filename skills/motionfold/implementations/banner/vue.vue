<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ open: boolean; duration?: number }>();
const emit = defineEmits<{ dismiss: [] }>();
const mounted = ref(props.open);
const state = ref(props.open ? "open" : "closed");
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.open,
  (open) => {
    clearTimeout(timer);
    if (open) {
      mounted.value = true;
      state.value = "open";
      return;
    }
    if (!mounted.value) return;
    state.value = "closing";
    timer = setTimeout(() => {
      mounted.value = false;
      state.value = "closed";
    }, (props.duration ?? 200) + 60);
  },
  { immediate: true },
);

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div v-if="mounted" class="mf-banner" :data-mf-state="state" :style="props.duration ? { '--mf-banner-close-duration': props.duration + 'ms' } : undefined" role="status">
    <span class="mf-banner-icon" aria-hidden="true">◆</span>
    <p class="mf-banner-text"><slot /></p>
    <button class="mf-banner-close" type="button" aria-label="Dismiss" @click="emit('dismiss')">×</button>
  </div>
</template>
