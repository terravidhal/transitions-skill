<script setup lang="ts">
import { computed } from "vue";

type Option = { value: string; label: string };
const props = defineProps<{ label: string; options: Option[]; value: string; duration?: number; easing?: string }>();
const emit = defineEmits<{ change: [value: string] }>();
const index = computed(() => Math.max(0, props.options.findIndex((option) => option.value === props.value)));

function move(next: number, event: KeyboardEvent) {
  const option = props.options[(next + props.options.length) % props.options.length];
  if (!option) return;
  event.preventDefault();
  emit("change", option.value);
  const buttons = (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(".mf-segmented-item");
  buttons[(next + props.options.length) % props.options.length]?.focus();
}
</script>

<template>
  <div class="mf-segmented" role="group" :aria-label="label" :style="{ '--mf-seg-count': options.length, '--mf-seg-index': index, ...(props.duration ? { '--mf-seg-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-seg-ease': props.easing } : {}) }" @keydown.right="move(index + 1, $event)" @keydown.left="move(index - 1, $event)">
    <span class="mf-segmented-indicator" aria-hidden="true"></span>
    <button v-for="option in options" :key="option.value" class="mf-segmented-item" type="button" :aria-pressed="option.value === value" @click="emit('change', option.value)">
      {{ option.label }}
    </button>
  </div>
</template>
