<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  label: string;
  duration?: number;
  easing?: string;
  travel?: number;
}>();

const emit = defineEmits<{ (event: "update:modelValue", value: boolean): void }>();

const style = () => ({
  ...(props.duration ? { "--mf-switch-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-switch-ease": props.easing } : {}),
  ...(props.travel ? { "--mf-switch-travel": `${props.travel}px` } : {}),
});
</script>

<template>
  <button
    class="mf-switch"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :style="style()"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="mf-switch-track" aria-hidden="true">
      <span class="mf-switch-thumb"></span>
    </span>
    <span>{{ label }}</span>
  </button>
</template>
