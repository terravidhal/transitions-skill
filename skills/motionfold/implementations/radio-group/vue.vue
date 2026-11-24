<script setup lang="ts">
type Option = { value: string; label: string };
const props = defineProps<{ name: string; legend: string; options: Option[]; value: string; duration?: number; easing?: string }>();
const emit = defineEmits<{ change: [value: string] }>();
</script>

<template>
  <fieldset class="mf-radio-group" :style="{ ...(props.duration ? { '--mf-radio-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-radio-ease': props.easing } : {}) }">
    <legend class="mf-radio-legend">{{ legend }}</legend>
    <label v-for="option in options" :key="option.value" class="mf-radio">
      <input type="radio" :name="name" :value="option.value" :checked="option.value === value" @change="emit('change', option.value)" />
      <span class="mf-radio-box" aria-hidden="true"><span class="mf-radio-dot"></span></span>
      <span>{{ option.label }}</span>
    </label>
  </fieldset>
</template>
