<script lang="ts">
  let { label, options = [], value, duration, easing, onchange } = $props();
  let root: HTMLDivElement;
  const index = $derived(Math.max(0, options.findIndex((option) => option.value === value)));
  const style = $derived(
    "--mf-seg-count:" + options.length + ";" +
    "--mf-seg-index:" + index + ";" +
    (duration ? "--mf-seg-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-seg-ease:" + easing : "")
  );

  function move(next, event) {
    const option = options[(next + options.length) % options.length];
    if (!option) return;
    event.preventDefault();
    onchange?.(option.value);
    const buttons = root.querySelectorAll<HTMLButtonElement>(".mf-segmented-item");
    buttons[(next + options.length) % options.length]?.focus();
  }
</script>

<div bind:this={root} class="mf-segmented" role="group" aria-label={label} style={style}
  onkeydown={(event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") move(index + 1, event);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") move(index - 1, event);
  }}>
  <span class="mf-segmented-indicator" aria-hidden="true"></span>
  {#each options as option (option.value)}
    <button class="mf-segmented-item" type="button" aria-pressed={option.value === value} onclick={() => onchange?.(option.value)}>{option.label}</button>
  {/each}
</div>
