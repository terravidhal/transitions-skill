<script lang="ts">
  let { text, label = "Copy link", copiedLabel = "Copied", hold = 1600, duration, oncopy } = $props();
  let copied = $state(false);
  let timer;
  const style = $derived(duration ? "--mf-copy-duration:" + duration + "ms" : "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      oncopy?.(text);
      clearTimeout(timer);
      timer = setTimeout(() => (copied = false), hold);
    } catch {
      copied = false;
    }
  }
</script>

<button class="mf-copy" type="button" aria-label={copied ? copiedLabel : label} data-mf-copied={copied} {style} onclick={copy}>
  <span class="mf-copy-icon" aria-hidden="true">
    <span data-icon="copy"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg></span>
    <span data-icon="check"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
  </span>
  <span class="mf-copy-label">
    <span data-label="idle">{label}</span>
    <span data-label="done">{copiedLabel}</span>
  </span>
</button>
