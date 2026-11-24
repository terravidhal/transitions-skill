// Error-shake behavior: set the invalid state, replay the shake, focus the field.

export function setupErrorShake(field) {
  if (!field) return null;
  const input = field.querySelector("input, textarea, select");
  const error = field.querySelector(".mf-field-error");

  function setInvalid(invalid) {
    field.dataset.mfInvalid = String(invalid);
    input?.setAttribute("aria-invalid", String(invalid));
    if (error) error.hidden = !invalid;
  }

  function shake() {
    if (!input) return;
    field.dataset.mfShake = "false";
    void input.offsetWidth;
    field.dataset.mfShake = "true";
    const done = () => {
      field.dataset.mfShake = "false";
      input.removeEventListener("animationend", done);
    };
    input.addEventListener("animationend", done);
  }

  function show(message) {
    if (error && message) error.textContent = message;
    setInvalid(true);
    shake();
    input?.focus();
  }

  function clear() {
    setInvalid(false);
    field.dataset.mfShake = "false";
  }

  return { show, clear, shake };
}
