<script lang="ts">
  let { open = $bindable(false), title, duration, easing, distance, closeLabel = "Close", children } = $props();
  let dialog: HTMLDialogElement;

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });

  function close() {
    open = false;
  }

  const style = $derived(
    [
      duration ? `--mf-modal-duration:${duration}ms` : "",
      easing ? `--mf-modal-ease:${easing}` : "",
      distance ? `--mf-modal-distance:${distance}px` : "",
    ]
      .filter(Boolean)
      .join(";"),
  );
</script>

<dialog
  bind:this={dialog}
  class="mf-modal"
  aria-label={title}
  aria-modal="true"
  style={style}
  oncancel={(event) => {
    event.preventDefault();
    close();
  }}
  onclose={close}
  onclick={(event) => {
    if (event.target === dialog) close();
  }}
>
  <div class="mf-modal-header">
    <h2 class="mf-modal-title">{title}</h2>
    <button class="mf-modal-close" type="button" aria-label={closeLabel} onclick={close}>×</button>
  </div>
  <div class="mf-modal-body">{@render children()}</div>
</dialog>
