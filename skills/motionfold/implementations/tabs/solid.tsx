import { createEffect, createSignal, createUniqueId, onCleanup, onMount, type JSX } from "solid-js";

type TabItem = { id: string; label: string; panel: JSX.Element };

type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  duration?: number;
  easing?: string;
};

export function Tabs(props: TabsProps) {
  const id = createUniqueId();
  let list!: HTMLDivElement;
  let indicator!: HTMLSpanElement;
  const refs: Record<string, HTMLButtonElement | undefined> = {};
  const [animated, setAnimated] = createSignal(false);

  const measure = (key: string, animate: boolean) => {
    const tab = refs[key];
    if (!list || !indicator || !tab) return;
    const listRect = list.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    if (!animate) indicator.style.transition = "none";
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - listRect.left}px)`;
    if (!animate) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
  };

  onMount(() => {
    measure(props.value, false);
    const onResize = () => measure(props.value, false);
    window.addEventListener("resize", onResize);
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  createEffect(() => {
    const key = props.value;
    measure(key, animated());
    setAnimated(true);
  });

  const onKeyDown = (event: KeyboardEvent) => {
    const index = props.items.findIndex((item) => item.id === props.value);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % props.items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + props.items.length) % props.items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = props.items.length - 1;
    else return;
    event.preventDefault();
    props.onValueChange(props.items[next].id);
    refs[props.items[next].id]?.focus();
  };

  const style = () =>
    [
      props.duration ? `--mf-tabs-duration:${props.duration}ms` : "",
      props.easing ? `--mf-tabs-ease:${props.easing}` : "",
    ]
      .filter(Boolean)
      .join(";");

  return (
    <div style={style()}>
      <div class="mf-tabs" role="tablist" ref={list} onKeyDown={onKeyDown}>
        <span class="mf-tabs-indicator" aria-hidden="true" ref={indicator} />
        {props.items.map((item) => (
          <button
            ref={(node) => (refs[item.id] = node)}
            class="mf-tab"
            type="button"
            role="tab"
            id={`${id}-${item.id}-tab`}
            aria-selected={item.id === props.value}
            aria-controls={`${id}-${item.id}-panel`}
            tabIndex={item.id === props.value ? 0 : -1}
            onClick={() => props.onValueChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {props.items.map((item) => (
        <div
          class="mf-tabpanel"
          role="tabpanel"
          id={`${id}-${item.id}-panel`}
          aria-labelledby={`${id}-${item.id}-tab`}
          hidden={item.id !== props.value}
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
