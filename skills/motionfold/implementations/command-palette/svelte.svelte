<script lang="ts">
  let { open = false, commands = [], duration, onclose, onrun } = $props();
  let dialog: HTMLDialogElement;
  let input: HTMLInputElement;
  let query = $state("");
  let active = $state(0);
  const visible = $derived(commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())));

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      query = "";
      active = 0;
      requestAnimationFrame(() => input?.focus());
    } else if (!open && dialog.open) dialog.close();
  });

  const style = $derived(duration ? "--mf-command-duration:" + duration + "ms" : "");

  function onkeydown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); active = (active + 1) % Math.max(1, visible.length); }
    else if (event.key === "ArrowUp") { event.preventDefault(); active = (active - 1 + visible.length) % Math.max(1, visible.length); }
    else if (event.key === "Enter" && visible[active]) { event.preventDefault(); onrun?.(visible[active].id); onclose?.(); }
  }
</script>

<dialog bind:this={dialog} class="mf-command" aria-label="Command palette" aria-modal="true" style={style} onclose={onclose} oncancel={(event) => { event.preventDefault(); onclose?.(); }}>
  <input bind:this={input} bind:value={query} class="mf-command-input" type="search" aria-label="Search commands" oninput={() => (active = 0)} onkeydown={onkeydown} />
  <ul class="mf-command-list" role="listbox" aria-label="Commands">
    {#each visible as command, index (command.id)}
      <li class="mf-command-item" role="option" aria-selected={index === active} onclick={() => { onrun?.(command.id); onclose?.(); }}>
        {command.label}{#if command.hint}<span>{command.hint}</span>{/if}
      </li>
    {/each}
  </ul>
  <p class="mf-command-hint">↑↓ to move · Enter to run · Esc to close</p>
</dialog>
