<script setup lang="ts">
import { useId, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  label: string;
  error?: string;
  placeholder?: string;
  type?: string;
  duration?: number;
}>();

const emit = defineEmits<{ (event: "update:modelValue", value: string): void }>();

const id = useId();
let input: HTMLInputElement | null = null;
let wasError = false;

function setInput(element: unknown) {
  input = element as HTMLInputElement | null;
}

watch(
  () => props.error,
  (error) => {
    if (!input) return;
    if (error && !wasError) {
      input.dataset.mfShake = "false";
      void input.offsetWidth;
      input.dataset.mfShake = "true";
      input.focus();
      input.addEventListener(
        "animationend",
        () => {
          input!.dataset.mfShake = "false";
        },
        { once: true },
      );
    }
    if (!error) input.dataset.mfShake = "false";
    wasError = Boolean(error);
  },
);

const style = () => ({
  ...(props.duration ? { "--mf-shake-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <div class="mf-field" :data-mf-invalid="Boolean(error)" :style="style()">
    <label class="mf-field-label" :for="id">{{ label }}</label>
    <input
      :ref="setInput"
      class="mf-input"
      :id="id"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p class="mf-field-error" :id="`${id}-error`" role="alert" :hidden="!error">{{ error }}</p>
  </div>
</template>
