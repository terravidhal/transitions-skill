<script setup lang="ts">
import { useId } from "vue";

const props = defineProps<{
  title: string;
  open: boolean;
  duration?: number;
  easing?: string;
}>();

const emit = defineEmits<{ (event: "update:open", value: boolean): void }>();
const id = useId();
const triggerId = `${id}-trigger`;
const panelId = `${id}-panel`;

const style = () => ({
  ...(props.duration ? { "--mf-accordion-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-accordion-ease": props.easing } : {}),
});
</script>

<template>
  <div class="mf-accordion" :data-mf-open="open" :style="style()">
    <button
      class="mf-accordion-trigger"
      type="button"
      :id="triggerId"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('update:open', !open)"
    >
      <span>{{ title }}</span>
      <span class="mf-accordion-chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6.5L8 10.5L12 6.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>
    <div class="mf-accordion-panel" :id="panelId" role="region" :aria-labelledby="triggerId" :inert="!open">
      <div class="mf-accordion-inner"><slot /></div>
    </div>
  </div>
</template>
