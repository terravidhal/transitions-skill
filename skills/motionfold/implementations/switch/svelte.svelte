<script lang="ts">
  let {
    checked = $bindable(false),
    label,
    duration,
    easing,
    travel,
  } = $props();
  const style = $derived(
    [
      duration ? `--mf-switch-duration:${duration}ms` : "",
      easing ? `--mf-switch-ease:${easing}` : "",
      travel ? `--mf-switch-travel:${travel}px` : "",
    ]
      .filter(Boolean)
      .join(";"),
  );
</script>

<button
  class="mf-switch"
  type="button"
  role="switch"
  aria-checked={checked}
  style={style}
  onclick={() => (checked = !checked)}
>
  <span class="mf-switch-track" aria-hidden="true">
    <span class="mf-switch-thumb"></span>
  </span>
  <span>{label}</span>
</button>
