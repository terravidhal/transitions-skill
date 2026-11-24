import { useEffect, useRef, useState, type CSSProperties } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  onCopy?: (text: string) => void;
  duration?: number;
  hold?: number;
};

export function CopyButton({ text, label = "Copy link", copiedLabel = "Copied", onCopy, duration, hold = 1600 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), hold);
    } catch {
      setCopied(false);
    }
  }

  const style = duration ? ({ "--mf-copy-duration": duration + "ms" } as CSSProperties) : undefined;

  return (
    <button className="mf-copy" type="button" aria-label={copied ? copiedLabel : label} data-mf-copied={copied} style={style} onClick={copy}>
      <span className="mf-copy-icon" aria-hidden="true">
        <span data-icon="copy"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span>
        <span data-icon="check"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </span>
      <span className="mf-copy-label">
        <span data-label="idle">{label}</span>
        <span data-label="done">{copiedLabel}</span>
      </span>
    </button>
  );
}
