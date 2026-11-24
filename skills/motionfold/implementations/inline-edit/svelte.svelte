<script lang="ts">
  let { value, label = "Project name", duration, easing, onsave } = $props();
  let editing = $state(false);
  let draft = $state(value);
  let input: HTMLInputElement;
  let view: HTMLButtonElement;
  const style = $derived(
    (duration ? "--mf-inline-duration:" + duration + "ms;" : "") +
    (easing ? "--mf-inline-ease:" + easing : "")
  );

  $effect(() => {
    if (!editing) return;
    draft = value;
    requestAnimationFrame(() => { input?.focus(); input?.select(); });
  });

  function save() {
    const next = draft.trim();
    if (next) onsave?.(next);
    editing = false;
    requestAnimationFrame(() => view?.focus());
  }

  function cancel() {
    draft = value;
    editing = false;
    requestAnimationFrame(() => view?.focus());
  }
</script>

<div class="mf-inline-edit" data-mf-editing={editing} {style}>
  <button bind:this={view} class="mf-inline-edit-view" type="button" aria-label={"Edit " + label} onclick={() => (editing = true)}>
    <span class="mf-inline-edit-label">{value}</span>
    <span class="mf-inline-edit-pencil" aria-hidden="true">✎</span>
  </button>
  <form class="mf-inline-edit-form" onsubmit={(event) => { event.preventDefault(); save(); }}>
    <input bind:this={input} bind:value={draft} class="mf-inline-edit-input" aria-label={label} onkeydown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }} onblur={save} />
  </form>
</div>
