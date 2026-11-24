<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{ open: boolean; title: string; duration?: number }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);

function sync(open: boolean) {
  const element = dialog.value;
  if (!element) return;
  if (open && !element.open) element.showModal();
  else if (!open && element.open) element.close();
}

watch(() => props.open, sync);
onMounted(() => sync(props.open));
</script>

<template>
  <dialog
    ref="dialog"
    class="mf-sheet"
    :aria-label="title"
    aria-modal="true"
    :style="props.duration ? { '--mf-sheet-duration': props.duration + 'ms' } : undefined"
    @close="emit('close')"
    @cancel.prevent="emit('close')"
  >
    <div class="mf-sheet-handle" aria-hidden="true"></div>
    <div class="mf-sheet-header">
      <h2 class="mf-sheet-title">{{ title }}</h2>
      <button class="mf-sheet-close" type="button" aria-label="Close" @click="emit('close')">×</button>
    </div>
    <div class="mf-sheet-body"><slot /></div>
  </dialog>
</template>
