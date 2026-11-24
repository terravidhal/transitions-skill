<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { usePresence } from "../_shared/presence.vue";

const props = defineProps<{
  open: boolean;
  title?: string;
  duration?: number;
  autoDismiss?: number;
  closeLabel?: string;
}>();

const emit = defineEmits<{ (event: "close"): void }>();
const openRef = computed(() => props.open);
const { mounted, state } = usePresence(openRef, props.duration ?? 240);

const remaining = ref(props.autoDismiss ?? 6000);
const startedAt = ref(Date.now());
let timer: ReturnType<typeof setTimeout> | undefined;

function clear() {
  if (timer) clearTimeout(timer);
  timer = undefined;
}

function start() {
  const delay = props.autoDismiss ?? 6000;
  if (delay <= 0) return;
  clear();
  startedAt.value = Date.now();
  timer = setTimeout(() => emit("close"), remaining.value);
}

function pause() {
  if (!timer) return;
  clear();
  remaining.value -= Date.now() - startedAt.value;
}

watch(
  () => props.open,
  (open) => {
    if (open) start();
    else clear();
  },
  { immediate: true },
);

onBeforeUnmount(clear);

const style = () => ({
  ...(props.duration ? { "--mf-toast-close-duration": `${props.duration}ms` } : {}),
});
</script>

<template>
  <div
    v-if="mounted"
    class="mf-toast"
    :data-mf-state="state"
    role="status"
    :style="style()"
    @mouseenter="pause"
    @mouseleave="start"
    @focus="pause"
    @blur="start"
  >
    <div class="mf-toast-body">
      <strong v-if="title" class="mf-toast-title">{{ title }}</strong>
      <span><slot /></span>
    </div>
    <button class="mf-toast-close" type="button" :aria-label="closeLabel ?? 'Dismiss'" @click="emit('close')">
      ×
    </button>
  </div>
</template>
