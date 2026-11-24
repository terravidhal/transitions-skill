<script lang="ts">
  let { value, duration, easing } = $props();
  let bump = $state(false);
  let first = true;
  const style = $derived(
    (duration ? "--mf-number-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-number-ease:" + easing : "")
  );

  $effect(() => {
    value;
    if (first) {
      first = false;
      return;
    }
    bump = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (bump = true)));
  });
</script>

<output class="mf-number" data-mf-bump={bump} aria-live="polite" {style}>
  <span class="mf-number-value">{value}</span>
</output>
