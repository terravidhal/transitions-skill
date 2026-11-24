import { createSignal, onCleanup } from "solid-js";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  onCopy?: (text: string) => void;
  duration?: number;
  hold?: number;
};

export function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      props.onCopy?.(props.text);
      clearTimeout(timer);
      timer = setTimeout(() => setCopied(false), props.hold ?? 1600);
    } catch {
      setCopied(false);
    }
  }

  onCleanup(() => clearTimeout(timer));

  return (
    <button class="mf-copy" type="button" aria-label={copied() ? (props.copiedLabel ?? "Copied") : (props.label ?? "Copy")} data-mf-copied={copied()} style={props.duration ? { "--mf-copy-duration": props.duration + "ms" } : undefined} onClick={copy}>
      <span class="mf-copy-icon" aria-hidden="true">
        <span data-icon="copy"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg></span>
        <span data-icon="check"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
      </span>
      <span class="mf-copy-label">
        <span data-label="idle">{props.label ?? "Copy link"}</span>
        <span data-label="done">{props.copiedLabel ?? "Copied"}</span>
      </span>
    </button>
  );
}
