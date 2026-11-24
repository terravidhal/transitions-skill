// Like button behavior. The count and aria-pressed carry the meaning.

export function setupLike(button, { initial = false, count, onChange } = {}) {
  if (!button) return null;
  let liked = button.getAttribute("data-mf-liked") === "true" || initial;
  let current = typeof count === "number" ? count : Number(button.querySelector(".mf-like-count")?.textContent ?? 0);
  const output = button.querySelector(".mf-like-count");

  function render() {
    button.setAttribute("data-mf-liked", String(liked));
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-label", liked ? "Unlike" : "Like");
    if (output) output.textContent = String(current);
  }

  function toggle() {
    liked = !liked;
    current += liked ? 1 : -1;
    render();
    onChange?.(liked, current);
  }

  const onClick = () => toggle();
  button.addEventListener("click", onClick);
  render();

  return {
    toggle,
    get liked() {
      return liked;
    },
    destroy() {
      button.removeEventListener("click", onClick);
    },
  };
}
