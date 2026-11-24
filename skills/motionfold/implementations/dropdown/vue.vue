<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

type Option = { value: string; label: string };
const props = defineProps<{ label: string; options: Option[]; value: string; duration?: number }>();
const emit = defineEmits<{ change: [value: string] }>();
const root = ref<HTMLDivElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const list = ref<HTMLUListElement | null>(null);
const open = ref(false);
const active = ref(Math.max(0, props.options.findIndex((option) => option.value === props.value)));

function toggle() {
  open.value = !open.value;
}

function choose(index: number) {
  const option = props.options[index];
  if (!option) return;
  emit("change", option.value);
  open.value = false;
  trigger.value?.focus();
}

function onPointerDown(event: PointerEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) open.value = false;
}

watch(() => props.value, (value) => {
  active.value = Math.max(0, props.options.findIndex((option) => option.value === value));
});

watch([open, active], async ([isOpen, index]) => {
  if (!isOpen) return;
  await nextTick();
  list.value?.querySelectorAll<HTMLLIElement>(".mf-dropdown-item")[index]?.focus();
});

document.addEventListener("pointerdown", onPointerDown);
onBeforeUnmount(() => document.removeEventListener("pointerdown", onPointerDown));
</script>

<template>
  <div ref="root" class="mf-dropdown" :data-mf-state="open ? 'open' : 'closed'" :style="props.duration ? { '--mf-dropdown-duration': props.duration + 'ms' } : undefined">
    <button ref="trigger" class="mf-dropdown-trigger" type="button" aria-haspopup="listbox" :aria-expanded="open" @click="toggle"
      @keydown.down.prevent="open = true" @keydown.up.prevent="open = true" @keydown.enter.prevent="open = true" @keydown.space.prevent="open = true">
      <span class="mf-dropdown-value">{{ props.options.find((option) => option.value === value)?.label ?? label }}</span>
      <span class="mf-dropdown-chevron" aria-hidden="true">⌄</span>
    </button>
    <ul ref="list" class="mf-dropdown-list" role="listbox" :aria-label="label" @keydown.down.prevent="active = (active + 1) % options.length" @keydown.up.prevent="active = (active - 1 + options.length) % options.length" @keydown.home.prevent="active = 0" @keydown.end.prevent="active = options.length - 1" @keydown.enter.prevent="choose(active)" @keydown.space.prevent="choose(active)" @keydown.esc.prevent="open = false; trigger?.focus()">
      <li v-for="(option, index) in options" :key="option.value" class="mf-dropdown-item" role="option" :tabindex="-1" :aria-selected="option.value === value" @click="choose(index)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
