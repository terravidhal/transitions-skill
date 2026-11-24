<script setup lang="ts">
import { ref, useId, watch, onMounted } from "vue";

const props = defineProps<{
  open: boolean;
  title: string;
  duration?: number;
  easing?: string;
  distance?: number;
  closeLabel?: string;
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
  ...(props.duration ? { "--mf-modal-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-modal-ease": props.easing } : {}),
  ...(props.distance ? { "--mf-modal-distance": `${props.distance}px` } : {}),
});
</script>

<template>
  <dialog
    ref="dialog"
    class="mf-modal"
    :aria-labelledby="titleId"
    aria-modal="true"
    :style="style()"
    @cancel.prevent="close"
    @close="close"
    @click="onBackdrop"
  >
    <div class="mf-modal-header">
      <h2 class="mf-modal-title" :id="titleId">{{ title }}</h2>
      <button class="mf-modal-close" type="button" :aria-label="closeLabel ?? 'Close'" @click="close">×</button>
    </div>
    <div class="mf-modal-body"><slot /></div>
  </dialog>
</template>
