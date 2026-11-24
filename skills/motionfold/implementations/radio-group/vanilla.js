// Radio group behavior. Native inputs do the work; this adds a change callback.

export function setupRadioGroup(root, { onChange } = {}) {
  if (!root) return null;
  const inputs = [...root.querySelectorAll("input[type='radio']")];

  const handler = (event) => {
    if (event.target instanceof HTMLInputElement && event.target.checked) {
      onChange?.(event.target.value, event.target);
    }
  };

  root.addEventListener("change", handler);

  return {
    value() {
      return inputs.find((input) => input.checked)?.value ?? null;
    },
    destroy() {
      root.removeEventListener("change", handler);
    },
  };
}
