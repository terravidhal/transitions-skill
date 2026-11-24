type ThemeRevealProps = {
  onReveal: () => void;
  label?: string;
  duration?: number;
  easing?: string;
};

export function ThemeReveal(props: ThemeRevealProps) {
  let button!: HTMLButtonElement;

  function reveal() {
    if (!document.startViewTransition) {
      props.onReveal();
      return;
    }
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    document.documentElement.style.setProperty("--mf-theme-x", x + "px");
    document.documentElement.style.setProperty("--mf-theme-y", y + "px");
    document.documentElement.style.setProperty("--mf-theme-radius", Math.hypot(window.innerWidth, window.innerHeight) + "px");
    document.startViewTransition(props.onReveal);
  }

  return (
    <button ref={button} class="mf-theme-reveal" type="button" style={{
      ...(props.duration ? { "--mf-theme-duration": props.duration + "ms" } : {}),
      ...(props.easing ? { "--mf-theme-ease": props.easing } : {}),
    }} onClick={reveal}>
      <span aria-hidden="true">◐</span>
      <span>{props.label ?? "Switch theme"}</span>
    </button>
  );
}
