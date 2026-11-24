<script lang="ts">
  let { ready, label = "Loading", loadedLabel = "Content loaded", duration, children } = $props();
  const style = $derived(duration ? `--mf-skeleton-reveal-duration:${duration}ms` : "");
</script>

<div class="mf-skeleton" data-mf-state={ready ? "ready" : "loading"} aria-busy={!ready} style={style}>
  <div class="mf-skeleton-placeholder" aria-hidden="true">
    <span class="mf-skeleton-block"></span>
    <span class="mf-skeleton-line" data-width="medium"></span>
    <span class="mf-skeleton-line" data-width="short"></span>
  </div>
  <div class="mf-skeleton-content">{@render children()}</div>
  <span class="mf-sr-only" role="status">{ready ? loadedLabel : label}</span>
</div>
