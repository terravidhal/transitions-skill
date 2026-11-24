<script lang="ts">
  let { label, options = [], value, duration, onchange } = $props();
  let root: HTMLDivElement;
  let trigger: HTMLButtonElement;
  let list: HTMLUListElement;
  let open = $state(false);
  let active = $state(Math.max(0, options.findIndex((option) => option.value === value)));
  const current = $derived(options.find((option) => option.value === value));
  const style = $derived(duration ? "--mf-dropdown-duration:" + duration + "ms" : "");

  $effect(() => {
    const onpointerdown = (event) => {
      if (open && !root?.contains(event.target)) open = false;
    };
    document.addEventListener("pointerdown", onpointerdown);
    return () => document.removeEventListener("pointerdown", onpointerdown);
  });

  $effect(() => {
    if (!open) return;
    const index = active;
    requestAnimationFrame(() => {
      list?.querySelectorAll<HTMLLIElement>(".mf-dropdown-item")[index]?.focus();
    });
  });

  function choose(index) {
    const option = options[index];
    if (!option) return;
    onchange?.(option.value);
    open = false;
    trigger?.focus();
  }
</script>

<div bind:this={root} class="mf-dropdown" data-mf-state={open ? "open" : "closed"} style={style}>
  <button bind:this={trigger} class="mf-dropdown-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} onclick={() => (open = !open)}
    onkeydown={(event) => { if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); open = true; } }}>
    <span class="mf-dropdown-value">{current?.label ?? label}</span>
    <span class="mf-dropdown-chevron" aria-hidden="true">⌄</span>
  </button>
  <ul bind:this={list} class="mf-dropdown-list" role="listbox" aria-label={label}
    onkeydown={(event) => {
      if (event.key === "ArrowDown") { event.preventDefault(); active = (active + 1) % options.length; }
      else if (event.key === "ArrowUp") { event.preventDefault(); active = (active - 1 + options.length) % options.length; }
      else if (event.key === "Home") { event.preventDefault(); active = 0; }
      else if (event.key === "End") { event.preventDefault(); active = options.length - 1; }
      else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(active); }
      else if (event.key === "Escape") { event.preventDefault(); open = false; trigger?.focus(); }
    }}>
    {#each options as option, index (option.value)}
      <li class="mf-dropdown-item" role="option" tabindex="-1" aria-selected={option.value === value} onclick={() => choose(index)}>{option.label}</li>
    {/each}
  </ul>
</div>
