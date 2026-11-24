<script lang="ts">
  let {
    value = $bindable(""),
    label,
    error,
    placeholder,
    type = "text",
    duration,
  } = $props();
  const id = `mf-field-${Math.random().toString(36).slice(2, 9)}`;
  let input: HTMLInputElement;
  let wasError = false;

  $effect(() => {
    if (!input) return;
    if (error && !wasError) {
      input.dataset.mfShake = "false";
      void input.offsetWidth;
      input.dataset.mfShake = "true";
      input.focus();
      input.addEventListener(
        "animationend",
        () => {
          input.dataset.mfShake = "false";
        },
        { once: true },
      );
    }
    if (!error) input.dataset.mfShake = "false";
    wasError = Boolean(error);
  });

  const style = $derived(duration ? `--mf-shake-duration:${duration}ms` : "");
</script>

<div class="mf-field" data-mf-invalid={Boolean(error)} style={style}>
  <label class="mf-field-label" for={id}>{label}</label>
  <input
    bind:this={input}
    bind:value
    class="mf-input"
    id={id}
    {type}
    {placeholder}
    aria-invalid={Boolean(error)}
    aria-describedby={error ? `${id}-error` : undefined}
  />
  <p class="mf-field-error" id={`${id}-error`} role="alert" hidden={!error}>{error}</p>
</div>
