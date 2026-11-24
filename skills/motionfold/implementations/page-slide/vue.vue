<script lang="ts">
import { nextTick, ref, watch } from "vue";
import { withViewTransition } from "../_shared/view-transition.js";

export function navigatePage(update: () => void, direction: "forward" | "back" = "forward") {
  return withViewTransition(update, { direction });
}
</script>

<script setup lang="ts">
const props = defineProps<{
  pageKey: string;
  title: string;
}>();

const heading = ref<HTMLHeadingElement | null>(null);

watch(
  () => props.pageKey,
  async () => {
    await nextTick();
    heading.value?.focus({ preventScroll: true });
  },
);
</script>

<template>
  <section class="mf-page" :data-mf-page="pageKey">
    <h2 ref="heading" tabindex="-1">{{ title }}</h2>
    <slot />
  </section>
</template>
