<script lang="ts">
  let { show, label = "Saved", duration } = $props();
  let root: HTMLSpanElement;
  let icon: SVGSVGElement;
  let path: SVGPathElement;
  let was = false;

  $effect(() => {
    if (!path || !icon) return;
    const length = Math.ceil(path.getTotalLength()) + 1;
    icon.style.setProperty("--mf-check-path-length", String(length));
  });

  $effect(() => {
    if (!root) return;
    if (show && !was) {
      root.dataset.mfState = "idle";
      void root.offsetWidth;
      root.dataset.mfState = "success";
    } else if (!show) {
      root.dataset.mfState = "idle";
    }
    was = show;
  });

  const style = $derived(duration ? `--mf-check-duration:${duration}ms` : "");
</script>

<span class="mf-success" bind:this={root} data-mf-state={show ? "success" : "idle"} role="status" style={style}>
  <svg class="mf-success-icon" bind:this={icon} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35"></circle>
    <path class="mf-success-path" bind:this={path} d="M7 12.5L10.5 16L17 8"></path>
  </svg>
  <span class="mf-success-text">{label}</span>
</span>
