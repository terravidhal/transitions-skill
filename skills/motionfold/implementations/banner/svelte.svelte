<script lang="ts">
  let { open = false, duration, ondismiss, children } = $props();
  let mounted = $state(open);
  let state = $state(open ? "open" : "closed");
  let timer;

  $effect(() => {
    clearTimeout(timer);
    if (open) {
      mounted = true;
      state = "open";
      return;
    }
    if (!mounted) return;
    state = "closing";
    timer = setTimeout(() => {
      mounted = false;
      state = "closed";
    }, (duration ?? 200) + 60);
    return () => clearTimeout(timer);
  });
</script>

{#if mounted}
  <div class="mf-banner" data-mf-state={state} style={duration ? "--mf-banner-close-duration:" + duration + "ms" : ""} role="status">
    <span class="mf-banner-icon" aria-hidden="true">◆</span>
    <p class="mf-banner-text">{@render children?.()}</p>
    <button class="mf-banner-close" type="button" aria-label="Dismiss" onclick={ondismiss}>×</button>
  </div>
{/if}
