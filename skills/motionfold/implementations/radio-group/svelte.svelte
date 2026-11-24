<script lang="ts">
  let { name, legend, options = [], value, duration, easing, onchange } = $props();
  const style = $derived(
    (duration ? "--mf-radio-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-radio-ease:" + easing : "")
  );
</script>

<fieldset class="mf-radio-group" style={style}>
  <legend class="mf-radio-legend">{legend}</legend>
  {#each options as option (option.value)}
    <label class="mf-radio">
      <input type="radio" {name} value={option.value} checked={option.value === value} onchange={() => onchange?.(option.value)} />
      <span class="mf-radio-box" aria-hidden="true"><span class="mf-radio-dot"></span></span>
      <span>{option.label}</span>
    </label>
  {/each}
</fieldset>
