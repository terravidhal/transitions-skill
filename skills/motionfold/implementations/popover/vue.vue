<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";

const props = defineProps<{
  label: string;
  duration?: number;
  easing?: string;
  distance?: number;
  scale?: number;
}>();

const id = useId();
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLDivElement | null>(null);
const open = ref(false);

function position() {
  const button = trigger.value;
  const element = panel.value;
  if (!button || !element) return;
  const rect = button.getBoundingClientRect();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  let side = "bottom";
  if (rect.bottom + 8 + height > window.innerHeight && rect.top - 8 - height > 0) side = "top";
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  const top = side === "top" ? rect.top - 8 - height : rect.bottom + 8;
  element.style.left = `${left}px`;
  element.style.top = `${Math.max(8, top)}px`;
  element.dataset.mfSide = side;
}

function toggle() {
  const element = panel.value;
  if (!element) return;
  if (element.matches(":popover-open")) element.hidePopover();
  else {
    element.showPopover();
    position();
  }
}

function onToggle(event: Event) {
  const next = (event as ToggleEvent).newState === "open";
  open.value = next;
  trigger.value?.setAttribute("aria-expanded", String(next));
  if (next) {
    position();
    requestAnimationFrame(position);
    panel.value?.querySelector<HTMLElement>('[role="menuitem"], a, button')?.focus();
  } else if (panel.value?.contains(document.activeElement)) {
    trigger.value?.focus();
  }
}

onMounted(() => {
  panel.value?.addEventListener("toggle", onToggle);
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, true);
});

onBeforeUnmount(() => {
  panel.value?.removeEventListener("toggle", onToggle);
  window.removeEventListener("resize", position);
  window.removeEventListener("scroll", position, true);
});

const style = () => ({
  ...(props.duration ? { "--mf-popover-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-popover-ease": props.easing } : {}),
  ...(props.distance ? { "--mf-popover-distance": `${props.distance}px` } : {}),
  ...(props.scale ? { "--mf-popover-scale": String(props.scale) } : {}),
});
</script>

<template>
  <button
    ref="trigger"
    type="button"
    :aria-expanded="open"
    :aria-controls="id"
    aria-haspopup="menu"
    @click.prevent="toggle"
  >
    {{ label }}
  </button>
  <div ref="panel" :id="id" popover="auto" class="mf-popover" role="menu" :style="style()">
    <slot />
  </div>
</template>
