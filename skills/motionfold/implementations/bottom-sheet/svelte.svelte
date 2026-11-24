<script lang="ts">
  let { open = false, title, duration, onclose, children } = $props();
  let dialog: HTMLDialogElement;

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });

  const style = $derived(duration ? "--mf-sheet-duration:" + duration + "ms" : "");
</script>

<dialog bind:this={dialog} class="mf-sheet" aria-label={title} aria-modal="true" style={style} onclose={onclose} oncancel={(event) => { event.preventDefault(); onclose?.(); }}>
  <div class="mf-sheet-handle" aria-hidden="true"></div>
  <div class="mf-sheet-header">
    <h2 class="mf-sheet-title">{title}</h2>
    <button class="mf-sheet-close" type="button" aria-label="Close" onclick={onclose}>×</button>
  </div>
  <div class="mf-sheet-body">{@render children?.()}</div>
</dialog>
