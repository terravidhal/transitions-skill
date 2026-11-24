// Number pop behavior. Restart the attribute between frames to replay.

export function setupNumberPop(element) {
  if (!element) return null;
  const value = element.querySelector(".mf-number-value");
  let frame = 0;

  function bump() {
    element.setAttribute("data-mf-bump", "false");
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => element.setAttribute("data-mf-bump", "true"));
    });
  }

  function set(next) {
    if (value) value.textContent = String(next);
    bump();
  }

  return {
    set,
    bump,
    destroy() {
      cancelAnimationFrame(frame);
    },
  };
}
