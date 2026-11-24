<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const props = defineProps<{ value: string; label?: string; duration?: number; easing?: string }>();
const emit = defineEmits<{ save: [value: string] }>();
const editing = ref(false);
const draft = ref(props.value);
const input = ref<HTMLInputElement | null>(null);
const view = ref<HTMLButtonElement | null>(null);

watch(editing, async (value) => {
  if (!value) return;
  draft.value = props.value;
  await nextTick();
  input.value?.focus();
  input.value?.select();
});

function save() {
  const next = draft.value.trim();
  if (next) emit("save", next);
  editing.value = false;
  nextTick(() => view.value?.focus());
}

function cancel() {
  draft.value = props.value;
  editing.value = false;
  nextTick(() => view.value?.focus());
}
</script>

<template>
  <div class="mf-inline-edit" :data-mf-editing="editing" :style="{ ...(props.duration ? { '--mf-inline-duration': props.duration + 'ms' } : {}), ...(props.easing ? { '--mf-inline-ease': props.easing } : {}) }">
    <button ref="view" class="mf-inline-edit-view" type="button" :aria-label="'Edit ' + (label ?? 'Project name')" @click="editing = true">
      <span class="mf-inline-edit-label">{{ value }}</span>
      <span class="mf-inline-edit-pencil" aria-hidden="true">✎</span>
    </button>
    <form class="mf-inline-edit-form" @submit.prevent="save">
      <input ref="input" v-model="draft" class="mf-inline-edit-input" :aria-label="label ?? 'Project name'" @keydown.esc.prevent="cancel" @blur="save" />
    </form>
  </div>
</template>
