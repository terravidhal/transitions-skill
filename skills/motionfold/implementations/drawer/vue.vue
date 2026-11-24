<script setup lang="ts">
import { ref, useId, watch, onMounted } from "vue";

const props = defineProps<{
  open: boolean;
  title: string;
  side?: "left" | "right";
  duration?: number;
  easing?: string;
  distance?: string;
}>();

const emit = defineEmits<{ (event: "update:open", value: boolean): void }>();

const titleId = useId();
const dialog = ref<HTMLDialogElement | null>(null);

watch(
  () => props.open,
  (open) => {
    const element = dialog.value;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  },
);

onMounted(() => {
  if (props.open) dialog.value?.showModal();
});

function close() {
  emit("update:open", false);
}

function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) close();
}

const style = () => ({
  ...(props.duration ? { "--mf-drawer-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-drawer-ease": props.easing } : {}),
  ...(props.distance ? { "--mf-drawer-distance": props.distance } : {}),
});
</script>

<template>
  <dialog
    ref="dialog"
    class="mf-drawer"
    :data-side="side ?? 'right'"
    :aria-labelledby="titleId"
    aria-modal="true"
    :style="style()"
    @cancel.prevent="close"
    @close="close"
    @click="onBackdrop"
  >
    <div class="mf-drawer-header">
      <h2 class="mf-drawer-title" :id="titleId">{{ title }}</h2>
      <button class="mf-drawer-close" type="button" aria-label="Close" @click="close">×</button>
    </div>
    <div class="mf-drawer-body"><slot /></div>
  </dialog>
</template>
