import { useEffect, useId, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = { id: string; label: string; panel: ReactNode };

type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  duration?: number;
  easing?: string;
};

export function Tabs({ items, value, onValueChange, duration, easing }: TabsProps) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measure = (key: string, animate: boolean) => {
    const list = listRef.current;
    const tab = tabRefs.current[key];
    const indicator = indicatorRef.current;
    if (!list || !tab || !indicator) return;
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

  useLayoutEffect(() => {
    measure(value, false);
  }, []);

  useEffect(() => {
    measure(value, true);
  }, [value]);

  useEffect(() => {
    const onResize = () => measure(value, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === value);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    onValueChange(items[next].id);
    tabRefs.current[items[next].id]?.focus();
  };

  const style = {
    ...(duration ? { "--mf-tabs-duration": `${duration}ms` } : {}),
    ...(easing ? { "--mf-tabs-ease": easing } : {}),
  } as CSSProperties;

  return (
    <div style={style}>
      <div className="mf-tabs" role="tablist" ref={listRef} onKeyDown={onKeyDown}>
        <span className="mf-tabs-indicator" aria-hidden="true" ref={indicatorRef} />
        {items.map((item) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              className="mf-tab"
              type="button"
              role="tab"
              id={`${id}-${item.id}-tab`}
              aria-selected={selected}
              aria-controls={`${id}-${item.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="mf-tabpanel"
          role="tabpanel"
          id={`${id}-${item.id}-panel`}
          aria-labelledby={`${id}-${item.id}-tab`}
          hidden={item.id !== value}
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
