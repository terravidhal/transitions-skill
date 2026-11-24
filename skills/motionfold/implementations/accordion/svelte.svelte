<script lang="ts">
  let {
    open = $bindable(false),
    title,
    duration,
    easing,
    children,
  } = $props();
  const id = `mf-accordion-${Math.random().toString(36).slice(2, 9)}`;
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const style = $derived(
    [duration ? `--mf-accordion-duration:${duration}ms` : "", easing ? `--mf-accordion-ease:${easing}` : ""]
      .filter(Boolean)
      .join(";"),
  );
</script>

<div class="mf-accordion" data-mf-open={open} style={style}>
  <button
    class="mf-accordion-trigger"
    type="button"
    id={triggerId}
    aria-expanded={open}
    aria-controls={panelId}
    onclick={() => (open = !open)}
  >
    <span>{title}</span>
    <span class="mf-accordion-chevron" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6.5L8 10.5L12 6.5"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </span>
  </button>
  <div class="mf-accordion-panel" id={panelId} role="region" aria-labelledby={triggerId} inert={!open}>
    <div class="mf-accordion-inner">{@render children()}</div>
  </div>
</div>
