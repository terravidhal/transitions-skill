<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

type Command = { id: string; label: string; hint?: string };
const props = defineProps<{ open: boolean; commands: Command[]; duration?: number }>();
const emit = defineEmits<{ close: []; run: [id: string] }>();
const dialog = ref<HTMLDialogElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const query = ref("");
const active = ref(0);

const visible = computed(() => props.commands.filter((command) => command.label.toLowerCase().includes(query.value.toLowerCase())));

function sync(open: boolean) {
  const element = dialog.value;
  if (!element) return;
  if (open && !element.open) {
    element.showModal();
    query.value = "";
    active.value = 0;
    nextTick(() => input.value?.focus());
  } else if (!open && element.open) element.close();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") { event.preventDefault(); active.value = (active.value + 1) % Math.max(1, visible.value.length); }
  else if (event.key === "ArrowUp") { event.preventDefault(); active.value = (active.value - 1 + visible.value.length) % Math.max(1, visible.value.length); }
  else if (event.key === "Enter" && visible.value[active.value]) { event.preventDefault(); emit("run", visible.value[active.value].id); emit("close"); }
}

watch(() => props.open, sync);
onMounted(() => sync(props.open));
</script>

<template>
  <dialog ref="dialog" class="mf-command" aria-label="Command palette" aria-modal="true" :style="props.duration ? { '--mf-command-duration': props.duration + 'ms' } : undefined" @close="emit('close')" @cancel.prevent="emit('close')">
    <input ref="input" v-model="query" class="mf-command-input" type="search" aria-label="Search commands" @input="active = 0" @keydown="onKeydown" />
    <ul class="mf-command-list" role="listbox" aria-label="Commands">
      <li v-for="(command, index) in visible" :key="command.id" class="mf-command-item" role="option" :aria-selected="index === active" @click="emit('run', command.id); emit('close')">
        {{ command.label }}<span v-if="command.hint">{{ command.hint }}</span>
      </li>
    </ul>
    <p class="mf-command-hint">↑↓ to move · Enter to run · Esc to close</p>
  </dialog>
</template>
