<script lang="ts">
  let {
    items,
    value = $bindable(),
    duration,
    easing,
    children,
  } = $props();
  let list: HTMLDivElement;
  let indicator: HTMLSpanElement;
  let tabs: Record<string, HTMLButtonElement> = $state({});
  let first = true;

  function register(node: HTMLButtonElement, key: string) {
    tabs[key] = node;
    return {
      destroy() {
        delete tabs[key];
      },
    };
  }

  function measure(key: string, animate: boolean) {
    const tab = tabs[key];
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
  }

  $effect(() => {
    const key = value;
    queueMicrotask(() => {
      measure(key, !first);
      first = false;
    });
  });

  function onKeydown(event: KeyboardEvent) {
    const index = items.findIndex((item) => item.id === value);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    value = items[next].id;
    tabs[value]?.focus();
  }

  const style = $derived(
    [duration ? `--mf-tabs-duration:${duration}ms` : "", easing ? `--mf-tabs-ease:${easing}` : ""]
      .filter(Boolean)
      .join(";"),
  );
</script>

<div style={style}>
  <div class="mf-tabs" role="tablist" bind:this={list} onkeydown={onKeydown}>
    <span class="mf-tabs-indicator" aria-hidden="true" bind:this={indicator}></span>
    {#each items as item (item.id)}
      <button
        use:register={item.id}
        class="mf-tab"
        type="button"
        role="tab"
        id={`${item.id}-tab`}
        aria-selected={item.id === value}
        aria-controls={`${item.id}-panel`}
        tabindex={item.id === value ? 0 : -1}
        onclick={() => (value = item.id)}
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each items as item (item.id)}
    <div
      class="mf-tabpanel"
      role="tabpanel"
      id={`${item.id}-panel`}
      aria-labelledby={`${item.id}-tab`}
      hidden={item.id !== value}
    >
      {@render children(item)}
    </div>
  {/each}
</div>
