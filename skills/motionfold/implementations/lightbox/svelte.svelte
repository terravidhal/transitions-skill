<script lang="ts">
  let { open = false, caption, duration, onclose, children } = $props();
  let dialog: HTMLDialogElement;

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });

  const style = $derived(duration ? "--mf-lightbox-duration:" + duration + "ms" : "");
</script>

<dialog bind:this={dialog} class="mf-lightbox" aria-label={caption ?? "Image preview"} aria-modal="true" style={style} onclose={onclose} oncancel={(event) => { event.preventDefault(); onclose?.(); }}>
  <figure class="mf-lightbox-figure">
    <div class="mf-lightbox-image" role="img" aria-label={caption ?? "Preview"}>{@render children?.()}</div>
    {#if caption}<figcaption>{caption}</figcaption>{/if}
  </figure>
  <button class="mf-lightbox-close" type="button" aria-label="Close" onclick={onclose}>×</button>
</dialog>
