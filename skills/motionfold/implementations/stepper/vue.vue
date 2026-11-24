<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

const props = defineProps<{ steps: string[]; step: number; duration?: number; easing?: string }>();
const emit = defineEmits<{ change: [step: number] }>();
const root = ref<HTMLDivElement | null>(null);
const index = computed(() => Math.max(0, Math.min(props.steps.length - 1, props.step)));

function go(next: number) {
  emit("change", Math.max(0, Math.min(props.steps.length - 1, next)));
}

watch(index, async () => {
  await nextTick();
  root.value?.querySelector<HTMLElement>(".mf-step-panel[data-active='true'] h3")?.focus();
});
</script>

<template>
  <div ref="root" class="mf-stepper" :data-mf-step="index" :style="{ '--mf-stepper-progress': steps.length > 1 ? index / (steps.length - 1) : 0, ...(props.duration ? { '--mf-stepper-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-stepper-ease': props.easing } : {}) }">
    <div class="mf-stepper-track" aria-label="Progress">
      <div class="mf-stepper-line" aria-hidden="true"><span></span></div>
      <div v-for="(label, position) in steps" :key="label" class="mf-step" :data-active="position === index" :data-done="position < index" :aria-current="position === index ? 'step' : undefined">
        <span class="mf-step-dot" aria-hidden="true"><span class="mf-step-index">{{ position + 1 }}</span></span>
        <span>{{ label }}</span>
      </div>
    </div>
    <div class="mf-stepper-panels">
      <div v-for="(label, position) in steps" :key="label" class="mf-step-panel" :data-active="position === index" :hidden="position !== index">
        <h3 tabindex="-1">{{ label }}</h3>
        <p>Step {{ position + 1 }} of {{ steps.length }}. The heading receives focus when the step changes.</p>
      </div>
    </div>
    <div>
      <button class="mf-step-nav" type="button" :disabled="index === 0" @click="go(index - 1)">Back</button>
      <button class="mf-step-nav" type="button" :disabled="index === steps.length - 1" @click="go(index + 1)">Next</button>
    </div>
  </div>
</template>
