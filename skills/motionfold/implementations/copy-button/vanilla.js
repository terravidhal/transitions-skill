// Copy button behavior. Confirm only after the clipboard write resolves.

export function setupCopy(button, { text, onCopy, hold = 1600 } = {}) {
  if (!button) return null;
  let timer;

  function value() {
    if (typeof text === "function") return text();
    if (typeof text === "string") return text;
    return button.getAttribute("data-copy-text") ?? button.textContent.trim();
  }

  function set(copied) {
    button.setAttribute("data-mf-copied", String(copied));
    button.setAttribute("aria-label", copied ? "Copied" : "Copy");
  }

  async function run() {
    try {
      const payload = value();
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(payload);
      else {
        const field = document.createElement("textarea");
        field.value = payload;
        document.body.append(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      set(true);
      onCopy?.(payload);
      clearTimeout(timer);
      timer = setTimeout(() => set(false), hold);
    } catch {
      set(false);
    }
  }

  const onClick = () => run();
  button.addEventListener("click", onClick);
  set(false);

  return {
    copy: run,
    destroy() {
      clearTimeout(timer);
      button.removeEventListener("click", onClick);
    },
  };
}
