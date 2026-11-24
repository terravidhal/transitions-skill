<script lang="ts">
  let { label = "Switch theme", duration, easing, onreveal } = $props();
  let button: HTMLButtonElement;
  const style = $derived(
    (duration ? "--mf-theme-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-theme-ease:" + easing : "")
  );

  function reveal() {
    if (!document.startViewTransition) {
      onreveal?.();
      return;
    }
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    document.documentElement.style.setProperty("--mf-theme-x", x + "px");
    document.documentElement.style.setProperty("--mf-theme-y", y + "px");
    document.documentElement.style.setProperty("--mf-theme-radius", Math.hypot(window.innerWidth, window.innerHeight) + "px");
    document.startViewTransition(() => onreveal?.());
  }
</script>

<button bind:this={button} class="mf-theme-reveal" type="button" {style} onclick={reveal}>
  <span aria-hidden="true">◐</span>
  <span>{label}</span>
</button>
