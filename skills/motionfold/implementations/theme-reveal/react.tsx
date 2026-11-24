import { useRef, type CSSProperties } from "react";

type ThemeRevealProps = {
  onReveal: () => void;
  label?: string;
  duration?: number;
  easing?: string;
};

export function ThemeReveal({ onReveal, label = "Switch theme", duration, easing }: ThemeRevealProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const style = {
    ...(duration ? { "--mf-theme-duration": duration + "ms" } : {}),
    ...(easing ? { "--mf-theme-ease": easing } : {}),
  } as CSSProperties;

  function reveal() {
    if (!document.startViewTransition) {
      onReveal();
      return;
    }
    const rect = ref.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    document.documentElement.style.setProperty("--mf-theme-x", x + "px");
    document.documentElement.style.setProperty("--mf-theme-y", y + "px");
    document.documentElement.style.setProperty("--mf-theme-radius", Math.hypot(window.innerWidth, window.innerHeight) + "px");
    document.startViewTransition(onReveal);
  }

  return (
    <button ref={ref} className="mf-theme-reveal" type="button" style={style} onClick={reveal}>
      <span aria-hidden="true">◐</span>
      <span>{label}</span>
    </button>
  );
}
