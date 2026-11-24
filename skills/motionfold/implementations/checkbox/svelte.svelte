<script lang="ts">
  let {
    checked = $bindable(false),
    label,
    description,
    duration,
  } = $props();
  let box: HTMLSpanElement;
  let path: SVGPathElement;

  $effect(() => {
    if (!box || !path) return;
    const length = Math.ceil(path.getTotalLength()) + 1;
    box.style.setProperty("--mf-checkbox-path-length", String(length));
  });

  const style = $derived(duration ? `--mf-checkbox-draw-duration:${duration}ms` : "");
</script>

<label class="mf-checkbox">
  <input type="checkbox" bind:checked />
  <span class="mf-checkbox-box" bind:this={box} aria-hidden="true" style={style}>
    <svg viewBox="0 0 16 16">
      <path bind:this={path} class="mf-checkbox-check" d="M3.5 8.5L6.5 11.5L12.5 4.5"></path>
    </svg>
  </span>
  <span class="mf-checkbox-label">
    {label}
    {#if description}<span class="mf-sr-only"> — {description}</span>{/if}
  </span>
</label>
