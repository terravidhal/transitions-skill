<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{ open: boolean; caption?: string; duration?: number }>();
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
  <dialog ref="dialog" class="mf-lightbox" :aria-label="caption ?? 'Image preview'" aria-modal="true" :style="props.duration ? { '--mf-lightbox-duration': props.duration + 'ms' } : undefined" @close="emit('close')" @cancel.prevent="emit('close')">
    <figure class="mf-lightbox-figure">
      <div class="mf-lightbox-image" role="img" :aria-label="caption ?? 'Preview'"><slot /></div>
      <figcaption v-if="caption">{{ caption }}</figcaption>
    </figure>
    <button class="mf-lightbox-close" type="button" aria-label="Close" @click="emit('close')">×</button>
  </dialog>
</template>
