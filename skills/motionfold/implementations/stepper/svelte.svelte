<script lang="ts">
  let { steps = [], step = 0, duration, easing, onchange } = $props();
  let root: HTMLDivElement;
  const index = $derived(Math.max(0, Math.min(steps.length - 1, step)));
  const style = $derived(
    "--mf-stepper-progress:" + (steps.length > 1 ? index / (steps.length - 1) : 0) + ";" +
    (duration ? "--mf-stepper-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-stepper-ease:" + easing : "")
  );

  function go(next) {
    onchange?.(Math.max(0, Math.min(steps.length - 1, next)));
  }
</script>

<div bind:this={root} class="mf-stepper" data-mf-step={index} {style}>
  <div class="mf-stepper-track" aria-label="Progress">
    <div class="mf-stepper-line" aria-hidden="true"><span></span></div>
    {#each steps as label, position (label)}
      <div class="mf-step" data-active={position === index} data-done={position < index} aria-current={position === index ? "step" : undefined}>
        <span class="mf-step-dot" aria-hidden="true"><span class="mf-step-index">{position + 1}</span></span>
        <span>{label}</span>
      </div>
    {/each}
  </div>
  <div class="mf-stepper-panels">
    {#each steps as label, position (label)}
      <div class="mf-step-panel" data-active={position === index} hidden={position !== index}>
        <h3 tabindex="-1">{label}</h3>
        <p>Step {position + 1} of {steps.length}. The heading receives focus when the step changes.</p>
      </div>
    {/each}
  </div>
  <div>
    <button class="mf-step-nav" type="button" disabled={index === 0} onclick={() => go(index - 1)}>Back</button>
    <button class="mf-step-nav" type="button" disabled={index === steps.length - 1} onclick={() => go(index + 1)}>Next</button>
  </div>
</div>
