<script lang="ts">
  let { value, duration } = $props();
  let root: HTMLSpanElement;
  let current: HTMLSpanElement;
  let ghost: HTMLSpanElement;
  let previous = value;
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const next = value;
    if (!root || !current || !ghost || previous === next) return;
    ghost.textContent = previous;
    root.dataset.mfSwapping = "false";
    void root.offsetWidth;
    current.textContent = next;
    root.dataset.mfSwapping = "true";
    previous = next;
    clearTimeout(timer);
    timer = setTimeout(() => {
      root.dataset.mfSwapping = "false";
      ghost.textContent = "";
    }, 220);
  });

  const style = $derived(duration ? `--mf-text-swap-duration:${duration}ms` : "");
</script>

<span class="mf-text-swap" bind:this={root} data-mf-swapping="false" aria-live="polite" style={style}>
  <span class="mf-text-swap-value" bind:this={current}>{value}</span>
  <span class="mf-text-swap-ghost" bind:this={ghost} aria-hidden="true"></span>
</span>
