<script lang="ts">
  let { label, duration, easing, distance, scale, children } = $props();
  let trigger: HTMLButtonElement;
  let panel: HTMLDivElement;
  let open = $state(false);
  const id = `mf-popover-${Math.random().toString(36).slice(2, 9)}`;

  function position() {
    if (!trigger || !panel) return;
    const rect = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    let side = "bottom";
    if (rect.bottom + 8 + height > window.innerHeight && rect.top - 8 - height > 0) side = "top";
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = side === "top" ? rect.top - 8 - height : rect.bottom + 8;
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(8, top)}px`;
    panel.dataset.mfSide = side;
  }

  function toggle() {
    if (!panel) return;
    if (panel.matches(":popover-open")) panel.hidePopover();
    else {
      panel.showPopover();
      position();
    }
  }

  $effect(() => {
    if (!panel) return;
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      open = next;
      trigger.setAttribute("aria-expanded", String(next));
      if (next) {
        position();
        requestAnimationFrame(position);
        panel.querySelector<HTMLElement>('[role="menuitem"], a, button')?.focus();
      } else if (panel.contains(document.activeElement)) {
        trigger.focus();
      }
    };
    panel.addEventListener("toggle", onToggle);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      panel.removeEventListener("toggle", onToggle);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  });

  const style = $derived(
    [
      duration ? `--mf-popover-duration:${duration}ms` : "",
      easing ? `--mf-popover-ease:${easing}` : "",
      distance ? `--mf-popover-distance:${distance}px` : "",
      scale ? `--mf-popover-scale:${scale}` : "",
    ]
      .filter(Boolean)
      .join(";"),
  );
</script>

<button
  bind:this={trigger}
  type="button"
  aria-expanded={open}
  aria-controls={id}
  aria-haspopup="menu"
  onclick={(event) => {
    event.preventDefault();
    toggle();
  }}
>
  {label}
</button>
<div bind:this={panel} id={id} popover="auto" class="mf-popover" role="menu" style={style}>
  {@render children()}
</div>
