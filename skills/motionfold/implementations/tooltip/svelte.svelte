<script lang="ts">
  let { label, side = "top", children } = $props();
  const id = `mf-tooltip-${Math.random().toString(36).slice(2, 9)}`;
</script>

<span class="mf-tooltip" data-mf-side={side}>
  <span class="mf-tooltip-anchor" aria-describedby={id}>
    {@render children()}
  </span>
  <span class="mf-tooltip-bubble" role="tooltip" id={id}>{label}</span>
</span>
