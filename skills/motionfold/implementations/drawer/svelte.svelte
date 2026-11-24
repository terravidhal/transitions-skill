<script lang="ts">
  let {
    open = $bindable(false),
    title,
    side = "right",
    duration,
    easing,
    distance,
    children,
  } = $props();
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
      duration ? `--mf-drawer-duration:${duration}ms` : "",
      easing ? `--mf-drawer-ease:${easing}` : "",
      distance ? `--mf-drawer-distance:${distance}` : "",
    ]
      .filter(Boolean)
      .join(";"),
  );
</script>

<dialog
  bind:this={dialog}
  class="mf-drawer"
  data-side={side}
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
  <div class="mf-drawer-header">
    <h2 class="mf-drawer-title">{title}</h2>
    <button class="mf-drawer-close" type="button" aria-label="Close" onclick={close}>×</button>
  </div>
  <div class="mf-drawer-body">{@render children()}</div>
</dialog>
