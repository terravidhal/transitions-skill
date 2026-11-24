<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
  duration?: number;
}>();

const emit = defineEmits<{ (event: "update:modelValue", value: boolean): void }>();

const box = ref<HTMLSpanElement | null>(null);
const path = ref<SVGPathElement | null>(null);

onMounted(() => {
  const element = path.value;
  if (!element || !box.value) return;
  const length = Math.ceil(element.getTotalLength()) + 1;
  box.value.style.setProperty("--mf-checkbox-path-length", String(length));
});

const style = () => ({
  ...(props.duration ? { "--mf-checkbox-draw-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <label class="mf-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="mf-checkbox-box" ref="box" aria-hidden="true" :style="style()">
      <svg viewBox="0 0 16 16">
        <path ref="path" class="mf-checkbox-check" d="M3.5 8.5L6.5 11.5L12.5 4.5" />
      </svg>
    </span>
    <span class="mf-checkbox-label">
      {{ label }}
      <span v-if="description" class="mf-sr-only"> — {{ description }}</span>
    </span>
  </label>
</template>
