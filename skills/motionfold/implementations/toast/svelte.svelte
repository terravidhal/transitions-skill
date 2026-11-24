<script lang="ts">
  import { createPresence } from "../_shared/presence.svelte";

  let {
    open = $bindable(false),
    title,
    duration,
    autoDismiss = 6000,
    closeLabel = "Dismiss",
    children,
  } = $props();

  const presence = createPresence(open, duration ?? 240);
  let remaining = $state(autoDismiss);
  let startedAt = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clear() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function start() {
    if (autoDismiss <= 0) return;
    clear();
    startedAt = Date.now();
    timer = setTimeout(() => (open = false), remaining);
  }

  function pause() {
    if (!timer) return;
    clear();
    remaining -= Date.now() - startedAt;
  }

  $effect(() => {
    presence.set(open);
    if (open) start();
    else clear();
    return clear;
  });
</script>

{#if $presence.mounted}
  <div
    class="mf-toast"
    data-mf-state={$presence.state}
    role="status"
    style={duration ? `--mf-toast-close-duration:${duration}ms` : ""}
    onmouseenter={pause}
    onmouseleave={start}
    onfocusin={pause}
    onfocusout={start}
  >
    <div class="mf-toast-body">
      {#if title}<strong class="mf-toast-title">{title}</strong>{/if}
      <span>{@render children()}</span>
    </div>
    <button class="mf-toast-close" type="button" aria-label={closeLabel} onclick={() => (open = false)}>×</button>
  </div>
{/if}
