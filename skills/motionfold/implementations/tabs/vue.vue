<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

const props = defineProps<{
  items: { id: string; label: string }[];
  value: string;
  duration?: number;
  easing?: string;
}>();

const emit = defineEmits<{ (event: "update:value", value: string): void }>();

const id = useId();
const list = ref<HTMLDivElement | null>(null);
const indicator = ref<HTMLSpanElement | null>(null);
const tabs: Record<string, HTMLButtonElement | null> = {};

function setTab(key: string, node: unknown) {
  tabs[key] = node as HTMLButtonElement | null;
}

function measure(key: string, animate: boolean) {
  const listElement = list.value;
  const tab = tabs[key];
  const pill = indicator.value;
  if (!listElement || !tab || !pill) return;
  const listRect = listElement.getBoundingClientRect();
  const rect = tab.getBoundingClientRect();
  if (!animate) pill.style.transition = "none";
  pill.style.width = `${rect.width}px`;
  pill.style.transform = `translateX(${rect.left - listRect.left}px)`;
  if (!animate) {
    void pill.offsetWidth;
    pill.style.transition = "";
  }
}

function select(key: string, focus = false) {
  emit("update:value", key);
  nextTick(() => {
    measure(key, true);
    if (focus) tabs[key]?.focus();
  });
}

function onKeydown(event: KeyboardEvent) {
  const index = props.items.findIndex((item) => item.id === props.value);
  if (index === -1) return;
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % props.items.length;
  else if (event.key === "ArrowLeft") next = (index - 1 + props.items.length) % props.items.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = props.items.length - 1;
  else return;
  event.preventDefault();
  select(props.items[next].id, true);
}

function onResize() {
  measure(props.value, false);
}

onMounted(async () => {
  await nextTick();
  measure(props.value, false);
  window.addEventListener("resize", onResize);
});

watch(
  () => props.value,
  (key) => nextTick(() => measure(key, true)),
);

onBeforeUnmount(() => window.removeEventListener("resize", onResize));

const style = () => ({
  ...(props.duration ? { "--mf-tabs-duration": `${props.duration}ms` } : {}),
  ...(props.easing ? { "--mf-tabs-ease": props.easing } : {}),
});
</script>

<template>
  <div :style="style()">
    <div class="mf-tabs" role="tablist" ref="list" @keydown="onKeydown">
      <span class="mf-tabs-indicator" aria-hidden="true" ref="indicator"></span>
      <button
        v-for="item in items"
        :key="item.id"
        :ref="(node) => setTab(item.id, node)"
        class="mf-tab"
        type="button"
        role="tab"
        :id="`${id}-${item.id}-tab`"
        :aria-selected="item.id === value"
        :aria-controls="`${id}-${item.id}-panel`"
        :tabindex="item.id === value ? 0 : -1"
        @click="select(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in items"
      :key="`${item.id}-panel`"
      class="mf-tabpanel"
      role="tabpanel"
      :id="`${id}-${item.id}-panel`"
      :aria-labelledby="`${id}-${item.id}-tab`"
      :hidden="item.id !== value"
    >
      <slot name="panel" :item="item" />
    </div>
  </div>
</template>
