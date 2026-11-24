<script lang="ts">
  let { state = "loading", label = "Working", doneLabel = "Done", duration, easing } = $props();
  const style = $derived(
    (duration ? "--mf-spinner-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-spinner-ease:" + easing : "")
  );
</script>

<span class="mf-spinner" data-mf-state={state} aria-busy={state === "loading"} {style} role="status">
  <span class="mf-spinner-ring" aria-hidden="true"></span>
  <span class="mf-spinner-check" aria-hidden="true">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </span>
  <span class="mf-spinner-label mf-sr-only">{state === "done" ? doneLabel : label}</span>
</span>
