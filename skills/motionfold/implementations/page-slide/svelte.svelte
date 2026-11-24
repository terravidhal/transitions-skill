<script module lang="ts">
  import { withViewTransition } from "../_shared/view-transition.js";

  export function navigatePage(update: () => void, direction: "forward" | "back" = "forward") {
    return withViewTransition(update, { direction });
  }
</script>

<script lang="ts">
  let { pageKey, title, children } = $props();
  let heading: HTMLHeadingElement;
  let previous = pageKey;

  $effect(() => {
    if (previous === pageKey) return;
    previous = pageKey;
    heading?.focus({ preventScroll: true });
  });
</script>

<section class="mf-page" data-mf-page={pageKey}>
  <h2 bind:this={heading} tabindex="-1">{title}</h2>
  {@render children()}
</section>
