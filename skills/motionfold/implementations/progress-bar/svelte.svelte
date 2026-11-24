<script lang="ts">
  let { value, label = "Upload", duration, easing } = $props();
  const clamped = $derived(Math.max(0, Math.min(100, value)));
  const style = $derived(
    (duration ? "--mf-progress-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-progress-ease:" + easing : "")
  );
</script>

<div class="mf-progress-row" {style}>
  <div class="mf-progress-label"><span>{label}</span><span class="mf-progress-value">{Math.round(clamped)}%</span></div>
  <div class="mf-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(clamped)} aria-label={label} style={"--mf-progress:" + clamped}>
    <div class="mf-progress-fill"></div>
  </div>
</div>
