<script setup lang="ts">
import { useId } from "vue";

const props = defineProps<{
  label: string;
  side?: "top" | "bottom" | "left" | "right";
}>();

const id = useId();
</script>

<template>
  <span class="mf-tooltip" :data-mf-side="props.side ?? 'top'">
    <span class="mf-tooltip-anchor" :aria-describedby="id">
      <slot />
    </span>
    <span class="mf-tooltip-bubble" role="tooltip" :id="id">{{ label }}</span>
  </span>
</template>
